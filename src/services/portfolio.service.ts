import mongoose from 'mongoose';
import Container, { Service } from 'typedi';

import { Portfolio, PriceAndAmount } from '@/interfaces/portfolio.interface';
import { PortfolioModel } from '@/models/portfolio.model';
import { WalletModel } from '@/models/wallet.model';

import { HttpException } from '@/exceptions/httpException';
import { BinanceService } from './binance.service';
import { CoingeckoService } from './coingecko.service';

@Service()
export class PortfolioService {
  public binanceService = Container.get(BinanceService);
  public coingeckoService = Container.get(CoingeckoService);

  public async getAllPortfolioByWalletId(walletId: string): Promise<Portfolio[]> {
    const wallet = await WalletModel.findById(walletId).lean();

    if (!wallet) {
      throw new HttpException(404, `Wallet with provided id doesn't exist`);
    }

    const portfolios = (await PortfolioModel.find({ walletId }).lean()) as Portfolio[];
    const binanceMarket = 'binance'

    const portfoliosDto = await Promise.all(
      portfolios.map(async portfolio => {
        const profitOrLoss =
          portfolio.market === binanceMarket
            ? await this.binanceService.calculateCryptoProfitOrLoss(portfolio.priceAndAmount, portfolio.nameAndSymbol.symbol)
            : await this.coingeckoService.calculateCryptoProfitOrLoss(portfolio.priceAndAmount, portfolio.nameAndSymbol.name);
        const totalPurchasePrice = portfolio.priceAndAmount.map(record => record.amount * record.price).reduce((acc, val) => acc + val, 0);

        return this.toDto({ ...portfolio, profitOrLoss, totalPurchasePrice });
      }),
    );

    return portfoliosDto;
  }

  public async getAccountBalance(walletId: string): Promise<string> {
    const wallet = await WalletModel.findById(walletId).lean();

    if (!wallet) {
      throw new HttpException(404, `Wallet with provided id doesn't exist`);
    }

    const portfolios = (await PortfolioModel.find({ walletId }).lean()) as Portfolio[];

    const profitOrLossAndPurchasePriceArr = await Promise.all(
      portfolios.map(async portfolio => {
        const profitOrLoss = await this.binanceService.calculateCryptoProfitOrLoss(portfolio.priceAndAmount, portfolio.nameAndSymbol.symbol);
        const totalPurchasePrice = portfolio.priceAndAmount.map(record => record.amount * record.price).reduce((acc, val) => acc + val, 0);
        return (Number(profitOrLoss.replace('$', '')) + totalPurchasePrice).toFixed(2);
      }),
    );

    const accountBalance =
      profitOrLossAndPurchasePriceArr
        .reduce((acc, val) => acc + Number(val), 0)
        .toFixed(2)
        .toString() + '$';

    return accountBalance;
  }

  public async createPortfolio(
    name: string,
    symbol: string,
    price: number,
    currency: string,
    amount: number,
    market: string,
    walletId: string,
  ): Promise<Portfolio> {
    const wallet = await WalletModel.findById(walletId).lean();

    if (!wallet) {
      throw new HttpException(404, `Wallet with provided id doesn't exist`);
    }

    const oldPortfolio: Portfolio | null = await PortfolioModel.findOne({
      walletId,
      'nameAndSymbol.symbol': symbol,
    });

    let portfolio;

    if (oldPortfolio) {
      portfolio = await PortfolioModel.findOneAndUpdate(
        { walletId, 'nameAndSymbol.symbol': symbol },
        {
          totalPurchasePrice: String(Number(oldPortfolio.totalPurchasePrice) + amount * price),
          totalAmount: oldPortfolio.totalAmount + amount,
          market: oldPortfolio.market,
          priceAndAmount: [
            ...oldPortfolio.priceAndAmount,
            {
              price,
              currency,
              amount,
            },
          ],
        },
        { new: true },
      ).lean();
    } else {
      const priceAmountArr = [
        {
          price: price,
          currency: currency,
          amount: amount,
        },
      ];

      const portfolioObj = {
        walletId: walletId,
        market,
        totalPurchasePrice: amount * price,
        totalAmount: amount,
        nameAndSymbol: {
          name,
          symbol,
        },
        priceAndAmount: priceAmountArr,
      };

      const createdPortfolio = await PortfolioModel.create(portfolioObj);
      portfolio = createdPortfolio.toObject();
    }

    const profitOrLoss = await this.binanceService.calculateCryptoProfitOrLoss(portfolio.priceAndAmount, symbol);

    return this.toDto({ ...portfolio, profitOrLoss });
  }

  public async updateAsset(id: string, amount: number, price: number): Promise<PriceAndAmount> {
    const portfolio = await PortfolioModel.findOneAndUpdate(
      { 'priceAndAmount._id': id },
      {
        $set: {
          'priceAndAmount.$.amount': amount,
          'priceAndAmount.$.price': price,
        },
      },
      { new: true },
    ).lean<Portfolio>();

    if (!portfolio) {
      throw new HttpException(404, `Asset with provided id doesn't exist`);
    }

    //@ts-ignore
    const updatedAsset = portfolio.priceAndAmount?.find(asset => asset._id.toString() === id);

    if (!updatedAsset) {
      throw new HttpException(404, `Failed to locate updated asset in portfolio`);
    }

    const assetDto: PriceAndAmount = {
      id: updatedAsset.id,
      price: updatedAsset.price,
      amount: updatedAsset.amount,
      currency: updatedAsset.currency,
    };

    return assetDto;
  }

  public async removeAsset(id: string): Promise<void> {
    const portfolio = await PortfolioModel.findOneAndUpdate(
      { 'priceAndAmount._id': id },
      { $pull: { priceAndAmount: { _id: id } } },
      { new: true },
    ).lean<Portfolio>();

    if (!portfolio) {
      throw new HttpException(404, `Asset with provided id doesn't exist`);
    }

    return;
  }

  public async removeAllPortfolioByWalletIdAndName(walletId: string, name: string): Promise<void> {
    const results = await PortfolioModel.deleteMany({
      walletId: new mongoose.Types.ObjectId(walletId),
      'nameAndSymbol.name': name,
    }).lean();

    if (results.deletedCount === 0) {
      throw new HttpException(404, `No portfolio with provided walletId and name`);
    }

    return;
  }

  private async toDto(portfolio) {
    return {
      walletId: portfolio.walletId.toString(),
      market: portfolio.market,
      totalPurchasePrice: portfolio.totalPurchasePrice.toString() + '$',
      totalAmount: portfolio.priceAndAmount.reduce((acc, val) => acc + val.amount, 0),
      profitOrLoss: portfolio.profitOrLoss,
      nameAndSymbol: {
        name: portfolio.nameAndSymbol.name,
        symbol: portfolio.nameAndSymbol.symbol,
      },
      priceAndAmount: portfolio.priceAndAmount.map((item: any) => ({
        id: item._id,
        price: item.price,
        currency: item.currency,
        amount: item.amount,
      })),
    };
  }
}

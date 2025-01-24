import axios from 'axios';
import Container, { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';

import { CryptoChartData, CryptoData,ParsedCryptoChartData } from '@/interfaces/binance.interface';
import { PriceAndAmount } from '@/interfaces/portfolio.interface';

import { CoingeckoService } from './coingecko.service';

@Service()
export class BinanceService {
  public coingeckoService = Container.get(CoingeckoService);

  private baseBinanceUrl = 'https://api.binance.com/api/v3';
  private baseCoincapUrl = 'https://assets.coincap.io';

  public async getCryptoChartData(cryptoSymbol: string, interval: string): Promise<ParsedCryptoChartData[]> {
    try {
      const symbol = cryptoSymbol.toUpperCase();

      const response: CryptoChartData = await axios.get(`${this.baseBinanceUrl}/klines?symbol=${symbol}&interval=${interval}`);

      return this.parseCryptoChartData(response.data);
    } catch (error) {
      console.error('Error fetching crypto chart data:', error.message);
      throw error;
    }
  }

  public async getCryptoDataBySymbol(cryptoSymbol: string): Promise<CryptoData> {
    try {
      const symbol = cryptoSymbol.toUpperCase();

      const binanceResponse = await axios.get(`${this.baseBinanceUrl}/ticker/24hr?symbol=${symbol + 'USDT'}`);

      if (!binanceResponse) {
        throw new HttpException(400, 'Failed to fetch data from Binance API.');
      }

      const processedData: CryptoData = {
        symbol: binanceResponse.data?.symbol,
        price: binanceResponse.data?.lastPrice,
        priceChangePercent: binanceResponse.data?.priceChangePercent,
        priceChange: binanceResponse.data?.priceChange,
        askPrice: binanceResponse.data?.askPrice,
        volume: binanceResponse.data?.volume,
        icon: `${this.baseCoincapUrl}/assets/icons/${symbol.toLowerCase()}@2x.png`,
      };

      return processedData;
    } catch (error) {
      console.error('Error fetching crypto data:', error.message);
      throw error;
    }
  }

  public async getCryptoDataSetBySymbols(cryptoSymbols: string[]): Promise<CryptoData[]> {
    try {
      const cryptoDataSet = await Promise.all(cryptoSymbols.map(cryptoSymbol => this.getCryptoDataBySymbol(cryptoSymbol)));

      return cryptoDataSet;
    } catch (err) {
      throw new HttpException(400, 'Failed to one of crypto data from Binance API.');
    }
  }

  public async getCryptoDataByName(cryptoName: string): Promise<CryptoData> {
    try {
      const coingeckoData = await this.coingeckoService.getCryptoByName(cryptoName);

      const binanceResponse = await axios.get(`${this.baseBinanceUrl}/ticker/24hr?symbol=${coingeckoData.symbol.toUpperCase() + 'USDT'}`);

      if (!binanceResponse) {
        throw new HttpException(400, 'Failed to fetch data from Binance API.');
      }

      const processedData: CryptoData = await this.toDto(binanceResponse, coingeckoData);

      return processedData;
    } catch (error) {
      console.error('Error fetching crypto data:', error.message);
      throw error;
    }
  }

  public async calculateCryptoProfitOrLoss(cryptoTransactionHistory: PriceAndAmount[], cryptoSymbol: string): Promise<string> {
    try {
      const symbol = cryptoSymbol.toUpperCase() + 'USDT';

      const response = await axios.get(`${this.baseBinanceUrl}/ticker/24hr?symbol=${symbol}`);

      if (!response || !response.data || !response.data.lastPrice) {
        throw new HttpException(400, 'Failed to fetch data from Binance API.');
      }

      const currentPrice = parseFloat(response.data.lastPrice);

      const totalAmount = cryptoTransactionHistory.reduce((acc, transaction) => acc + transaction.amount, 0);

      const totalInvestmentCost = cryptoTransactionHistory.reduce((acc, transaction) => acc + transaction.price * transaction.amount, 0);

      const totalCurrentValue = totalAmount * currentPrice;

      const profitOrLoss = totalCurrentValue - totalInvestmentCost;

      return `${profitOrLoss.toFixed(2)}$`;
    } catch (error) {
      console.error(`Error fetching ${cryptoSymbol} data:`, error.message);
      throw error;
    }
  }

  private parseCryptoChartData(cryptoChartData: string[][]): ParsedCryptoChartData[] {
    return cryptoChartData
      .map((record: string[]) => ({
        price: parseFloat(record[4]),
        date: record[0],
      }))
      .slice(cryptoChartData.length - 200, cryptoChartData.length);
  }

  private async toDto(binanceData, coingeckoData): Promise<CryptoData> {
    if (!binanceData?.data || !coingeckoData?.id) {
      throw new Error('Invalid data for transformation');
    }

    return {
      symbol: coingeckoData?.symbol?.toUpperCase(),
      name: coingeckoData?.name || 'Unknown',
      price: binanceData.data?.lastPrice,
      priceChangePercent: binanceData.data?.priceChangePercent,
      priceChange: binanceData.data?.priceChange,
      askPrice: binanceData.data?.askPrice,
      volume: binanceData.data?.volume,
      icon: `${this.baseCoincapUrl}/assets/icons/${coingeckoData?.symbol?.toLowerCase()}@2x.png`,
    };
  }
}
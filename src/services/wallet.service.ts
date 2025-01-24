import { Service } from 'typedi';
import mongoose from 'mongoose';

import { Wallet, WalletDto } from '@/interfaces/wallet.interface';
import { WalletModel } from '@/models/wallet.model';

import { HttpException } from '@/exceptions/httpException';
import { PortfolioModel } from '@/models/portfolio.model';

@Service()
export class WalletService {
  public async createWallet(walletData: Wallet): Promise<Wallet> {
    const findWallet = await WalletModel.findOne({ name: walletData.name }).lean();

    if (findWallet) throw new HttpException(409, `This name ${walletData.name} already exists`);

    const createWalletData = await WalletModel.create({ ...walletData });

    return createWalletData.toObject() as Wallet;
  }

  public async removeWalletById(walletId: string): Promise<any> {
    const wallet = await WalletModel.findOneAndDelete({ _id: walletId }).lean<Wallet>();

    if (!wallet) {
      throw new HttpException(404, `Wallet with provided id doesn't exist`);
    }

    await PortfolioModel.deleteMany({
      walletId: new mongoose.Types.ObjectId(walletId),
    }).lean();

    return;
  }

  private toDtos(wallets: any[]): WalletDto[] {
    return wallets.map(wallet => this.toDto(wallet));
  }

  public async getAllWallets(): Promise<WalletDto[]> {
    const wallets = await WalletModel.find().lean();

    if (!wallets) {
      return [];
    }

    return this.toDtos(wallets);
  }

  private toDto(wallet: any): WalletDto {
    return {
      id: wallet._id.toString(),
      name: wallet.name,
      avatarType: wallet.avatarType,
    };
  }
}

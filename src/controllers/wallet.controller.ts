import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

import { WalletService } from '@/services/wallet.service';
import { Wallet, WalletDto } from '@/interfaces/wallet.interface';


export class WalletController {
  public wallet = Container.get(WalletService);

  public createWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const WalletData: Wallet = req.body;
      const createWalletData: Wallet = await this.wallet.createWallet(WalletData);

      res.status(201).json({ data: createWalletData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getAllWallets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallets: WalletDto[] = await this.wallet.getAllWallets();

      res.status(200).json({ data: wallets, message: 'allWallets' });
    } catch (error) {
      next(error);
    }
  };

  public removeWalletById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {walletId} = req.params;
      await this.wallet.removeWalletById(walletId);

      res.status(200).json({ message: 'removeWalletById' });
    } catch (error) {
      next(error);
    }
  };
}

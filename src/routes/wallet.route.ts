import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import { CreateWalletDto } from '@/dtos/wallet.dto';

import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { WalletController } from '@/controllers/wallet.controller';

export class WalletRoute implements Routes {
  public path = '/wallet';
  public router = Router();
  public wallet = new WalletController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.wallet.getAllWallets);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateWalletDto), this.wallet.createWallet);
    this.router.delete(`${this.path}/:walletId`, this.wallet.removeWalletById);
  }
}

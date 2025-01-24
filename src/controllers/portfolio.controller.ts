import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

import { PortfolioService } from '@/services/portfolio.service';

export class PortfolioController {
  public portfolio = Container.get(PortfolioService);

  public getAllPortfolioByWalletId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const walletId = req.params.walletId;

      const portfolio = await this.portfolio.getAllPortfolioByWalletId(walletId);

      res.status(200).json({ data: portfolio, message: 'portfolioByWalletId' });
    } catch (error) {
      next(error);
    }
  };

  public getAccountBalance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { walletId } = req.params;

      const accountBalance = await this.portfolio.getAccountBalance(walletId);

      res.status(200).json({ data: accountBalance, message: 'accountBalanceByWalletId' });
    } catch (error) {
      next(error);
    }
  };

  public createPortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, symbol, price, currency, amount,market, walletId } = req.body;

      const portfolio = await this.portfolio.createPortfolio(name, symbol, price, currency, amount,market, walletId);

      res.status(201).json({ portfolio, message: 'portfolioCreated' });
    } catch (error) {
      next(error);
    }
  };

  public updateAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, amount, price, market } = req.body;

      const asset = await this.portfolio.updateAsset(id, amount, price);

      res.status(200).json({ data: asset, message: 'assetUpdated' });
    } catch (error) {
      next(error);
    }
  };

  public removeAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.body;

      await this.portfolio.removeAsset(id);

      res.status(200).json({ message: 'assetRemoved' });
    } catch (error) {
      next(error);
    }
  };

  public removeAllPortfolioByWalletIdAndName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { walletId, name } = req.body;

      await this.portfolio.removeAllPortfolioByWalletIdAndName(walletId, name);

      res.status(200).json({ message: 'allPortfolioRemovedByWalletIdAndName' });
    } catch (error) {
      next(error);
    }
  };
}

import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import { CreatePortfolioDto, RemoveAssetDto, RemovePortfoliotDto, UpdateAssetDto } from '@/dtos/portfolio.dto';

import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { PortfolioController } from '@/controllers/portfolio.controller';

export class PortfolioRoute implements Routes {
  public path = '/portfolio';
  public router = Router();
  public portfolio = new PortfolioController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:walletId`, this.portfolio.getAllPortfolioByWalletId);
    this.router.get(`${this.path}/account-balance/:walletId`, this.portfolio.getAccountBalance);
    this.router.post(`${this.path}`, ValidationMiddleware(CreatePortfolioDto), this.portfolio.createPortfolio);
    this.router.put(`${this.path}/update-asset`, ValidationMiddleware(UpdateAssetDto), this.portfolio.updateAsset);
    this.router.delete(`${this.path}/remove-asset`, ValidationMiddleware(RemoveAssetDto), this.portfolio.removeAsset);
    this.router.delete(`${this.path}/remove-portfolio`, ValidationMiddleware(RemovePortfoliotDto), this.portfolio.removeAllPortfolioByWalletIdAndName);
  }
}
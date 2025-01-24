import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';

import { CryptoInfoController } from '@/controllers/crypto-info.controller';

export class CryptoInfoRoute implements Routes {
  public path = '/crypto-info';
  public router = Router();
  public cryptoInfo = new CryptoInfoController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/chart/:symbol/:interval?`, this.cryptoInfo.getCryptoChartDataBySymbol);
    this.router.get(`${this.path}/data-symbol/:symbol`, this.cryptoInfo.getCryptoDataBySymbol);
    this.router.get(`${this.path}/data-symbols`, this.cryptoInfo.getCryptoDataSetBySymbols);
    this.router.get(`${this.path}/data-name/:name`, this.cryptoInfo.getCryptoDataByName);
    this.router.get(`${this.path}/top-10-coins`, this.cryptoInfo.getTop10Crypto)
  }
};

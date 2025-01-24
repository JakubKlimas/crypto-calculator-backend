import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

import { CryptoInfoService } from '@/services/crypto-info.service';
import { CoingeckoService } from '@/services/coingecko.service';
import { logger } from '@/utils/logger';

export class CryptoInfoController {
  public cryptoInfo = Container.get(CryptoInfoService);
  public coingecko = Container.get(CoingeckoService);

  public getCryptoChartDataBySymbol = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cryptoSymbol = req.params.symbol;
      const cryptoInterval = req.params.interval || '1M';
      const cryptoInfo = await this.cryptoInfo.getCryptoChartDataBySymbol(cryptoSymbol, cryptoInterval);

      res.status(200).json({ data: cryptoInfo, message: 'findChartDataBySymbol' });
    } catch (error) {
      next(error);
    }
  };

  public getCryptoDataBySymbol = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cryptoSymbol = req.params.symbol;
      const cryptoInfo = await this.cryptoInfo.getCryptoDataBySymbol(cryptoSymbol);

      res.status(200).json({ data: cryptoInfo, message: 'findDataBySymbol' });
    } catch (error) {
      next(error);
    }
  };

  public getCryptoDataByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cryptoSymbol = req.params.name;
      const cryptoInfo = await this.cryptoInfo.getCryptoDataByName(cryptoSymbol);

      res.status(200).json({ data: cryptoInfo, message: 'findDataByName' });
    } catch (error) {
      next(error);
    }
  };

  public getCryptoDataSetBySymbols = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cryptoSymbols = req.query.symbols;

      if (!cryptoSymbols || typeof cryptoSymbols !== 'string') {
        return res.status(400).json({ message: 'Invalid or missing "symbols" parameter' });
      }

      const cryptoSymbolsArr = cryptoSymbols.split(',');
      const cryptoSymbolsData = await this.cryptoInfo.getCryptoDataSetBySymbols(cryptoSymbolsArr);

      res.status(200).json({ data: cryptoSymbolsData, message: 'findDataByCryptoSymbols' });
    } catch (error) {
      logger.error('Error fetching crypto data:', error.message || error);
      next(error);
    }
  };

  public getTop10Crypto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const top10Crypto = await this.coingecko.getTop10Crypto();

      res.status(200).json({ data: top10Crypto, message: 'getTop10Crypto' });
    } catch (error) {
      next(error);
    }
  };
}

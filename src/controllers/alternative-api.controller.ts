import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

import { AlternativeApiService } from '@/services/alternative-api.service';
import { GetFearAndGreed } from '@/interfaces/alternative-api.interface';

export class AlternativeApiController {
  public alternativeApi = Container.get(AlternativeApiService);

  public getFearAndGreed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createWalletData: GetFearAndGreed = await this.alternativeApi.getFearAndGreed();

      res.status(200).json({ data: createWalletData, message: 'getFearAndGreed' });
    } catch (error) {
      next(error);
    }
  };
}

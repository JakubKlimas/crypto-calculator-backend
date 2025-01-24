import { Router } from "express";

import { AlternativeApiController } from '@/controllers/alternative-api.controller';


export class AlternativeApiRoute {
  public path = '/alternative-api';
  public router = Router();
  public alternativeApi = new AlternativeApiController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/fng`, this.alternativeApi.getFearAndGreed);
  }
}
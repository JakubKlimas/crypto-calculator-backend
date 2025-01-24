import Container, { Service } from 'typedi';

import { CryptoData } from '@/interfaces/binance.interface';

import { BinanceService } from './binance.service';

@Service()
export class CryptoInfoService {
  public binanceService = Container.get(BinanceService);

  public async getCryptoChartDataBySymbol(symbol: string, cryptoInterval: string): Promise<unknown> {
    const cryptoInfo = this.binanceService.getCryptoChartData(symbol, cryptoInterval);

    return cryptoInfo;
  }

  public async getCryptoDataSetBySymbols(symbols: string[]): Promise<CryptoData[]> {
    const cryptoInfo = this.binanceService.getCryptoDataSetBySymbols(symbols);

    return cryptoInfo;
  }

  public async getCryptoDataBySymbol(symbol: string): Promise<CryptoData> {
    const cryptoData = this.binanceService.getCryptoDataBySymbol(symbol);

    return cryptoData;
  }
  public async getCryptoDataByName(symbol: string): Promise<CryptoData> {
    const cryptoData = this.binanceService.getCryptoDataByName(symbol);

    return cryptoData;
  }
}

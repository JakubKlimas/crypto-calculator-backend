import axios from 'axios';
import { Service } from 'typedi';

import { HttpException } from '@/exceptions/httpException';
import { CoingeckoListRecord } from '@/interfaces/coingecko.interface';
import { PriceAndAmount } from '@/interfaces/portfolio.interface';

const queryCoingeckoKey = `x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`;

@Service()
export class CoingeckoService {
  private coingeckoBaseUrl = 'https://api.coingecko.com/api/v3';

  public async getCryptoByName(cryptoName: string): Promise<CoingeckoListRecord> {
    try {
      const name = cryptoName.toLowerCase();

      const url = `${this.coingeckoBaseUrl}/coins/list?`;

      const response = await axios.get(url);
      const cryptoList: CoingeckoListRecord[] = response.data;

      if (!cryptoList || cryptoList.length === 0) {
        throw new HttpException(400, 'Failed to fetch data from CoinGecko API.');
      }

      const selectedCrypto = cryptoList.find(crypto => crypto.name.toLowerCase() === name);

      if (!selectedCrypto) {
        throw new HttpException(400, `Crypto with name "${cryptoName}" not found.`);
      }

      return selectedCrypto;
    } catch (error) {
      throw error;
    }
  }

  public async getTop10Crypto(): Promise<string[]> {
    const url = `${this.coingeckoBaseUrl}/coins/markets`;
    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '20',
      page: '1',
      sparkline: 'false',
    });

    try {
      const response = await axios.get(`${url}?${params}&${queryCoingeckoKey}`,);

      if (!response) {
        throw new HttpException(400, 'Failed to fetch top 10 crypto.');
      }

      const excludedSymbols = ['USDT', 'USDC', 'STETH', 'WSTETH'];
      const filteredData = response.data.filter(coin => !excludedSymbols.includes(coin.symbol.toUpperCase())).slice(0, 10);

      const nameArr = filteredData.map(coin => coin.symbol);

      return nameArr;
    } catch (error) {
      console.error('Error fetching crypto chart data:', error.message);
      throw error;
    }
  }

  public async calculateCryptoProfitOrLoss(cryptoTransactionHistory: PriceAndAmount[], cryptoName: string): Promise<string> {
    try {
      const listResponse = await axios.get(`${this.coingeckoBaseUrl}/coins/list?${queryCoingeckoKey}`);
      const coin = listResponse.data.find(crypto => crypto.name.toLowerCase() === cryptoName.toLocaleLowerCase());

      if (!coin) {
        console.error(`Coin with name "${cryptoName}" not found.`);
        return;
      }

      const coinResponse = await axios.get(`${this.coingeckoBaseUrl}/coins/${coin.id}?${queryCoingeckoKey}`);
      const coinData = coinResponse.data;

      const currentPrice = coinData.market_data.current_price.usd;

      const totalAmount = cryptoTransactionHistory.reduce((acc, transaction) => acc + transaction.amount, 0);

      const totalInvestmentCost = cryptoTransactionHistory.reduce((acc, transaction) => acc + transaction.price * transaction.amount, 0);

      const totalCurrentValue = totalAmount * currentPrice;

      const profitOrLoss = totalCurrentValue - totalInvestmentCost;

      return `${profitOrLoss.toFixed(2)}$`;
    } catch (error) {
      console.error(`Error fetching ${cryptoName} data:`, error.message);
      throw error;
    }
  }
}



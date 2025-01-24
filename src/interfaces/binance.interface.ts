export  interface CryptoChartData {
    data: string[][]
}

export interface  ParsedCryptoChartData {
    price: number;
    date: string;
}

export interface CryptoData {
  symbol: string;
  name?: string;
  price: number;
  priceChangePercent: number;
  priceChange: number;
  askPrice: number;
  volume: number;
  icon: string;
}

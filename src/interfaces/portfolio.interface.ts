export interface PriceAndAmount {
  id: string;
  price: number;
  currency: string;
  amount: number;
}

export interface Portfolio {
  walletId: string;
  totalPurchasePrice: string;
  market: string;
  totalAmount: number;
  profitOrLoss: string;
  nameAndSymbol: {
    name: string;
    symbol: string;
  };
  priceAndAmount: PriceAndAmount[];
}
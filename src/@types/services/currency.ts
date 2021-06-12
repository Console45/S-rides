export interface CurrencyDetails {
  symbol: string;
  name: string;
  instock?: boolean;
}

export interface UpdateCurrency {
  _id: string;
  symbol?: string;
  name?: string;
}

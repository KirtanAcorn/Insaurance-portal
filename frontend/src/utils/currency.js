const CURRENCY_MAP = {
  GBP: '£',
  USD: '_USD_',
  EURO: '€',
  INR: '₹',
  PLN: 'zł',
};

export const getCurrencySymbol = (currencyCode) => {
  return CURRENCY_MAP[currencyCode] || currencyCode || '£';
};

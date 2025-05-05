
import { mockAddresses, mockExchangeRates, networkFees } from "./constants";

// Function to format currency amounts
export const formatCurrencyAmount = (amount: number, currency: string): string => {
  if (currency === 'btc') {
    return amount.toFixed(8);
  } else if (currency === 'eth' || currency === 'xmr') {
    return amount.toFixed(6);
  } else {
    return amount.toFixed(2);
  }
};

// Function to calculate exchange rate between two currencies
export const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) {
    return 1;
  }
  
  return mockExchangeRates[fromCurrency as keyof typeof mockExchangeRates]?.[toCurrency as keyof typeof mockExchangeRates[keyof typeof mockExchangeRates]] || 0;
};

// Calculate network fee
export const calculateNetworkFee = (amount: number, currency: string): number => {
  const feePercentage = networkFees[currency as keyof typeof networkFees] || 0.3;
  return amount * (feePercentage / 100);
};

// Get random address from the pool
export const getRandomAddress = (currency: string): string => {
  const addresses = mockAddresses[currency as keyof typeof mockAddresses] || [];
  if (addresses.length === 0) {
    return '';
  }
  
  const randomIndex = Math.floor(Math.random() * addresses.length);
  return addresses[randomIndex];
};

// Generate a unique order ID
export const generateOrderId = (): string => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Generate a random private key (simplified for demo)
export const generatePrivateKey = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate guarantee letter text
export const generateGuaranteeLetter = (
  receivingAddress: string,
  depositAddress: string,
  orderId: string,
  privateKey: string,
  orderType: string,
  fromCurrency: string,
  toCurrency: string,
  amount: number
): string => {
  const timestamp = new Date().toISOString();
  
  return `PRIVATE GUARANTEE LETTER
=====================================
Order ID: ${orderId}
Timestamp: ${timestamp}
Order Type: ${orderType}

FROM: ${fromCurrency.toUpperCase()} ${formatCurrencyAmount(amount, fromCurrency)}
TO: ${toCurrency.toUpperCase()}

User Receiving Address: ${receivingAddress}
Our Deposit Address: ${depositAddress}

Private Key: ${privateKey}

IMPORTANT:
- This is your only proof of transaction
- Keep this letter safe and private
- The private key is one-time use only
=====================================`;
};

// Simple address validation (just for demo)
export const isValidAddress = (address: string, currency: string): boolean => {
  // In a real app, we would use proper validation for each currency
  if (!address) return false;
  
  const minLength = {
    btc: 26,
    eth: 42,
    usdt: 34,
    xmr: 95
  };
  
  return address.length >= (minLength[currency as keyof typeof minLength] || 20);
};

// Calculate final amount after fees
export const calculateFinalAmount = (
  amount: number, 
  fromCurrency: string, 
  toCurrency: string
): number => {
  const exchangeRate = getExchangeRate(fromCurrency, toCurrency);
  const fee = calculateNetworkFee(amount, fromCurrency);
  const convertedAmount = (amount - fee) * exchangeRate;
  
  return convertedAmount;
};

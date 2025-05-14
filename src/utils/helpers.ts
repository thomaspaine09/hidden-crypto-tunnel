
import { mockAddresses, mockExchangeRates, networkFees } from "./constants";
import { getAddress, recordOrder } from "./fileSystemService";

// Function to format currency amounts
export const formatCurrencyAmount = (amount: number | string | any, currency: string): string => {
  // Ensure amount is a number
  const numericAmount = typeof amount === 'number' ? 
    amount : 
    (typeof amount === 'string' ? parseFloat(amount) : 0);
  
  // Check if numericAmount is a valid number
  if (isNaN(numericAmount)) {
    return '0';
  }
  
  if (currency === 'btc') {
    return numericAmount.toFixed(8);
  } else if (currency === 'eth' || currency === 'xmr') {
    return numericAmount.toFixed(6);
  } else {
    return numericAmount.toFixed(2);
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
  // Use the file system service to get an address
  const address = getAddress(currency);
  
  // Fallback to mock addresses if file service fails
  if (!address) {
    const addresses = mockAddresses[currency as keyof typeof mockAddresses] || [];
    if (addresses.length === 0) {
      return '';
    }
    
    const randomIndex = Math.floor(Math.random() * addresses.length);
    return addresses[randomIndex];
  }
  
  return address;
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
  
  // Record the order in the file system
  recordOrder(
    orderId,
    fromCurrency,
    toCurrency,
    amount,
    receivingAddress,
    depositAddress,
    privateKey,
    orderType as any
  );
  
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

// Improved address validation for different cryptocurrencies
export const isValidAddress = (address: string, currency: string): boolean => {
  if (!address) return false;
  
  // Basic length checks
  const minLength = {
    btc: 26,
    eth: 42,
    usdt: 34,
    xmr: 95
  };
  
  if (address.length < (minLength[currency as keyof typeof minLength] || 20)) {
    return false;
  }
  
  // More specific validations per currency
  switch(currency) {
    case 'btc':
      // Bitcoin addresses start with 1, 3, or bc1
      return /^(1|3|bc1)[a-zA-Z0-9]{25,90}$/.test(address);
    
    case 'eth':
      // Ethereum addresses are 42 chars including 0x prefix
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    
    case 'usdt':
      // USDT addresses can be Ethereum-based (0x...) or Tron-based (T...)
      return /^(0x[a-fA-F0-9]{40}|T[a-zA-Z0-9]{33})$/.test(address);
    
    case 'xmr':
      // Monero addresses are very long
      return /^[4|8][a-zA-Z0-9]{94,}$/.test(address);
      
    default:
      return address.length >= 20; // Fallback for unknown currencies
  }
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

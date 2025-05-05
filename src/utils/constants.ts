
// Cryptocurrency options
export const cryptoOptions = [
  { value: "btc", label: "Bitcoin (BTC)", logo: "₿", color: "crypto-btc" },
  { value: "eth", label: "Ethereum (ETH)", logo: "Ξ", color: "crypto-eth" },
  { value: "usdt", label: "Tether (USDT)", logo: "₮", color: "crypto-usdt" },
  { value: "xmr", label: "Monero (XMR)", logo: "ɱ", color: "crypto-xmr" }
];

// Mock exchange rates
export const mockExchangeRates = {
  btc: {
    eth: 15.67,
    usdt: 43250.22,
    xmr: 182.45
  },
  eth: {
    btc: 0.0638,
    usdt: 2760.83,
    xmr: 11.65
  },
  usdt: {
    btc: 0.000023,
    eth: 0.000362,
    xmr: 0.0042
  },
  xmr: {
    btc: 0.00548,
    eth: 0.0858,
    usdt: 236.98
  }
};

// Network fees by cryptocurrency
export const networkFees = {
  btc: 0.3, // 0.3%
  eth: 0.3,
  usdt: 0.3,
  xmr: 0.8 // 0.8%
};

// Mock addresses for each cryptocurrency
export const mockAddresses = {
  btc: [
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq"
  ],
  eth: [
    "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"
  ],
  usdt: [
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "0x55d398326f99059fF775485246999027B3197955",
    "Tbb4uzPtJ5SGHiP8vRFoQZZZhJiLv294N9"
  ],
  xmr: [
    "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
    "46BeWrHpwXmHDpDEUmZBWZfoQpdc6HaERCNmx1pEYL2rAcuwufPN9rXHHtyUA4QVy66qeFQkn6sfK8aHYjA3jk3o1Bv16em",
    "48daf1rG3hE1Txapcsxh6WXNe9MLNKtu7W7tKTivtSoVLHErYzvdcpea2nSTgGkz66RFP4GKVAsTV14v6G3oddBTQfcXEkJ"
  ]
};

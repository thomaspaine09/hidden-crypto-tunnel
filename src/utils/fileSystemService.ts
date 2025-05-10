
// File System Service - Interaction with text files for addresses

// In a real server environment (PHP, Node.js backend, etc.), this would use actual file operations
// For frontend demo purposes, we simulate file operations using localStorage

// Helper function to read from a "file"
const readFile = (filePath: string): string[] => {
  // In a real server environment, this would be:
  // const fileContents = fs.readFileSync(filePath, 'utf8');
  // return fileContents.split('\n').filter(line => line.trim() !== '');
  
  const storedData = localStorage.getItem(`crypto_${filePath}`);
  if (!storedData) {
    // If no data exists, initialize with our sample data
    const initialData = getInitialData(filePath);
    localStorage.setItem(`crypto_${filePath}`, JSON.stringify(initialData));
    return initialData;
  }
  
  try {
    return JSON.parse(storedData);
  } catch (e) {
    console.error(`Error parsing data for ${filePath}:`, e);
    return [];
  }
};

// Helper function to write to a "file"
const writeFile = (filePath: string, data: string[]): void => {
  // In a real server environment, this would be:
  // const fileContents = data.join('\n');
  // fs.writeFileSync(filePath, fileContents, 'utf8');
  
  localStorage.setItem(`crypto_${filePath}`, JSON.stringify(data));
};

// Helper function to append to the "used.txt" file
const appendToUsedFile = (data: OrderRecord): void => {
  // In a real server environment, this would be:
  // const fileContents = JSON.stringify(data) + '\n';
  // fs.appendFileSync('used.txt', fileContents, 'utf8');
  
  const usedRecords = readUsedFile();
  usedRecords.push(data);
  localStorage.setItem('crypto_used.txt', JSON.stringify(usedRecords));
};

// Helper function to read from the "used.txt" file
const readUsedFile = (): OrderRecord[] => {
  // In a real server environment, this would be:
  // const fileContents = fs.readFileSync('used.txt', 'utf8');
  // return fileContents.split('\n')
  //   .filter(line => line.trim() !== '')
  //   .map(line => JSON.parse(line));
  
  const storedData = localStorage.getItem('crypto_used.txt');
  if (!storedData) {
    return [];
  }
  
  try {
    return JSON.parse(storedData);
  } catch (e) {
    console.error('Error parsing used.txt data:', e);
    return [];
  }
};

// Initial data for each currency file
const getInitialData = (currency: string): string[] => {
  const initialData: { [key: string]: string[] } = {
    'btc.txt': [
      "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
      "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
      "bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9",
      "bc1qd0nvnm428ylylrh4pnzn0jtwstm6zugsmxc0lp",
      "bc1qjh0akslml59uuczddqu0y4p3vj64hg6qa8tac2",
    ],
    'eth.txt': [
      "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      "0xF977814e90dA44bFA03b6295A0616a897441aceC",
      "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
      "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    ],
    'usdt.txt': [
      "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "0x55d398326f99059fF775485246999027B3197955",
      "Tbb4uzPtJ5SGHiP8vRFoQZZZhJiLv294N9",
      "TPbLtsDH5pkaK1WY2J3L6nJ7TzGkBGKRvX",
      "TQrY8bkbpXKPt2LZbU8jqNmgx7jsp3n4JZ",
      "TNXoiAJ3dct8Fjg4M9fkLFh9S2v9TXc32B",
    ],
    'xmr.txt': [
      "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
      "46BeWrHpwXmHDpDEUmZBWZfoQpdc6HaERCNmx1pEYL2rAcuwufPN9rXHHtyUA4QVy66qeFQkn6sfK8aHYjA3jk3o1Bv16em",
      "48daf1rG3hE1Txapcsxh6WXNe9MLNKtu7W7tKTivtSoVLHErYzvdcpea2nSTgGkz66RFP4GKVAsTV14v6G3oddBTQfcXEkJ",
      "42oAxV3DVXQTXGP2tWFKGXXMaHTBGHTE1aDcP5DpHX4UrXJYxca9Vc5jKKMiavgNTGjbJTiAQKBK9FexGapAJ1EtMCZG7H7",
      "43QGgipcHvNLBX3nunZLwVQpF6VbobmGcQKzXzQ5xMfJgzfRBzfXcJHX1tUHcKPm9bcjubrzKqTm69JbQSL4B3f6E3sKTpX",
      "49WUJheXQiXLYHJsUCnkKAMsJQw5jPQFPt69aKHzZUFqH5EFPaJBRTfzcJFjq9TEghMtDemos5jkGQrCwCE1GWEoFmgz5qy",
    ],
  };
  
  return initialData[`${currency}.txt`] || [];
};

// Structure to hold used addresses
interface OrderRecord {
  orderId: string;
  timestamp: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  receivingAddress: string;
  depositAddress: string;
  privateKey: string;
  orderType: 'Crypto Swap' | 'Private Mixer' | 'Public Mixer' | 'Pay As Me';
}

// Get a random address for a specific currency
export const getAddress = (currency: string): string => {
  // Read addresses from the currency file
  const addresses = readFile(`${currency}.txt`);
  const usedAddresses = getUsedAddresses();
  
  // Filter out addresses that have been used already
  const availableAddresses = addresses.filter(addr => !usedAddresses.includes(addr));
  
  if (availableAddresses.length === 0) {
    console.error(`No available addresses for ${currency}`);
    return "";
  }
  
  // Pick a random address from available ones
  const randomIndex = Math.floor(Math.random() * availableAddresses.length);
  return availableAddresses[randomIndex];
};

// Get list of all used addresses
const getUsedAddresses = (): string[] => {
  const orders = readUsedFile();
  return orders.map(order => order.depositAddress);
};

// Record an order in the 'used.txt' file
export const recordOrder = (
  orderId: string,
  fromCurrency: string,
  toCurrency: string,
  amount: number,
  receivingAddress: string,
  depositAddress: string,
  privateKey: string,
  orderType: 'Crypto Swap' | 'Private Mixer' | 'Public Mixer' | 'Pay As Me'
): void => {
  const orderRecord: OrderRecord = {
    orderId,
    timestamp: new Date().toISOString(),
    fromCurrency,
    toCurrency,
    amount,
    receivingAddress,
    depositAddress,
    privateKey,
    orderType
  };
  
  // Append to used.txt
  appendToUsedFile(orderRecord);
  
  console.log(`Order recorded: ${orderId}`);
};

// Find an order by order ID and private key
export const findOrder = (orderId: string, privateKey: string): OrderRecord | undefined => {
  const orders = readUsedFile();
  return orders.find(order => order.orderId === orderId && order.privateKey === privateKey);
};

// Initialize file system service
export const initFileSystem = (): void => {
  console.log("File system service initialized");
  
  // For demo purposes, ensure each currency file exists in localStorage
  ['btc', 'eth', 'usdt', 'xmr'].forEach(currency => {
    readFile(`${currency}.txt`);
  });
  
  // Ensure used.txt exists
  if (!localStorage.getItem('crypto_used.txt')) {
    localStorage.setItem('crypto_used.txt', JSON.stringify([]));
  }
  
  // In a real PHP backend, this would create the files if they don't exist
  // or ensure proper permissions are set
};

// Helper functions to expose internal functionality for testing/debugging
export const _readFromFile = readFile; // Export for testing
export const _writeToFile = writeFile; // Export for testing
export const _readUsedFile = readUsedFile; // Export for testing

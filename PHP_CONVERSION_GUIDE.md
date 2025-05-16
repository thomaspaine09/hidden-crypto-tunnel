
# Complete PHP Conversion Guide for Anonymous Crypto Swap

This comprehensive guide provides detailed instructions for converting this React/TypeScript frontend project to a full PHP application that uses text files for storage. This document covers architecture, implementation details, security considerations, styling, and a step-by-step implementation plan.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Directory Structure](#directory-structure)
4. [Data Storage System](#data-storage-system)
5. [User Interface Implementation](#user-interface-implementation)
6. [Security Considerations](#security-considerations)
7. [Step-by-Step Implementation Plan](#step-by-step-implementation-plan)
8. [Testing and Validation](#testing-and-validation)
9. [Deployment Considerations](#deployment-considerations)

## Project Overview

The Anonymous Crypto Swap platform provides several privacy-focused cryptocurrency services:

- **Crypto Swap**: Exchange one cryptocurrency for another anonymously
- **Private Mixer**: Mix cryptocurrencies for enhanced privacy
- **Pay As Me**: Generate payment addresses on behalf of users
- **Track Order**: Allow users to check the status of their transactions

The application must maintain the same functionality and user experience as the React version while using PHP and text files for data storage.

## Architecture

### Server-Side Architecture

- **Language**: PHP 7.4+ (8.0+ recommended)
- **Paradigm**: Object-Oriented PHP with procedural components where appropriate
- **Server**: Apache or Nginx with PHP-FPM
- **Storage**: Text files in a protected directory structure
- **Sessions**: PHP session management for short-term data
- **Templating**: PHP templates with component-based structure

### Client-Side Architecture

- **JavaScript**: Vanilla JS with minimal dependencies
- **Styling**: Tailwind CSS (compiled to static CSS)
- **Interactivity**: AJAX for asynchronous operations
- **Form Handling**: Client-side validation with server-side verification

## Directory Structure

```
/
├── assets/                  # Static assets
│   ├── css/                 # Compiled CSS files
│   │   └── tailwind.css     # Compiled Tailwind CSS
│   ├── js/                  # JavaScript files
│   │   ├── components/      # JS component handlers
│   │   ├── utils/           # JS utility functions
│   │   └── pages/           # Page-specific JS
│   └── img/                 # Images and icons
│
├── includes/                # PHP functions and components
│   ├── config.php           # Configuration settings
│   ├── functions.php        # Helper functions
│   ├── crypto_functions.php # Cryptocurrency-specific functions
│   ├── templates.php        # Reusable UI components
│   ├── header.php           # Common header
│   ├── footer.php           # Common footer
│   └── fileSystem.php       # File operations functions
│
├── data/                    # Protected data directory (outside web root)
│   ├── btc.txt              # BTC addresses
│   ├── eth.txt              # ETH addresses
│   ├── usdt.txt             # USDT addresses
│   ├── xmr.txt              # XMR addresses
│   └── used.txt             # Used addresses and orders
│
├── api/                     # AJAX endpoints
│   ├── get-address.php      # Get crypto address API
│   ├── create-swap.php      # Create swap order API
│   ├── check-payment.php    # Check payment status API
│   └── track-order.php      # Track order API
│
├── index.php                # Homepage
├── swap.php                 # Crypto Swap page
├── mixer.php                # Mixer page
├── pay-as-me.php            # Pay As Me page
└── track.php                # Track Order page
```

## Data Storage System

### File Structure

Each cryptocurrency has its own text file containing available addresses:

- **btc.txt**: One Bitcoin address per line
- **eth.txt**: One Ethereum address per line
- **usdt.txt**: One USDT address per line
- **xmr.txt**: One Monero address per line

### Order Storage

The `used.txt` file contains JSON-encoded order records, one per line:

```json
{"orderId":"ORD-1684523421-123","timestamp":"2025-05-16T12:34:56Z","fromCurrency":"btc","toCurrency":"xmr","amount":0.05,"receivingAddress":"44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A","depositAddress":"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa","privateKey":"a5e8d97b3f65d9b6e8f0c9d7a6e5f4d3c2b1a0","orderType":"Crypto Swap"}
```

### File Operations Implementation

The `fileSystem.php` file will implement all file operations:

```php
<?php
// Set the data directory path - ideally outside web root
define('DATA_DIR', dirname(__DIR__) . '/data/');

// Get a random address from a specific currency file
function getAddress($currency) {
    $filePath = DATA_DIR . $currency . '.txt';
    
    if (!file_exists($filePath)) {
        error_log("Address file not found: $filePath");
        return "";
    }
    
    // Read addresses from file
    $addresses = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    // Get used addresses
    $usedAddresses = getUsedAddresses();
    
    // Filter out used addresses
    $availableAddresses = array_diff($addresses, $usedAddresses);
    
    if (empty($availableAddresses)) {
        error_log("No available addresses for $currency");
        return "";
    }
    
    // Pick a random address
    $randomIndex = array_rand($availableAddresses);
    return $availableAddresses[$randomIndex];
}

// Get all used addresses
function getUsedAddresses() {
    $filePath = DATA_DIR . 'used.txt';
    $usedAddresses = [];
    
    if (file_exists($filePath)) {
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            $order = json_decode($line, true);
            if ($order && isset($order['depositAddress'])) {
                $usedAddresses[] = $order['depositAddress'];
            }
        }
    }
    
    return $usedAddresses;
}

// Record an order in the used.txt file
function recordOrder($orderId, $fromCurrency, $toCurrency, $amount, 
                    $receivingAddress, $depositAddress, $privateKey, $orderType) {
    $filePath = DATA_DIR . 'used.txt';
    
    $orderRecord = [
        'orderId' => $orderId,
        'timestamp' => date('c'),
        'fromCurrency' => $fromCurrency,
        'toCurrency' => $toCurrency,
        'amount' => $amount,
        'receivingAddress' => $receivingAddress,
        'depositAddress' => $depositAddress,
        'privateKey' => $privateKey,
        'orderType' => $orderType
    ];
    
    // Append to used.txt using file locking to prevent race conditions
    $fp = fopen($filePath, 'a');
    if (flock($fp, LOCK_EX)) {
        fwrite($fp, json_encode($orderRecord) . "\n");
        flock($fp, LOCK_UN);
    }
    fclose($fp);
    
    return true;
}

// Find an order by ID and private key
function findOrder($orderId, $privateKey) {
    $filePath = DATA_DIR . 'used.txt';
    
    if (!file_exists($filePath)) {
        return null;
    }
    
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        $order = json_decode($line, true);
        if ($order && $order['orderId'] === $orderId && $order['privateKey'] === $privateKey) {
            return $order;
        }
    }
    
    return null;
}

// Initialize file system - create files if they don't exist
function initFileSystem() {
    // Ensure data directory exists with proper permissions
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0750, true);
    }
    
    // Default addresses for each currency if files don't exist
    $defaultAddresses = [
        'btc.txt' => [
            "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
            "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
            "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
            "bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9",
            "bc1qd0nvnm428ylylrh4pnzn0jtwstm6zugsmxc0lp",
            "bc1qjh0akslml59uuczddqu0y4p3vj64hg6qa8tac2",
        ],
        'eth.txt' => [
            "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
            "0xF977814e90dA44bFA03b6295A0616a897441aceC",
            "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
            "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
        ],
        'usdt.txt' => [
            "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            "0x55d398326f99059fF775485246999027B3197955",
            "Tbb4uzPtJ5SGHiP8vRFoQZZZhJiLv294N9",
            "TPbLtsDH5pkaK1WY2J3L6nJ7TzGkBGKRvX",
            "TQrY8bkbpXKPt2LZbU8jqNmgx7jsp3n4JZ",
            "TNXoiAJ3dct8Fjg4M9fkLFh9S2v9TXc32B",
        ],
        'xmr.txt' => [
            "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
            "46BeWrHpwXmHDpDEUmZBWZfoQpdc6HaERCNmx1pEYL2rAcuwufPN9rXHHtyUA4QVy66qeFQkn6sfK8aHYjA3jk3o1Bv16em",
            "48daf1rG3hE1Txapcsxh6WXNe9MLNKtu7W7tKTivtSoVLHErYzvdcpea2nSTgGkz66RFP4GKVAsTV14v6G3oddBTQfcXEkJ",
            "42oAxV3DVXQTXGP2tWFKGXXMaHTBGHTE1aDcP5DpHX4UrXJYxca9Vc5jKKMiavgNTGjbJTiAQKBK9FexGapAJ1EtMCZG7H7",
            "43QGgipcHvNLBX3nunZLwVQpF6VbobmGcQKzXzQ5xMfJgzfRBzfXcJHX1tUHcKPm9bcjubrzKqTm69JbQSL4B3f6E3sKTpX",
            "49WUJheXQiXLYHJsUCnkKAMsJQw5jPQFPt69aKHzZUFqH5EFPaJBRTfzcJFjq9TEghMtDemos5jkGQrCwCE1GWEoFmgz5qy",
        ],
    ];
    
    // Create each currency file if it doesn't exist
    foreach ($defaultAddresses as $filename => $addresses) {
        $filePath = DATA_DIR . $filename;
        
        if (!file_exists($filePath)) {
            file_put_contents($filePath, implode("\n", $addresses));
            chmod($filePath, 0640); // Only readable by owner and group
        }
    }
    
    // Create used.txt if it doesn't exist
    $usedFilePath = DATA_DIR . 'used.txt';
    if (!file_exists($usedFilePath)) {
        file_put_contents($usedFilePath, '');
        chmod($usedFilePath, 0640);
    }
    
    return true;
}

// Get address pool status - useful for admin monitoring
function getAddressPoolStatus() {
    $currencies = ['btc', 'eth', 'usdt', 'xmr'];
    $status = [];
    
    $usedAddresses = getUsedAddresses();
    
    foreach ($currencies as $currency) {
        $filePath = DATA_DIR . $currency . '.txt';
        
        if (!file_exists($filePath)) {
            $status[$currency] = [
                'total' => 0,
                'available' => 0,
                'error' => 'File not found'
            ];
            continue;
        }
        
        $addresses = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $availableAddresses = array_diff($addresses, $usedAddresses);
        
        $status[$currency] = [
            'total' => count($addresses),
            'available' => count($availableAddresses),
            'percentage' => count($addresses) > 0 
                ? round((count($availableAddresses) / count($addresses)) * 100, 1) 
                : 0
        ];
    }
    
    return $status;
}
?>
```

## User Interface Implementation

### Component-Based Structure

To replicate the React component structure, create reusable PHP templates:

```php
<?php
// includes/templates.php

// Render a crypto icon
function renderCryptoIcon($currency, $size = 'md') {
    $sizeClass = $size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
    $bgColor = '';
    $symbol = '';
    
    switch ($currency) {
        case 'btc':
            $bgColor = 'bg-amber-500';
            $symbol = '₿';
            break;
        case 'eth':
            $bgColor = 'bg-blue-500';
            $symbol = 'Ξ';
            break;
        case 'usdt':
            $bgColor = 'bg-green-500';
            $symbol = '₮';
            break;
        case 'xmr':
            $bgColor = 'bg-orange-500';
            $symbol = 'ɱ';
            break;
    }
    
    ?>
    <div class="<?php echo $bgColor; ?> <?php echo $sizeClass; ?> text-white rounded-full flex items-center justify-center font-bold">
        <?php echo $symbol; ?>
    </div>
    <?php
}

// Render an address display component
function renderAddressDisplay($address, $currency, $orderId = null, $note = null, $exactAmount = null, $networkFee = null) {
    ?>
    <div class="card border-muted bg-muted/30 rounded-lg shadow p-4">
        <div class="card-header pb-2">
            <h3 class="card-title text-sm flex items-center gap-2">
                <?php renderCryptoIcon($currency, 'sm'); ?>
                <span>Deposit Address</span>
            </h3>
        </div>
        <div class="card-content">
            <div class="mt-1 mb-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-mono break-all">
                <?php echo htmlspecialchars($address); ?>
            </div>

            <?php if ($exactAmount): ?>
            <div class="flex justify-between text-sm mb-3">
                <span class="text-gray-600 dark:text-gray-300">Amount to send:</span>
                <span class="font-medium"><?php echo formatCurrencyAmount($exactAmount, $currency); ?> <?php echo strtoupper($currency); ?></span>
            </div>
            <?php endif; ?>
            
            <?php if ($networkFee): ?>
            <div class="flex justify-between text-sm mb-3">
                <span class="text-gray-600 dark:text-gray-300">Network fee (<?php echo $currency === 'xmr' ? '0.8' : '0.3'; ?>%):</span>
                <span><?php echo formatCurrencyAmount($networkFee, $currency); ?> <?php echo strtoupper($currency); ?></span>
            </div>
            <?php endif; ?>

            <div class="flex gap-2">
                <button 
                    class="btn btn-secondary w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 px-4 rounded"
                    onclick="copyToClipboard('<?php echo htmlspecialchars($address); ?>')"
                >
                    Copy Address
                </button>
            </div>

            <?php if ($note): ?>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-3"><?php echo htmlspecialchars($note); ?></p>
            <?php endif; ?>

            <?php if ($orderId): ?>
                <div class="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
                    Payment not received. Waiting for payment to be received. 
                    <span class="countdown-timer" data-minutes="2" data-seconds="59" data-order-id="<?php echo htmlspecialchars($orderId); ?>">
                        Checking again in 2 minutes 59 seconds
                    </span>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

// Render a guarantee letter component
function renderGuaranteeLetter($orderId, $receivingAddress, $depositAddress, $privateKey, $orderType, $fromCurrency, $toCurrency, $amount) {
    $timestamp = date('c');
    ?>
    <div class="guarantee-letter bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 class="text-center mb-4 font-medium">Private Guarantee Letter</h3>
        <pre class="text-xs font-mono bg-white dark:bg-gray-900 p-3 rounded-md overflow-x-auto">PRIVATE GUARANTEE LETTER
=====================================
Order ID: <?php echo $orderId; ?>

Timestamp: <?php echo $timestamp; ?>

Order Type: <?php echo $orderType; ?>

FROM: <?php echo strtoupper($fromCurrency); ?> <?php echo formatCurrencyAmount($amount, $fromCurrency); ?>

TO: <?php echo strtoupper($toCurrency); ?>

User Receiving Address: <?php echo $receivingAddress; ?>

Our Deposit Address: <?php echo $depositAddress; ?>

Private Key: <?php echo $privateKey; ?>

IMPORTANT:
- This is your only proof of transaction
- Keep this letter safe and private
- The private key is one-time use only
=====================================</pre>
        <div class="flex gap-2 mt-4">
            <button 
                class="btn btn-outline w-1/2 border border-gray-300 dark:border-gray-600 py-2 px-4 rounded"
                onclick="copyToClipboard(document.querySelector('.guarantee-letter pre').textContent)"
            >
                Copy Letter
            </button>
            <button 
                class="btn btn-outline w-1/2 border border-gray-300 dark:border-gray-600 py-2 px-4 rounded"
                onclick="saveTxtFile('guarantee-letter-<?php echo $orderId; ?>.txt', document.querySelector('.guarantee-letter pre').textContent)"
            >
                Download as .txt
            </button>
        </div>
    </div>
    <?php
}

// Format currency amounts consistently
function formatCurrencyAmount($amount, $currency) {
    $amount = floatval($amount);
    
    if ($currency === 'btc') {
        return number_format($amount, 8, '.', '');
    } else if ($currency === 'eth' || $currency === 'xmr') {
        return number_format($amount, 6, '.', '');
    } else {
        return number_format($amount, 2, '.', '');
    }
}

// Render alert component
function renderAlert($title, $message, $type = 'info', $actions = null) {
    $colors = [
        'info' => 'bg-blue-50 border-blue-200 text-blue-800',
        'success' => 'bg-green-50 border-green-200 text-green-800',
        'warning' => 'bg-amber-50 border-amber-200 text-amber-800',
        'error' => 'bg-red-50 border-red-200 text-red-800',
    ];
    $colorClass = $colors[$type] ?? $colors['info'];
    ?>
    <div class="<?php echo $colorClass; ?> border rounded-md p-4 mb-4">
        <?php if ($title): ?>
            <h4 class="font-medium mb-1"><?php echo htmlspecialchars($title); ?></h4>
        <?php endif; ?>
        <p class="text-sm"><?php echo htmlspecialchars($message); ?></p>
        <?php if ($actions): ?>
            <div class="mt-3">
                <?php echo $actions; ?>
            </div>
        <?php endif; ?>
    </div>
    <?php
}
?>
```

### Page Implementation Example (Swap Page)

```php
<?php
// swap.php
require_once 'includes/config.php';
require_once 'includes/functions.php';
require_once 'includes/fileSystem.php';
require_once 'includes/templates.php';

// Initialize file system
initFileSystem();

// Process form submission via AJAX only
$confirmationMode = isset($_GET['confirmation']) && isset($_SESSION['order_data']);

// Get session data if in confirmation mode
$orderData = [];
if ($confirmationMode) {
    $orderData = $_SESSION['order_data'];
}

// Include header
$pageTitle = "Crypto Swap";
require_once 'includes/header.php';
?>

<div class="service-layout max-w-4xl mx-auto px-4 py-8">
    <div class="service-header text-center mb-8">
        <h1 class="text-2xl font-bold mb-2">Crypto Swap</h1>
        <p class="text-gray-600 dark:text-gray-300">
            Exchange cryptocurrencies with complete privacy. No accounts, no KYC, no tracking.
        </p>
    </div>
    
    <div class="service-content bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <?php if (!$confirmationMode): ?>
            <!-- Swap Form -->
            <form id="swap-form" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- From Currency -->
                    <div class="form-group">
                        <label for="fromCurrency" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            From Currency
                            <span class="info-tooltip ml-1" title="Select the cryptocurrency you want to exchange from">?</span>
                        </label>
                        <select 
                            id="fromCurrency" 
                            name="fromCurrency" 
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        >
                            <option value="btc">Bitcoin (BTC)</option>
                            <option value="eth">Ethereum (ETH)</option>
                            <option value="usdt">Tether (USDT)</option>
                            <option value="xmr">Monero (XMR)</option>
                        </select>
                    </div>

                    <!-- To Currency -->
                    <div class="form-group">
                        <label for="toCurrency" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            To Currency
                            <span class="info-tooltip ml-1" title="Select the cryptocurrency you want to exchange to">?</span>
                        </label>
                        <select 
                            id="toCurrency" 
                            name="toCurrency" 
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        >
                            <option value="btc">Bitcoin (BTC)</option>
                            <option value="eth" selected>Ethereum (ETH)</option>
                            <option value="usdt">Tether (USDT)</option>
                            <option value="xmr">Monero (XMR)</option>
                        </select>
                    </div>

                    <!-- Amount -->
                    <div class="form-group">
                        <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Amount
                            <span class="info-tooltip ml-1" title="Enter the amount you want to exchange">?</span>
                        </label>
                        <div class="relative">
                            <input 
                                type="number" 
                                id="amount" 
                                name="amount" 
                                step="any" 
                                min="0" 
                                value="0.1" 
                                class="w-full pr-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                <span id="amount-currency">BTC</span>
                            </div>
                        </div>
                    </div>

                    <!-- Receiving Address -->
                    <div class="form-group">
                        <label for="receivingAddress" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Receiving Address
                            <span class="info-tooltip ml-1" title="Enter the wallet address where you want to receive your exchanged funds">?</span>
                        </label>
                        <input 
                            type="text" 
                            id="receivingAddress" 
                            name="receivingAddress" 
                            placeholder="Your ETH address" 
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                        <p id="address-validation-msg" class="text-xs mt-1 hidden"></p>
                    </div>
                </div>

                <!-- Same Currency Alert -->
                <div id="same-currency-alert" class="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md hidden">
                    <div class="flex items-start justify-between w-full">
                        <div>
                            <h4 class="font-medium mb-1">Same currency selected</h4>
                            <p class="text-sm">For better security and potentially lower fees, consider using our Mixer service instead.</p>
                            <div class="mt-2">
                                <a href="mixer.php" class="bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm py-1 px-3 rounded inline-flex items-center">
                                    Go to Mixer <span class="ml-1">→</span>
                                </a>
                            </div>
                        </div>
                        <button type="button" class="text-amber-800" onclick="document.getElementById('same-currency-alert').classList.add('hidden')">
                            ×
                        </button>
                    </div>
                </div>

                <hr class="border-t border-gray-200 dark:border-gray-700">

                <!-- Exchange Info -->
                <div id="transaction-summary" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                    <h3 class="font-medium mb-2">Transaction Summary</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-300">Exchange Rate:</span>
                            <span id="exchange-rate">1 BTC = 15.67 ETH</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-300">Network Fee (0.3%):</span>
                            <span id="network-fee">0.0003 BTC</span>
                        </div>
                        <hr class="border-t border-gray-200 dark:border-gray-700">
                        <div class="flex justify-between font-medium">
                            <span>You will receive approximately:</span>
                            <span id="final-amount">1.567 ETH</span>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button 
                        id="submit-button" 
                        type="submit" 
                        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                    >
                        Continue to Swap
                    </button>
                </div>
            </form>
        <?php else: ?>
            <!-- Confirmation View -->
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h2 class="text-lg font-medium">Send your deposit to this address</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        Transfer exactly <?php echo formatCurrencyAmount($orderData['amount'], $orderData['fromCurrency']); ?> <?php echo strtoupper($orderData['fromCurrency']); ?> to the address below
                    </p>
                </div>

                <?php 
                renderAddressDisplay(
                    $orderData['depositAddress'], 
                    $orderData['fromCurrency'], 
                    $orderData['orderId'], 
                    "Please send exactly the amount specified to avoid transaction issues.",
                    $orderData['amount'],
                    $orderData['networkFee']
                );
                ?>

                <div class="py-4">
                    <hr class="border-t border-gray-200 dark:border-gray-700">
                </div>

                <?php 
                renderGuaranteeLetter(
                    $orderData['orderId'],
                    $orderData['receivingAddress'],
                    $orderData['depositAddress'],
                    $orderData['privateKey'],
                    "Crypto Swap",
                    $orderData['fromCurrency'],
                    $orderData['toCurrency'],
                    $orderData['amount']
                );
                ?>

                <div class="mt-6 text-center">
                    <a href="swap.php" class="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md inline-block">
                        Return to Swap Form
                    </a>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>

<!-- JavaScript for form handling -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Form references
    const swapForm = document.getElementById('swap-form');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const amountInput = document.getElementById('amount');
    const receivingAddressInput = document.getElementById('receivingAddress');
    const amountCurrency = document.getElementById('amount-currency');
    const exchangeRateElement = document.getElementById('exchange-rate');
    const networkFeeElement = document.getElementById('network-fee');
    const finalAmountElement = document.getElementById('final-amount');
    const submitButton = document.getElementById('submit-button');
    const sameCurrencyAlert = document.getElementById('same-currency-alert');
    const addressValidationMsg = document.getElementById('address-validation-msg');
    
    // Exchange rates (from constants)
    const exchangeRates = {
        btc: { eth: 15.67, usdt: 43250.22, xmr: 182.45 },
        eth: { btc: 0.0638, usdt: 2760.83, xmr: 11.65 },
        usdt: { btc: 0.000023, eth: 0.000362, xmr: 0.0042 },
        xmr: { btc: 0.00548, eth: 0.0858, usdt: 236.98 }
    };
    
    // Network fees
    const networkFees = {
        btc: 0.3,
        eth: 0.3,
        usdt: 0.3,
        xmr: 0.8
    };
    
    // Update form when currencies change
    function updateFormState() {
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        // Update amount currency display
        amountCurrency.textContent = fromCurrency.toUpperCase();
        
        // Update receiving address placeholder
        receivingAddressInput.placeholder = `Your ${toCurrency.toUpperCase()} address`;
        
        // Check if same currency is selected
        if (fromCurrency === toCurrency) {
            sameCurrencyAlert.classList.remove('hidden');
        } else {
            sameCurrencyAlert.classList.add('hidden');
        }
        
        // Update exchange rate display
        let rate = 1;
        if (fromCurrency !== toCurrency) {
            rate = exchangeRates[fromCurrency][toCurrency];
        }
        
        exchangeRateElement.textContent = `1 ${fromCurrency.toUpperCase()} = ${formatCurrencyAmount(rate, toCurrency)} ${toCurrency.toUpperCase()}`;
        
        // Update calculations
        updateCalculations();
        
        // Validate address
        validateAddress();
    }
    
    // Update calculations when amount changes
    function updateCalculations() {
        const amount = parseFloat(amountInput.value) || 0;
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        // Calculate network fee
        const feePercentage = networkFees[fromCurrency];
        const fee = amount * (feePercentage / 100);
        networkFeeElement.textContent = `${formatCurrencyAmount(fee, fromCurrency)} ${fromCurrency.toUpperCase()}`;
        
        // Calculate final amount
        let rate = 1;
        if (fromCurrency !== toCurrency) {
            rate = exchangeRates[fromCurrency][toCurrency];
        }
        
        const finalAmount = (amount - fee) * rate;
        finalAmountElement.textContent = `${formatCurrencyAmount(finalAmount, toCurrency)} ${toCurrency.toUpperCase()}`;
    }
    
    // Validate cryptocurrency addresses
    function validateAddress() {
        const address = receivingAddressInput.value.trim();
        const currency = toCurrencySelect.value;
        
        if (!address) {
            addressValidationMsg.classList.add('hidden');
            return false;
        }
        
        // Implement address validation rules
        let isValid = false;
        
        switch(currency) {
            case 'btc':
                isValid = /^(1|3|bc1)[a-zA-Z0-9]{25,90}$/.test(address);
                break;
            case 'eth':
                isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
                break;
            case 'usdt':
                isValid = /^(0x[a-fA-F0-9]{40}|T[a-zA-Z0-9]{33})$/.test(address);
                break;
            case 'xmr':
                isValid = /^[4|8][a-zA-Z0-9]{94,}$/.test(address);
                break;
            default:
                isValid = address.length >= 20;
        }
        
        addressValidationMsg.classList.remove('hidden');
        
        if (isValid) {
            addressValidationMsg.textContent = "Valid address format";
            addressValidationMsg.className = "text-xs text-green-600 mt-1";
        } else {
            addressValidationMsg.textContent = `Invalid ${currency.toUpperCase()} address format`;
            addressValidationMsg.className = "text-xs text-red-600 mt-1";
        }
        
        return isValid;
    }
    
    // Format currency amounts consistently
    function formatCurrencyAmount(amount, currency) {
        if (currency === 'btc') {
            return amount.toFixed(8);
        } else if (currency === 'eth' || currency === 'xmr') {
            return amount.toFixed(6);
        } else {
            return amount.toFixed(2);
        }
    }
    
    // Generate random IDs and keys
    function generateOrderId() {
        return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    function generatePrivateKey() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 64; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    // Copy to clipboard function
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Show toast notification
            showToast('Copied to clipboard', 'success');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };
    
    // Save text as file
    window.saveTxtFile = function(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    
    // Show toast notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
        } shadow-lg z-50 animate-fade-in`;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('animate-fade-out');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Countdown timer functionality
    function initCountdownTimers() {
        const timers = document.querySelectorAll('.countdown-timer');
        
        timers.forEach(timer => {
            let minutes = parseInt(timer.dataset.minutes) || 0;
            let seconds = parseInt(timer.dataset.seconds) || 0;
            const orderId = timer.dataset.orderId || '';
            
            const interval = setInterval(() => {
                seconds--;
                
                if (seconds < 0) {
                    minutes--;
                    seconds = 59;
                }
                
                if (minutes < 0) {
                    clearInterval(interval);
                    // Check payment status
                    checkPaymentStatus(orderId, timer);
                    return;
                }
                
                timer.textContent = `Checking again in ${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
            }, 1000);
        });
    }
    
    // Check payment status via AJAX
    function checkPaymentStatus(orderId, timerElement) {
        timerElement.textContent = 'Checking payment status...';
        
        fetch(`api/check-payment.php?orderId=${orderId}`)
            .then(response => response.json())
            .then(data => {
                if (data.paymentReceived) {
                    timerElement.textContent = 'Payment confirmed! Processing your swap...';
                    timerElement.className = 'text-green-500';
                    
                    // In a real app, redirect to a success page or show success UI
                    setTimeout(() => {
                        showToast('Transaction complete!', 'success');
                    }, 2000);
                } else {
                    // Reset the timer
                    timerElement.dataset.minutes = '2';
                    timerElement.dataset.seconds = '59';
                    timerElement.textContent = 'Checking again in 2 minutes 59 seconds';
                    initCountdownTimers(); // Restart the timer
                }
            })
            .catch(error => {
                console.error('Error checking payment:', error);
                timerElement.textContent = 'Error checking payment status. Retrying in 1 minute...';
                
                // Retry after 1 minute
                setTimeout(() => {
                    checkPaymentStatus(orderId, timerElement);
                }, 60000);
            });
    }
    
    // Initialize form event listeners
    if (swapForm) {
        fromCurrencySelect.addEventListener('change', updateFormState);
        toCurrencySelect.addEventListener('change', updateFormState);
        amountInput.addEventListener('input', updateCalculations);
        receivingAddressInput.addEventListener('input', validateAddress);
        
        // Initialize the form state
        updateFormState();
        
        // Form submission
        swapForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const amount = parseFloat(amountInput.value);
            if (!amount || amount <= 0) {
                showToast('Please enter a valid amount', 'error');
                return;
            }
            
            if (!validateAddress()) {
                showToast('Please enter a valid receiving address', 'error');
                return;
            }
            
            // Disable submit button and show processing state
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            
            // Calculate fee for API
            const fromCurrency = fromCurrencySelect.value;
            const feePercentage = networkFees[fromCurrency];
            const fee = amount * (feePercentage / 100);
            
            // Prepare form data
            const formData = new FormData();
            formData.append('fromCurrency', fromCurrencySelect.value);
            formData.append('toCurrency', toCurrencySelect.value);
            formData.append('amount', amount);
            formData.append('networkFee', fee);
            formData.append('receivingAddress', receivingAddressInput.value);
            formData.append('orderId', generateOrderId());
            formData.append('privateKey', generatePrivateKey());
            
            // Send AJAX request
            fetch('api/create-swap.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showToast(data.error, 'error');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Continue to Swap';
                    return;
                }
                
                // Redirect to confirmation page
                window.location.href = 'swap.php?confirmation=1';
            })
            .catch(error => {
                console.error('Error creating swap:', error);
                showToast('An error occurred. Please try again.', 'error');
                submitButton.disabled = false;
                submitButton.textContent = 'Continue to Swap';
            });
        });
    }
    
    // Initialize countdown timers if present
    initCountdownTimers();
});
</script>

<?php
// Include footer
require_once 'includes/footer.php';
?>
```

## API Implementation

The PHP API endpoints will handle the dynamic functionality:

```php
<?php
// api/create-swap.php
header('Content-Type: application/json');
require_once '../includes/config.php';
require_once '../includes/fileSystem.php';

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

// Get and validate form data
$fromCurrency = $_POST['fromCurrency'] ?? '';
$toCurrency = $_POST['toCurrency'] ?? '';
$amount = floatval($_POST['amount'] ?? 0);
$networkFee = floatval($_POST['networkFee'] ?? 0);
$receivingAddress = $_POST['receivingAddress'] ?? '';
$orderId = $_POST['orderId'] ?? '';
$privateKey = $_POST['privateKey'] ?? '';

// Input validation
if (!$fromCurrency || !$toCurrency) {
    echo json_encode(['error' => 'Currency selection required']);
    exit;
}

if ($amount <= 0) {
    echo json_encode(['error' => 'Invalid amount']);
    exit;
}

if (!$receivingAddress) {
    echo json_encode(['error' => 'Receiving address required']);
    exit;
}

if (!$orderId || !$privateKey) {
    echo json_encode(['error' => 'Missing order information']);
    exit;
}

// Get deposit address
$depositAddress = getAddress($fromCurrency);
if (!$depositAddress) {
    error_log("Failed to get deposit address for $fromCurrency");
    echo json_encode(['error' => "No available $fromCurrency addresses. Please try again later."]);
    exit;
}

// Record order in file system
$result = recordOrder(
    $orderId,
    $fromCurrency,
    $toCurrency,
    $amount,
    $receivingAddress,
    $depositAddress,
    $privateKey,
    'Crypto Swap'
);

if (!$result) {
    echo json_encode(['error' => 'Failed to record order']);
    exit;
}

// Store order data in session for confirmation page
$_SESSION['order_data'] = [
    'orderId' => $orderId,
    'fromCurrency' => $fromCurrency,
    'toCurrency' => $toCurrency,
    'amount' => $amount,
    'networkFee' => $networkFee,
    'receivingAddress' => $receivingAddress,
    'depositAddress' => $depositAddress,
    'privateKey' => $privateKey
];

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Order created successfully',
    'redirectUrl' => 'swap.php?confirmation=1'
]);

// End script
exit;
?>
```

## Security Considerations

### Protecting Data Files

1. **Directory Placement**:
   - Store the data directory **outside** the web root
   - Example: If web root is `/var/www/html`, place data in `/var/data`

2. **File Access Control**:
   - Set strict file permissions (0640 for files, 0750 for directories)
   - Ensure web server user can read/write but others cannot

3. **Implement .htaccess Protection**:
   ```apache
   # Deny access to all files in this directory
   <FilesMatch ".*">
       Order Allow,Deny
       Deny from all
   </FilesMatch>
   ```

4. **Use File Locking**:
   - Prevent race conditions when multiple users access simultaneously
   - Implement exclusive locks when writing to files

5. **Input Validation**:
   - Validate all user inputs before processing
   - Sanitize data before writing to files
   - Implement CSRF protection with tokens

### Protecting User Privacy

1. **No Logging of Identifying Information**:
   - Do not log IP addresses
   - Do not set tracking cookies
   - Do not implement analytics that identify users

2. **Secure Order Handling**:
   - Generate truly random order IDs and private keys
   - Use strong entropy sources for randomization
   - Implement proper PRNG for cryptographic operations

3. **Session Management**:
   - Use short-lived sessions
   - Store minimal data in sessions
   - Implement session timeouts

4. **Script Security**:
   - Set proper Content Security Policy headers
   - Implement XSS protection
   - Enable HTTPS for all communication

## Step-by-Step Implementation Plan

### Phase 1: Foundation Setup

1. **Directory Structure Setup**
   - Create all directories according to structure
   - Set proper permissions

2. **Core Files Implementation**
   - Implement `config.php` with core settings
   - Implement `fileSystem.php` with file operations
   - Create basic templates and layout files

3. **Data Storage Initialization**
   - Initialize currency files with addresses
   - Create `used.txt` file
   - Implement file access protection

### Phase 2: UI Components

1. **Common UI Elements**
   - Implement header and footer
   - Create CSS styling (compile Tailwind)
   - Build reusable components

2. **Home Page**
   - Create landing page with service descriptions
   - Implement navigation

3. **Basic JavaScript Utilities**
   - Create utility functions for client-side validation
   - Implement copy to clipboard functionality
   - Create toast notification system

### Phase 3: Core Functionality

1. **Crypto Swap Implementation**
   - Complete swap.php with form and confirmation views
   - Implement API endpoints
   - Add address validation

2. **Mixer Implementation**
   - Build mixer.php for both public and private mixing
   - Implement mixing algorithm logic
   - Create mixer confirmation flow

3. **Pay As Me Implementation**
   - Develop pay-as-me.php for payment address generation
   - Implement address display and tracking

4. **Order Tracking**
   - Create track.php for order lookup
   - Implement private key verification
   - Display order status information

### Phase 4: Testing and Security

1. **Security Hardening**
   - Implement all security measures
   - Test for common vulnerabilities
   - Review file permissions

2. **Functionality Testing**
   - Test each service with sample transactions
   - Verify order recording and retrieval
   - Ensure proper error handling

3. **UI/UX Refinement**
   - Ensure responsive design
   - Optimize for mobile
   - Test across browsers

## Testing and Validation

### Test Suite

1. **Unit Tests**
   - Test file operations individually
   - Validate address generation and order recording
   - Verify format validation functions

2. **Integration Tests**
   - Test complete order flow
   - Verify session handling works correctly
   - Test concurrent user scenarios

3. **Security Tests**
   - Test for XSS vulnerabilities
   - Attempt unauthorized access to data files
   - Verify CSRF protection works

### Validation Checklists

- **File System Protection**
  - [ ] Data directory not accessible via web
  - [ ] File permissions correctly set
  - [ ] File locking works during concurrent writes

- **UI/UX**
  - [ ] All pages render correctly on desktop and mobile
  - [ ] Form validation works properly
  - [ ] Error messages are clear and helpful

- **Functionality**
  - [ ] Addresses are allocated correctly
  - [ ] Orders are recorded properly
  - [ ] Tracking works with order ID and private key

## Deployment Considerations

### Server Requirements

- PHP 7.4+ (8.0+ recommended)
- Web server with URL rewriting capability
- Proper file permissions setup

### Performance Optimization

- Implement caching for static content
- Minify CSS and JavaScript
- Use PHP opcode caching

### Backup Strategy

- Regularly back up address files
- Create rotating backups of `used.txt`
- Document recovery procedures

### Maintenance

- Create admin tools for address pool management
- Implement monitoring for low address availability
- Document procedures for adding new addresses

## Conclusion

This PHP implementation provides a complete, secure, and privacy-focused cryptocurrency service platform that matches the functionality of the React version. By following this guide, you can successfully convert the application while maintaining the same user experience and security standards.

Remember to thoroughly test all aspects of the implementation before deployment to ensure reliability and security.


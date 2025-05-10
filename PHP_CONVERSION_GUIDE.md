
# PHP Conversion Guide for Anonymous Crypto Swap

This document provides detailed instructions on converting this React/TypeScript frontend project to a full PHP application that uses text files for storage.

## Directory Structure for PHP Version

```
/
├── assets/            # CSS, JS, images
├── includes/          # PHP functions and components
│   ├── config.php     # Configuration settings
│   ├── functions.php  # Helper functions
│   ├── header.php     # Common header
│   ├── footer.php     # Common footer
│   └── fileSystem.php # Functions for file operations
├── data/              # Protected data directory (outside web root)
│   ├── btc.txt        # BTC addresses
│   ├── eth.txt        # ETH addresses
│   ├── usdt.txt       # USDT addresses
│   ├── xmr.txt        # XMR addresses
│   └── used.txt       # Used addresses and orders
├── index.php          # Homepage
├── swap.php           # Crypto Swap page
├── mixer.php          # Mixer page
├── pay-as-me.php      # Pay As Me page
└── track.php          # Track Order page
```

## File System Implementation

Create a `fileSystem.php` file with these functions:

```php
<?php
// Set the data directory path
define('DATA_DIR', __DIR__ . '/../data/');

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
    
    // Append to used.txt
    file_put_contents($filePath, json_encode($orderRecord) . "\n", FILE_APPEND);
    
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
    // Ensure data directory exists
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0755, true);
    }
    
    // Default addresses for each currency if files don't exist
    $defaultAddresses = [
        'btc.txt' => [
            "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
            "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
            "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
        ],
        'eth.txt' => [
            "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        ],
        'usdt.txt' => [
            "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            "0x55d398326f99059fF775485246999027B3197955",
            "Tbb4uzPtJ5SGHiP8vRFoQZZZhJiLv294N9",
        ],
        'xmr.txt' => [
            "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
            "46BeWrHpwXmHDpDEUmZBWZfoQpdc6HaERCNmx1pEYL2rAcuwufPN9rXHHtyUA4QVy66qeFQkn6sfK8aHYjA3jk3o1Bv16em",
        ],
    ];
    
    // Create each currency file if it doesn't exist
    foreach ($defaultAddresses as $filename => $addresses) {
        $filePath = DATA_DIR . $filename;
        
        if (!file_exists($filePath)) {
            file_put_contents($filePath, implode("\n", $addresses));
        }
    }
    
    // Create used.txt if it doesn't exist
    $usedFilePath = DATA_DIR . 'used.txt';
    if (!file_exists($usedFilePath)) {
        file_put_contents($usedFilePath, '');
    }
    
    return true;
}
?>
```

## Securing the Data Directory with .htaccess

Create a `.htaccess` file in the `data/` directory:

```
# Deny access to all files in this directory
<FilesMatch ".*">
    Order Allow,Deny
    Deny from all
</FilesMatch>
```

For additional security, place the `data/` directory outside the web root if possible.

## Converting React Components to PHP

### 1. API Endpoints

Create API endpoints that return JSON:

```php
<?php
// api/get-address.php
header('Content-Type: application/json');
require_once '../includes/fileSystem.php';

$currency = $_GET['currency'] ?? '';
if (!$currency) {
    echo json_encode(['error' => 'Currency required']);
    exit;
}

$address = getAddress($currency);
echo json_encode(['address' => $address]);
?>
```

### 2. HTML/PHP Components

Convert React components to PHP:

```php
<?php
// includes/components/address-display.php
function renderAddressDisplay($address, $currency, $orderId = null, $note = null) {
    ?>
    <div class="card border-muted bg-muted/30">
        <div class="card-header pb-2">
            <h3 class="card-title text-sm flex items-center gap-2">
                <?php renderCryptoIcon($currency, 'sm'); ?>
                <span>Deposit Address</span>
            </h3>
        </div>
        <div class="card-content">
            <div class="mt-1 mb-3 p-3 bg-background rounded-md text-sm monospace break-all">
                <?php echo htmlspecialchars($address); ?>
            </div>

            <div class="flex gap-2">
                <button 
                    class="btn btn-secondary w-full"
                    onclick="copyToClipboard('<?php echo htmlspecialchars($address); ?>')"
                >
                    Copy Address
                </button>
            </div>

            <?php if ($note): ?>
                <p class="text-xs text-muted-foreground mt-3"><?php echo htmlspecialchars($note); ?></p>
            <?php endif; ?>

            <?php if ($orderId): ?>
                <div class="mt-3 text-xs text-center text-muted-foreground">
                    Payment not received. Waiting for payment to be received. 
                    <span class="countdown-timer" data-minutes="2" data-seconds="59">
                        Checking again in 2 minutes 59 seconds
                    </span>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <?php
}
```

### 3. AJAX for Form Handling

Use JavaScript to handle form submissions:

```javascript
// assets/js/swap.js
document.addEventListener('DOMContentLoaded', function() {
    const swapForm = document.getElementById('swap-form');
    
    if (swapForm) {
        swapForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(swapForm);
            const fromCurrency = formData.get('fromCurrency');
            const toCurrency = formData.get('toCurrency');
            const amount = formData.get('amount');
            const receivingAddress = formData.get('receivingAddress');
            
            // Validate inputs
            if (!isValidAddress(receivingAddress, toCurrency)) {
                showToast('error', `Invalid ${toCurrency.toUpperCase()} address format`);
                return;
            }
            
            // Show processing state
            document.getElementById('submit-button').disabled = true;
            document.getElementById('submit-button').textContent = 'Processing...';
            
            // Send AJAX request
            fetch('api/create-swap.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showToast('error', data.error);
                    return;
                }
                
                // Show confirmation UI
                showConfirmation(data.orderId, data.depositAddress, data.privateKey);
            })
            .catch(error => {
                showToast('error', 'An error occurred');
                console.error(error);
            })
            .finally(() => {
                document.getElementById('submit-button').disabled = false;
                document.getElementById('submit-button').textContent = 'Continue to Swap';
            });
        });
    }
});
```

## PHP Page Structure

Here's how `swap.php` would look:

```php
<?php require_once 'includes/header.php'; ?>

<div class="service-layout">
    <div class="service-header">
        <h1>Crypto Swap</h1>
        <p>Exchange cryptocurrencies with complete privacy. No accounts, no KYC, no tracking.</p>
    </div>
    
    <div class="service-content">
        <?php if (!isset($_GET['confirmation'])): ?>
            <form id="swap-form" class="space-y-6">
                <!-- Form fields go here -->
                
                <div class="flex justify-end">
                    <button 
                        id="submit-button" 
                        type="submit" 
                        class="btn btn-primary"
                    >
                        Continue to Swap
                    </button>
                </div>
            </form>
        <?php else: ?>
            <?php
            // Get order info from session
            session_start();
            $orderId = $_SESSION['order_id'] ?? '';
            $depositAddress = $_SESSION['deposit_address'] ?? '';
            $privateKey = $_SESSION['private_key'] ?? '';
            $fromCurrency = $_SESSION['from_currency'] ?? '';
            $toCurrency = $_SESSION['to_currency'] ?? '';
            $amount = $_SESSION['amount'] ?? 0;
            $receivingAddress = $_SESSION['receiving_address'] ?? '';
            
            // Clear session after retrieving data
            unset($_SESSION['order_id']);
            unset($_SESSION['deposit_address']);
            unset($_SESSION['private_key']);
            ?>
            
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h2 class="text-lg font-medium">Send your deposit to this address</h2>
                    <p class="text-sm text-muted-foreground">
                        Transfer exactly <?php echo formatCurrencyAmount($amount, $fromCurrency); ?> <?php echo strtoupper($fromCurrency); ?> to the address below
                    </p>
                </div>
                
                <?php 
                renderAddressDisplay(
                    $depositAddress, 
                    $fromCurrency, 
                    $orderId, 
                    "Please send exactly the amount specified to avoid transaction issues."
                );
                ?>
                
                <div class="py-4">
                    <hr class="border-t border-border" />
                </div>
                
                <?php 
                renderGuaranteeLetter(
                    $orderId,
                    $receivingAddress,
                    $depositAddress,
                    $privateKey,
                    "Crypto Swap",
                    $fromCurrency,
                    $toCurrency,
                    $amount
                );
                ?>
                
                <div class="mt-6 text-center">
                    <a href="swap.php" class="btn btn-outline">
                        Return to Swap Form
                    </a>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
```

## Using AJAX for Real-time Updates

To simulate checking for payments:

```php
<?php
// api/check-payment.php
header('Content-Type: application/json');
require_once '../includes/fileSystem.php';

$orderId = $_GET['orderId'] ?? '';
if (!$orderId) {
    echo json_encode(['error' => 'Order ID required']);
    exit;
}

// In a real app, you would check blockchain/payment processor here
// For demo, randomly decide if payment was received
$received = (rand(1, 10) > 8); // 20% chance payment is "received"

echo json_encode([
    'paymentReceived' => $received,
    'message' => $received ? 'Payment confirmed!' : 'Payment not yet detected'
]);
?>
```

## Conclusion

This PHP implementation achieves the same functionality as the React version but:

1. Uses text files for data storage
2. Secures sensitive data outside the web root
3. Uses .htaccess to protect data files
4. Maintains the same UX with AJAX for dynamic interactions

When migrating, you'll need to:
1. Convert all React components to PHP templates
2. Create PHP API endpoints for dynamic actions
3. Use JavaScript for form handling and AJAX calls
4. Set up proper file permissions for data files (usually 0644)
5. Ensure the data directory is properly secured

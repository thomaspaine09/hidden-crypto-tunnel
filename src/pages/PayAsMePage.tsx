
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ServiceLayout from "@/components/ServiceLayout";
import { cryptoOptions } from "@/utils/constants";
import { formatCurrencyAmount, generateOrderId, generatePrivateKey, getRandomAddress, isValidAddress, calculateNetworkFee } from "@/utils/helpers";
import InfoTooltip from "@/components/InfoTooltip";
import CryptoIcon from "@/components/CryptoIcon";
import AddressDisplay from "@/components/AddressDisplay";
import GuaranteeLetter from "@/components/GuaranteeLetter";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, Loader, Check, AlertTriangle, Building, ExternalLink } from "lucide-react";

const payAsmeSchema = z.object({
  currency: z.string().min(1, "Please select a currency"),
  receivingAddress: z.string().min(1, "Receiving address is required"),
  exactAmount: z.coerce.number().positive("Amount must be greater than 0"),
});

type PayAsmeFormValues = z.infer<typeof payAsmeSchema>;

const PaymentStatus = {
  WAITING: 'waiting',
  CHECKING: 'checking',
  CONFIRMED: 'confirmed',
  NOT_RECEIVED: 'not_received'
};

const PayAsMePage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [depositAddress, setDepositAddress] = useState("");
  const [orderId, setOrderId] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("btc");
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(PaymentStatus.WAITING);
  const [networkFee, setNetworkFee] = useState(0);
  const [checkCounter, setCheckCounter] = useState(10 * 60); // 10 minutes in seconds
  const [processingSubmit, setProcessingSubmit] = useState(false);
  const [addressValid, setAddressValid] = useState(false);

  const form = useForm<PayAsmeFormValues>({
    resolver: zodResolver(payAsmeSchema),
    defaultValues: {
      currency: "btc",
      receivingAddress: "",
      exactAmount: 0.01,
    },
  });

  const watchCurrency = form.watch("currency");
  const watchReceivingAddress = form.watch("receivingAddress");

  // Format minutes and seconds
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  };

  // Validate receiving address
  useEffect(() => {
    if (watchReceivingAddress && watchCurrency) {
      setAddressValid(isValidAddress(watchReceivingAddress, watchCurrency));
    } else {
      setAddressValid(false);
    }
  }, [watchReceivingAddress, watchCurrency]);

  // Payment status checking simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showConfirmation) {
      interval = setInterval(() => {
        if (paymentStatus === PaymentStatus.CHECKING) {
          // Simulate checking result
          setPaymentStatus(Math.random() > 0.8 ? PaymentStatus.CONFIRMED : PaymentStatus.NOT_RECEIVED);
        } else if (paymentStatus === PaymentStatus.NOT_RECEIVED) {
          // If not received, go back to waiting after showing message
          if (checkCounter > 0) {
            setCheckCounter(prev => prev - 1);
          } else {
            setCheckCounter(10 * 60); // Reset to 10 minutes
            setPaymentStatus(PaymentStatus.WAITING);
          }
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showConfirmation, paymentStatus, checkCounter]);

  // Check payment status every 20 seconds if waiting
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showConfirmation && paymentStatus === PaymentStatus.WAITING) {
      timer = setTimeout(() => {
        setPaymentStatus(PaymentStatus.CHECKING);
      }, 20000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showConfirmation, paymentStatus]);

  const onSubmit = (data: PayAsmeFormValues) => {
    if (!isValidAddress(data.receivingAddress, data.currency)) {
      toast({
        title: "Invalid address",
        description: `Invalid ${data.currency.toUpperCase()} address format. Please check and try again.`,
        variant: "destructive",
      });
      return;
    }

    // Start processing
    setProcessingSubmit(true);

    // Simulate backend processing
    setTimeout(() => {
      try {
        // Generate order data
        const newOrderId = generateOrderId();
        const newPrivateKey = generatePrivateKey();
        const generatedDepositAddress = getRandomAddress(data.currency);
        
        if (!generatedDepositAddress) {
          throw new Error(`Could not generate a valid deposit address for ${data.currency.toUpperCase()}`);
        }
        
        const fee = calculateNetworkFee(data.exactAmount, data.currency);
        
        // Save data
        setOrderId(newOrderId);
        setPrivateKey(newPrivateKey);
        setDepositAddress(generatedDepositAddress);
        setSelectedCurrency(data.currency);
        setSelectedAmount(data.exactAmount);
        setNetworkFee(fee);
        setPaymentStatus(PaymentStatus.WAITING);
        setShowConfirmation(true);
        setProcessingSubmit(false);
        
        toast({
          title: "Payment address created",
          description: "Your payment address has been generated successfully.",
        });
      } catch (error) {
        console.error("Error creating payment address:", error);
        toast({
          title: "Error creating payment address",
          description: error instanceof Error ? error.message : "An unknown error occurred.",
          variant: "destructive",
        });
        setProcessingSubmit(false);
      }
    }, 1500);
  };

  // Render payment status UI
  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case PaymentStatus.WAITING:
        return (
          <div className="flex items-center justify-center gap-2 bg-secondary/50 p-3 rounded-md mt-4 animate-pulse">
            <Clock className="h-5 w-5 text-primary" />
            <p className="text-sm">Waiting for payment...</p>
          </div>
        );
      case PaymentStatus.CHECKING:
        return (
          <div className="flex items-center justify-center gap-2 bg-secondary/50 p-3 rounded-md mt-4">
            <Loader className="h-5 w-5 text-primary animate-spin" />
            <p className="text-sm">Checking payment status...</p>
          </div>
        );
      case PaymentStatus.CONFIRMED:
        return (
          <div className="flex items-center justify-center gap-2 bg-green-500/20 p-3 rounded-md mt-4">
            <Check className="h-5 w-5 text-green-500" />
            <p className="text-sm">Payment confirmed! Funds will be forwarded to your address.</p>
          </div>
        );
      case PaymentStatus.NOT_RECEIVED:
        return (
          <div className="flex items-center justify-center gap-2 bg-secondary/50 p-3 rounded-md mt-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p className="text-sm">Payment not received. Waiting for payment to be received. Checking again in {formatTimeRemaining(checkCounter)}.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ServiceLayout
      title="Pay As Me"
      description="Fixed amount detection system. Perfect for merchants who need exact amount matching for transactions."
    >
      {!showConfirmation ? (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Currency */}
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Currency <InfoTooltip text="Select the cryptocurrency you want to use" />
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/30 border-primary/20">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cryptoOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <CryptoIcon symbol={option.value} size="sm" />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Exact Amount */}
                <FormField
                  control={form.control}
                  name="exactAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Exact Amount <InfoTooltip text="System will detect this exact amount to forward funds" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step="any"
                            className="pr-16 bg-secondary/30 border-primary/20"
                            {...field}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                            {form.getValues("currency").toUpperCase()}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Receiving Address */}
                <FormField
                  control={form.control}
                  name="receivingAddress"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center">
                        Receiving Address <InfoTooltip text="Enter the wallet address where you want to receive funds" />
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={`Your ${form.getValues("currency").toUpperCase()} address`} 
                          className="bg-secondary/30 border-primary/20"
                          {...field} 
                        />
                      </FormControl>
                      {field.value && !addressValid && (
                        <p className="text-xs text-destructive mt-1">
                          Invalid {form.getValues("currency").toUpperCase()} address format
                        </p>
                      )}
                      {field.value && addressValid && (
                        <p className="text-xs text-green-500 mt-1">
                          Valid address format
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={processingSubmit || (watchReceivingAddress && !addressValid)}
                >
                  {processingSubmit ? "Processing..." : "Generate Payment Address"}
                </Button>
              </div>
            </form>
          </Form>
          
          {/* Moved the explanation/info alert to after the form */}
          <div className="mt-10">
            <Alert className="bg-primary/10 border border-primary/20 shadow-lg">
              <div className="flex gap-3">
                <Building className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <AlertTitle className="text-lg font-semibold text-primary">What is Pay As Me?</AlertTitle>
                  <AlertDescription className="mt-2">
                    <p className="mb-2 text-foreground/90">This service creates a unique payment detection system based on exact payment amounts.</p>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/20 p-1 rounded-full">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">Specify an <strong>exact</strong> amount for your customer to send</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/20 p-1 rounded-full">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">Our system generates a unique deposit address for this specific amount</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/20 p-1 rounded-full">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">When the exact amount is received, funds are automatically forwarded to you</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/20 p-1 rounded-full">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">Perfect for merchants who need to match payments to specific orders</p>
                      </div>
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Payment Address Generated
            </h2>
            <p className="text-sm text-muted-foreground">
              You <span className="font-bold">MUST</span> send <span className="font-semibold">exactly</span> {formatCurrencyAmount(selectedAmount, selectedCurrency)} {selectedCurrency.toUpperCase()} + 
              network fees ({formatCurrencyAmount(networkFee, selectedCurrency)} {selectedCurrency.toUpperCase()}) to the address below
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total: <span className="font-mono font-medium">{formatCurrencyAmount(selectedAmount + networkFee, selectedCurrency)} {selectedCurrency.toUpperCase()}</span>
            </p>
          </div>

          <div className="bg-secondary/30 p-6 rounded-lg border border-primary/10 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">EXACT AMOUNT RECEIVER WILL RECEIVE</p>
            <div className="text-2xl font-mono font-semibold text-primary my-2">
              {formatCurrencyAmount(selectedAmount, selectedCurrency)} {selectedCurrency.toUpperCase()}
            </div>
            <div className="mb-4 text-sm">
              <span className="text-muted-foreground">Receiver's Address:</span>
              <div className="font-mono text-xs mt-1 bg-secondary/50 p-2 rounded break-all">
                {form.getValues("receivingAddress")}
              </div>
            </div>
            <Alert className="bg-primary/5 border-primary/20">
              <AlertTitle className="flex items-center gap-2 text-sm text-primary">
                <AlertTriangle className="h-4 w-4" />
                Notice
              </AlertTitle>
              <AlertDescription className="text-xs text-foreground/90">
                Please double check address and amount before sending. You must send the exact numbers shown above.
              </AlertDescription>
            </Alert>
          </div>

          <AddressDisplay 
            address={depositAddress}
            currency={selectedCurrency}
            orderId={orderId}
            note="The system will only forward funds when the exact amount is received."
          />

          {renderPaymentStatus()}

          <Alert className="mb-6 border-primary/20 bg-secondary/50 text-foreground">
            <AlertTitle className="text-primary">Important</AlertTitle>
            <AlertDescription>
              You MUST send exactly {formatCurrencyAmount(selectedAmount, selectedCurrency)} {selectedCurrency.toUpperCase()} + network fees. 
              Sending a different amount will not trigger the forwarding system.
            </AlertDescription>
          </Alert>

          <div className="py-4">
            <div className="border-t border-border" />
          </div>

          <GuaranteeLetter
            orderId={orderId}
            receivingAddress={form.getValues("receivingAddress")}
            depositAddress={depositAddress}
            privateKey={privateKey}
            orderType="Pay As Me"
            fromCurrency={selectedCurrency}
            toCurrency={selectedCurrency}
            amount={selectedAmount}
          />

          <div className="mt-6 text-center">
            <Button 
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="border-primary/20 hover:bg-primary/10"
            >
              Create Another Payment
            </Button>
          </div>
        </div>
      )}
    </ServiceLayout>
  );
};

export default PayAsMePage;

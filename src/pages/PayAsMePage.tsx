
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
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, Loader, Check, AlertTriangle } from "lucide-react";

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
  const [checkCounter, setCheckCounter] = useState(10);

  const form = useForm<PayAsmeFormValues>({
    resolver: zodResolver(payAsmeSchema),
    defaultValues: {
      currency: "btc",
      receivingAddress: "",
      exactAmount: 0.01,
    },
  });

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
            setCheckCounter(10);
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
      toast.error(`Invalid ${data.currency.toUpperCase()} address format`);
      return;
    }

    // Generate order data
    const newOrderId = generateOrderId();
    const newPrivateKey = generatePrivateKey();
    const generatedDepositAddress = getRandomAddress(data.currency);
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
            <p className="text-sm">Payment not received. Waiting for payment to be received. Checking again in {checkCounter} minutes.</p>
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
          <Alert className="mb-6 bg-secondary/50 border-primary/20">
            <AlertTitle>Fixed Amount Detection</AlertTitle>
            <AlertDescription>
              This service will forward funds only when the exact specified amount is sent to the generated address.
            </AlertDescription>
          </Alert>

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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-primary hover:bg-primary/90">Generate Payment Address</Button>
              </div>
            </form>
          </Form>
        </>
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Payment Address Generated
            </h2>
            <p className="text-sm text-muted-foreground">
              Send <span className="font-semibold">exactly</span> {formatCurrencyAmount(selectedAmount, selectedCurrency)} {selectedCurrency.toUpperCase()} + 
              network fees ({formatCurrencyAmount(networkFee, selectedCurrency)} {selectedCurrency.toUpperCase()}) to the address below
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total: {formatCurrencyAmount(selectedAmount + networkFee, selectedCurrency)} {selectedCurrency.toUpperCase()}
            </p>
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

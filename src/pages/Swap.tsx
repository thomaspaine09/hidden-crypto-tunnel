
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ServiceLayout from "@/components/ServiceLayout";
import { Separator } from "@/components/ui/separator";
import { cryptoOptions } from "@/utils/constants";
import { calculateFinalAmount, formatCurrencyAmount, generateOrderId, generatePrivateKey, getExchangeRate, getRandomAddress, isValidAddress } from "@/utils/helpers";
import InfoTooltip from "@/components/InfoTooltip";
import CryptoIcon from "@/components/CryptoIcon";
import AddressDisplay from "@/components/AddressDisplay";
import GuaranteeLetter from "@/components/GuaranteeLetter";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, X } from "lucide-react";

const swapFormSchema = z.object({
  fromCurrency: z.string().min(1, "Please select a currency"),
  toCurrency: z.string().min(1, "Please select a currency"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  receivingAddress: z.string().min(1, "Receiving address is required"),
});

type SwapFormValues = z.infer<typeof swapFormSchema>;

const Swap = () => {
  const { toast } = useToast();
  const [exchangeRate, setExchangeRate] = useState(0);
  const [networkFee, setNetworkFee] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [depositAddress, setDepositAddress] = useState("");
  const [orderId, setOrderId] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showSameCurrencyAlert, setShowSameCurrencyAlert] = useState(false);
  const [processingSubmit, setProcessingSubmit] = useState(false);
  const [addressValid, setAddressValid] = useState(false);

  const form = useForm<SwapFormValues>({
    resolver: zodResolver(swapFormSchema),
    defaultValues: {
      fromCurrency: "btc",
      toCurrency: "eth",
      amount: 0.1,
      receivingAddress: "",
    },
  });

  const watchFromCurrency = form.watch("fromCurrency");
  const watchToCurrency = form.watch("toCurrency");
  const watchAmount = form.watch("amount");
  const watchReceivingAddress = form.watch("receivingAddress");

  // Update exchange rate when currencies change
  useEffect(() => {
    if (watchFromCurrency && watchToCurrency) {
      const rate = getExchangeRate(watchFromCurrency, watchToCurrency);
      setExchangeRate(rate);
      
      // Show alert if same currency is selected
      if (watchFromCurrency === watchToCurrency) {
        setShowSameCurrencyAlert(true);
        // Display toast notification for same currency selection
        toast({
          title: "Same currency selected",
          description: "For better security and potentially lower fees, consider using our Mixer service instead.",
          variant: "destructive",
        });
      } else {
        setShowSameCurrencyAlert(false);
      }
    }
  }, [watchFromCurrency, watchToCurrency, toast]);

  // Recalculate fees and final amount
  useEffect(() => {
    if (watchAmount && watchFromCurrency && watchToCurrency) {
      // Calculate network fee (0.3% or 0.8% for XMR)
      const feePercentage = watchFromCurrency === "xmr" ? 0.8 : 0.3;
      const calculatedFee = watchAmount * (feePercentage / 100);
      setNetworkFee(calculatedFee);
      
      // Calculate final amount
      const calculated = calculateFinalAmount(
        watchAmount,
        watchFromCurrency,
        watchToCurrency
      );
      setFinalAmount(calculated);
    }
  }, [watchAmount, watchFromCurrency, watchToCurrency]);

  // Validate receiving address
  useEffect(() => {
    if (watchReceivingAddress && watchToCurrency) {
      const valid = isValidAddress(watchReceivingAddress, watchToCurrency);
      setAddressValid(valid);
    } else {
      setAddressValid(false);
    }
  }, [watchReceivingAddress, watchToCurrency]);

  const onSubmit = (data: SwapFormValues) => {
    console.log("Form submitted with data:", data);
    
    // Validate address format
    if (!isValidAddress(data.receivingAddress, data.toCurrency)) {
      toast({
        title: "Invalid address",
        description: `The ${data.toCurrency.toUpperCase()} address format is not valid. Please check and try again.`,
        variant: "destructive",
      });
      return;
    }

    // Show warning if the same currency is selected
    if (data.fromCurrency === data.toCurrency) {
      const proceedAnyway = window.confirm(
        "You're trying to swap the same currency. This may incur unnecessary fees. Do you want to proceed anyway? (Consider using our Mixer service for better privacy and lower fees.)"
      );
      
      if (!proceedAnyway) {
        return;
      }
      
      toast({
        title: "Same currency swap",
        description: "Proceeding with same currency swap as requested.",
      });
    }

    setProcessingSubmit(true);

    // Simulate processing time with a delay
    setTimeout(() => {
      try {
        // Generate order data
        const newOrderId = generateOrderId();
        const newPrivateKey = generatePrivateKey();
        const generatedDepositAddress = getRandomAddress(data.fromCurrency);
        
        console.log("Generated deposit address:", generatedDepositAddress);
        
        if (!generatedDepositAddress) {
          throw new Error(`Could not generate a valid deposit address for ${data.fromCurrency.toUpperCase()}`);
        }
        
        // Save data
        setOrderId(newOrderId);
        setPrivateKey(newPrivateKey);
        setDepositAddress(generatedDepositAddress);
        setShowConfirmation(true);
        setProcessingSubmit(false);
        
        toast({
          title: "Order created successfully",
          description: "Please send funds to the deposit address to complete your swap.",
        });
      } catch (error) {
        console.error("Error creating swap order:", error);
        toast({
          title: "Error creating order",
          description: error instanceof Error ? error.message : "An unknown error occurred. Please try again.",
          variant: "destructive",
        });
        setProcessingSubmit(false);
      }
    }, 1500);
  };

  return (
    <ServiceLayout
      title="Crypto Swap"
      description="Exchange cryptocurrencies with complete privacy. No accounts, no KYC, no tracking."
    >
      {!showConfirmation ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {showSameCurrencyAlert && (
              <Alert className="bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-400">
                <div className="flex items-start justify-between w-full">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <AlertTitle className="mb-1">Same currency selected</AlertTitle>
                      <AlertDescription className="text-sm">
                        For better security and potentially lower fees, consider using our Mixer service instead.
                      </AlertDescription>
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20"
                          asChild
                        >
                          <Link to="/mixer" className="flex items-center gap-1">
                            Go to Mixer <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => setShowSameCurrencyAlert(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Currency */}
              <FormField
                control={form.control}
                name="fromCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      From Currency <InfoTooltip text="Select the cryptocurrency you want to exchange from" />
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        console.log("From currency changed to:", value);
                        if (value === field.value) {
                          return;
                        }
                        if (value === form.getValues("toCurrency")) {
                          // Swap the values
                          form.setValue("toCurrency", field.value);
                        }
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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

              {/* To Currency */}
              <FormField
                control={form.control}
                name="toCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      To Currency <InfoTooltip text="Select the cryptocurrency you want to exchange to" />
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        console.log("To currency changed to:", value);
                        if (value === field.value) {
                          return;
                        }
                        if (value === form.getValues("fromCurrency")) {
                          // Swap the values
                          form.setValue("fromCurrency", field.value);
                        }
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Amount <InfoTooltip text="Enter the amount you want to exchange" />
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="any"
                          className="pr-16"
                          {...field}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                          {watchFromCurrency.toUpperCase()}
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
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Receiving Address <InfoTooltip text="Enter the wallet address where you want to receive your exchanged funds" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={`Your ${watchToCurrency.toUpperCase()} address`} {...field} />
                    </FormControl>
                    {field.value && !addressValid && (
                      <p className="text-xs text-destructive mt-1">
                        Invalid {watchToCurrency.toUpperCase()} address format
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

            <Separator />

            {/* Exchange Info */}
            {watchAmount > 0 && (
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">Transaction Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exchange Rate:</span>
                    <span>
                      1 {watchFromCurrency.toUpperCase()} = {formatCurrencyAmount(exchangeRate, watchToCurrency)} {watchToCurrency.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network Fee ({watchFromCurrency === "xmr" ? "0.8" : "0.3"}%):</span>
                    <span>
                      {formatCurrencyAmount(networkFee, watchFromCurrency)} {watchFromCurrency.toUpperCase()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>You will receive approximately:</span>
                    <span>
                      {formatCurrencyAmount(finalAmount, watchToCurrency)} {watchToCurrency.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={processingSubmit || (watchReceivingAddress && !addressValid)}
                className={watchFromCurrency === watchToCurrency ? "bg-amber-500 hover:bg-amber-600" : ""}
              >
                {processingSubmit ? "Processing..." : "Continue to Swap"}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium">Send your deposit to this address</h2>
            <p className="text-sm text-muted-foreground">
              Transfer exactly {formatCurrencyAmount(watchAmount, watchFromCurrency)} {watchFromCurrency.toUpperCase()} to the address below
            </p>
          </div>

          <AddressDisplay 
            address={depositAddress}
            currency={watchFromCurrency}
            orderId={orderId}
            note="Please send exactly the amount specified to avoid transaction issues."
            exactAmount={watchAmount}
            networkFee={networkFee}
          />

          <div className="py-4">
            <Separator />
          </div>

          <GuaranteeLetter
            orderId={orderId}
            receivingAddress={form.getValues("receivingAddress")}
            depositAddress={depositAddress}
            privateKey={privateKey}
            orderType="Crypto Swap"
            fromCurrency={watchFromCurrency}
            toCurrency={watchToCurrency}
            amount={watchAmount}
          />

          <div className="mt-6 text-center">
            <Button 
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Return to Swap Form
            </Button>
          </div>
        </div>
      )}
    </ServiceLayout>
  );
};

export default Swap;

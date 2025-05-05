
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ServiceLayout from "@/components/ServiceLayout";
import { cryptoOptions } from "@/utils/constants";
import { formatCurrencyAmount, generateOrderId, generatePrivateKey, getRandomAddress, isValidAddress } from "@/utils/helpers";
import InfoTooltip from "@/components/InfoTooltip";
import CryptoIcon from "@/components/CryptoIcon";
import AddressDisplay from "@/components/AddressDisplay";
import GuaranteeLetter from "@/components/GuaranteeLetter";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const payAsmeSchema = z.object({
  currency: z.string().min(1, "Please select a currency"),
  receivingAddress: z.string().min(1, "Receiving address is required"),
  exactAmount: z.coerce.number().positive("Amount must be greater than 0"),
});

type PayAsmeFormValues = z.infer<typeof payAsmeSchema>;

const PayAsMePage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [depositAddress, setDepositAddress] = useState("");
  const [orderId, setOrderId] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("btc");
  const [selectedAmount, setSelectedAmount] = useState(0);

  const form = useForm<PayAsmeFormValues>({
    resolver: zodResolver(payAsmeSchema),
    defaultValues: {
      currency: "btc",
      receivingAddress: "",
      exactAmount: 0.01,
    },
  });

  const onSubmit = (data: PayAsmeFormValues) => {
    if (!isValidAddress(data.receivingAddress, data.currency)) {
      toast.error(`Invalid ${data.currency.toUpperCase()} address format`);
      return;
    }

    // Generate order data
    const newOrderId = generateOrderId();
    const newPrivateKey = generatePrivateKey();
    const generatedDepositAddress = getRandomAddress(data.currency);
    
    // Save data
    setOrderId(newOrderId);
    setPrivateKey(newPrivateKey);
    setDepositAddress(generatedDepositAddress);
    setSelectedCurrency(data.currency);
    setSelectedAmount(data.exactAmount);
    setShowConfirmation(true);
  };

  return (
    <ServiceLayout
      title="Pay As Me"
      description="Fixed amount detection system. Perfect for merchants who need exact amount matching for transactions."
    >
      {!showConfirmation ? (
        <>
          <Alert className="mb-6">
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
                            className="pr-16"
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
                        <Input placeholder={`Your ${form.getValues("currency").toUpperCase()} address`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">Generate Payment Address</Button>
              </div>
            </form>
          </Form>
        </>
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium">
              Payment Address Generated
            </h2>
            <p className="text-sm text-muted-foreground">
              Send <span className="font-semibold">exactly</span> {formatCurrencyAmount(selectedAmount, selectedCurrency)} {selectedCurrency.toUpperCase()} to the address below
            </p>
          </div>

          <AddressDisplay 
            address={depositAddress}
            currency={selectedCurrency}
            orderId={orderId}
            note="The system will only forward funds when the exact amount is received."
          />

          <Alert className="mb-6">
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              You MUST send exactly {formatCurrencyAmount(selectedAmount, selectedCurrency)} {selectedCurrency.toUpperCase()}. Sending a different amount will not trigger the forwarding system.
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


import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceLayout from "@/components/ServiceLayout";
import { cryptoOptions } from "@/utils/constants";
import { generateOrderId, generatePrivateKey, getRandomAddress, isValidAddress } from "@/utils/helpers";
import InfoTooltip from "@/components/InfoTooltip";
import CryptoIcon from "@/components/CryptoIcon";
import AddressDisplay from "@/components/AddressDisplay";
import GuaranteeLetter from "@/components/GuaranteeLetter";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const privateMixerSchema = z.object({
  currency: z.string().min(1, "Please select a currency"),
  receivingAddress: z.string().min(1, "Receiving address is required"),
});

const publicMixerSchema = z.object({
  currency: z.string().min(1, "Please select a currency"),
  sendingAddress: z.string().min(1, "Sending address is required"),
  receivingAddress: z.string().min(1, "Receiving address is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0").optional(),
});

type PrivateMixerFormValues = z.infer<typeof privateMixerSchema>;
type PublicMixerFormValues = z.infer<typeof publicMixerSchema>;

const Mixer = () => {
  const [activeTab, setActiveTab] = useState("private");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [depositAddress, setDepositAddress] = useState("");
  const [orderId, setOrderId] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [mixerType, setMixerType] = useState<"private" | "public">("private");
  const [selectedCurrency, setSelectedCurrency] = useState("btc");
  const [selectedAmount, setSelectedAmount] = useState<number | undefined>(undefined);

  // Private mixer form
  const privateMixerForm = useForm<PrivateMixerFormValues>({
    resolver: zodResolver(privateMixerSchema),
    defaultValues: {
      currency: "btc",
      receivingAddress: "",
    },
  });

  // Public mixer form
  const publicMixerForm = useForm<PublicMixerFormValues>({
    resolver: zodResolver(publicMixerSchema),
    defaultValues: {
      currency: "btc",
      sendingAddress: "",
      receivingAddress: "",
      amount: undefined,
    },
  });

  const onSubmitPrivate = (data: PrivateMixerFormValues) => {
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
    setMixerType("private");
    setShowConfirmation(true);
  };

  const onSubmitPublic = (data: PublicMixerFormValues) => {
    if (!isValidAddress(data.receivingAddress, data.currency)) {
      toast.error(`Invalid receiving ${data.currency.toUpperCase()} address format`);
      return;
    }

    if (!isValidAddress(data.sendingAddress, data.currency)) {
      toast.error(`Invalid sending ${data.currency.toUpperCase()} address format`);
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
    setSelectedAmount(data.amount);
    setMixerType("public");
    setShowConfirmation(true);
  };

  return (
    <ServiceLayout
      title="Crypto Mixer"
      description="Enhance your privacy with our mixing service. Choose between private or public mixing."
    >
      {!showConfirmation ? (
        <Tabs defaultValue="private" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="private">Private Mixer</TabsTrigger>
            <TabsTrigger value="public">Public Mixer</TabsTrigger>
          </TabsList>

          <TabsContent value="private">
            <Alert className="mb-6">
              <AlertTitle>Private Mixer</AlertTitle>
              <AlertDescription>
                Completely anonymous mixer service. Any funds sent to the provided address will be forwarded to your destination wallet.
              </AlertDescription>
            </Alert>

            <Form {...privateMixerForm}>
              <form onSubmit={privateMixerForm.handleSubmit(onSubmitPrivate)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Currency */}
                  <FormField
                    control={privateMixerForm.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Currency <InfoTooltip text="Select the cryptocurrency you want to mix" />
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

                  {/* Receiving Address */}
                  <FormField
                    control={privateMixerForm.control}
                    name="receivingAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center">
                          Receiving Address <InfoTooltip text="Enter the wallet address where you want to receive your mixed funds" />
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Your wallet address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Continue</Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="public">
            <Alert className="mb-6">
              <AlertTitle>Public Mixer</AlertTitle>
              <AlertDescription>
                This mixer uses a shared public deposit address. You must specify the sending address so we can identify your transaction.
              </AlertDescription>
            </Alert>

            <Form {...publicMixerForm}>
              <form onSubmit={publicMixerForm.handleSubmit(onSubmitPublic)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Currency */}
                  <FormField
                    control={publicMixerForm.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Currency <InfoTooltip text="Select the cryptocurrency you want to mix" />
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

                  {/* Amount (optional) */}
                  <FormField
                    control={publicMixerForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Amount (optional) <InfoTooltip text="If specified, we'll look for this exact amount" />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="any"
                              className="pr-16"
                              placeholder="Any amount"
                              {...field}
                              value={field.value === undefined ? "" : field.value}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                              {publicMixerForm.getValues("currency").toUpperCase()}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sending Address */}
                  <FormField
                    control={publicMixerForm.control}
                    name="sendingAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center">
                          Sending Address <InfoTooltip text="The address you will be sending funds from. Required to identify your transaction." />
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Address sending the funds" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Receiving Address */}
                  <FormField
                    control={publicMixerForm.control}
                    name="receivingAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center">
                          Receiving Address <InfoTooltip text="Enter the wallet address where you want to receive your mixed funds" />
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Address receiving the funds" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Continue</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium">
              {mixerType === "private"
                ? "Send your deposit to this private address"
                : "Send your deposit to this public address"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mixerType === "private"
                ? "Any amount sent to this address will be mixed and forwarded"
                : "Send from the address you specified to identify your transaction"}
            </p>
          </div>

          <AddressDisplay 
            address={depositAddress}
            currency={selectedCurrency}
            orderId={orderId}
            note={
              mixerType === "private"
                ? "This is a one-time address that will be removed from our pool after use."
                : "Remember to send funds only from the wallet address you specified."
            }
          />

          {mixerType === "public" && (
            <Alert variant="destructive" className="bg-destructive/10">
              <AlertTitle>Important Notice</AlertTitle>
              <AlertDescription>
                This is a public mixer address. You MUST send funds from the address you entered ({publicMixerForm.getValues("sendingAddress")}) or your transaction will not be processed.
              </AlertDescription>
            </Alert>
          )}

          <div className="py-4">
            <div className="border-t border-border" />
          </div>

          <GuaranteeLetter
            orderId={orderId}
            receivingAddress={
              mixerType === "private"
                ? privateMixerForm.getValues("receivingAddress")
                : publicMixerForm.getValues("receivingAddress")
            }
            depositAddress={depositAddress}
            privateKey={privateKey}
            orderType={mixerType === "private" ? "Private Mixer" : "Public Mixer"}
            fromCurrency={selectedCurrency}
            toCurrency={selectedCurrency}
            amount={selectedAmount || 0}
          />

          <div className="mt-6 text-center">
            <Button 
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Return to Mixer Form
            </Button>
          </div>
        </div>
      )}
    </ServiceLayout>
  );
};

export default Mixer;

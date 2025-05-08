
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ServiceLayout from "@/components/ServiceLayout";
import { findOrder } from "@/utils/fileSystemService";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyAmount } from "@/utils/helpers";
import CryptoIcon from "@/components/CryptoIcon";
import { Check, Clock, FileSearch, ShieldCheck } from "lucide-react";

const trackOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  privateKey: z.string().min(1, "Private key is required"),
});

type TrackOrderFormValues = z.infer<typeof trackOrderSchema>;

const TrackOrder = () => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TrackOrderFormValues>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: {
      orderId: "",
      privateKey: "",
    },
  });

  const onSubmit = (data: TrackOrderFormValues) => {
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      // Look up the order in our records
      const order = findOrder(data.orderId, data.privateKey);
      
      if (order) {
        setOrderDetails(order);
      } else {
        toast.error("Order not found. Please check your Order ID and Private Key.");
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <ServiceLayout
      title="Track Order"
      description="Check the status of your transaction by entering your Order ID and Private Key."
    >
      {!orderDetails ? (
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <FileSearch className="h-16 w-16 text-primary/60" />
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="orderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Order ID (e.g., ORD-1234567890-123)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privateKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Private Key</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter the private key from your guarantee letter" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Searching..." : "Track Order"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Your Order ID and Private Key can be found in your guarantee letter.</p>
            <p className="mt-2">We never store your transaction details - only you can access them with this combination.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 bg-green-500/20 p-3 rounded-md">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <p>Order found! Here are your transaction details:</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order {orderDetails.orderId}</span>
                <div className="text-sm px-3 py-1 bg-primary/10 rounded-full">
                  {orderDetails.orderType}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Transaction</h3>
                <div className="flex items-center">
                  <div className="flex items-center gap-1">
                    <CryptoIcon symbol={orderDetails.fromCurrency} size="sm" />
                    <span>{formatCurrencyAmount(orderDetails.amount, orderDetails.fromCurrency)} {orderDetails.fromCurrency.toUpperCase()}</span>
                  </div>
                  
                  <div className="mx-2">→</div>
                  
                  <div className="flex items-center gap-1">
                    <CryptoIcon symbol={orderDetails.toCurrency} size="sm" />
                    <span>{formatCurrencyAmount(
                      orderDetails.fromCurrency === orderDetails.toCurrency 
                        ? orderDetails.amount 
                        : orderDetails.amount * 0.97, // Simplified calculation for display
                      orderDetails.toCurrency
                    )} {orderDetails.toCurrency.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Receiving Address</h3>
                  <div className="text-xs bg-muted p-2 rounded break-all font-mono">
                    {orderDetails.receivingAddress}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Deposit Address</h3>
                  <div className="text-xs bg-muted p-2 rounded break-all font-mono">
                    {orderDetails.depositAddress}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <div className="flex items-center gap-2">
                  {Math.random() > 0.5 ? (
                    <>
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <span>Waiting for deposit</span>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                <div>{new Date(orderDetails.timestamp).toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Button variant="outline" onClick={() => setOrderDetails(null)}>
              Track Another Order
            </Button>
          </div>
        </div>
      )}
    </ServiceLayout>
  );
};

export default TrackOrder;

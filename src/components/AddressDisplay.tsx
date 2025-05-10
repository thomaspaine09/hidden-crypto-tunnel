
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import CryptoIcon from "./CryptoIcon";
import { ArrowRight, Copy } from "lucide-react";

interface AddressDisplayProps {
  address: string;
  currency: string;
  orderId?: string;
  note?: string;
  exactAmount?: number;
  networkFee?: number;
}

const AddressDisplay = ({ 
  address, 
  currency, 
  orderId, 
  note,
  exactAmount,
  networkFee
}: AddressDisplayProps) => {
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!orderId) return;
    
    // Set initial values
    setMinutes(2);
    setSeconds(59);
    
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          setMinutes((prevMinutes) => {
            if (prevMinutes <= 0) {
              clearInterval(timer);
              return 0;
            }
            return prevMinutes - 1;
          });
          return 59;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address).then(
      () => {
        toast.success("Address copied to clipboard");
      },
      (err) => {
        toast.error("Could not copy address");
        console.error("Could not copy address: ", err);
      }
    );
  };

  const formatAmount = (amount?: number): string => {
    if (amount === undefined) return '';
    
    if (currency === 'btc') {
      return amount.toFixed(8);
    } else if (currency === 'eth' || currency === 'xmr') {
      return amount.toFixed(6);
    } else {
      return amount.toFixed(2);
    }
  };

  const totalAmount = exactAmount && networkFee ? exactAmount + networkFee : undefined;

  return (
    <Card className="border-muted bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <CryptoIcon symbol={currency} size="sm" />
          <span>Deposit Address</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exactAmount && networkFee && (
          <div className="mb-4 p-3 bg-primary/10 rounded-md">
            <h4 className="text-sm font-semibold mb-2">Payment Address Generated</h4>
            <p className="text-xs mb-2">
              You MUST send exactly {formatAmount(exactAmount)} {currency.toUpperCase()} + network fees ({formatAmount(networkFee)} {currency.toUpperCase()}) to the address below
            </p>
            <p className="text-sm font-bold">
              Total: {formatAmount(totalAmount)} {currency.toUpperCase()}
            </p>
          </div>
        )}

        <div className="mt-1 mb-3 p-3 bg-background rounded-md text-sm monospace break-all">
          {address}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4 mr-2" /> Copy Address
          </Button>
        </div>

        {exactAmount && (
          <div className="mt-4 p-3 border border-primary/20 bg-primary/5 rounded-md">
            <h4 className="text-sm font-semibold text-center mb-2">EXACT AMOUNT RECEIVER WILL RECEIVE</h4>
            <p className="text-center font-bold">{formatAmount(exactAmount)} {currency.toUpperCase()}</p>
          </div>
        )}

        {note && (
          <p className="text-xs text-muted-foreground mt-3">{note}</p>
        )}

        {orderId && (minutes > 0 || seconds > 0) && (
          <div className="mt-3 text-xs text-center text-muted-foreground">
            Payment not received. Waiting for payment to be received. Checking again in {minutes} minute{minutes !== 1 ? 's' : ''} {seconds} second{seconds !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressDisplay;

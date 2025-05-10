
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import CryptoIcon from "./CryptoIcon";

interface AddressDisplayProps {
  address: string;
  currency: string;
  orderId?: string;
  note?: string;
}

const AddressDisplay = ({ address, currency, orderId, note }: AddressDisplayProps) => {
  const [countdown, setCountdown] = useState(30);
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

  return (
    <Card className="border-muted bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <CryptoIcon symbol={currency} size="sm" />
          <span>Deposit Address</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-1 mb-3 p-3 bg-background rounded-md text-sm monospace break-all">
          {address}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={copyToClipboard}
          >
            Copy Address
          </Button>
        </div>

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

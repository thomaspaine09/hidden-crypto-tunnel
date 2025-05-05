
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

  useEffect(() => {
    if (!orderId) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
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

        {orderId && countdown > 0 && (
          <div className="mt-3 text-xs text-center text-muted-foreground">
            Checking for transaction... ({countdown}s)
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressDisplay;

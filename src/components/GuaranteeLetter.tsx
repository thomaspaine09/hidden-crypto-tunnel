
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateGuaranteeLetter } from "@/utils/helpers";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface GuaranteeLetterProps {
  orderId: string;
  receivingAddress: string;
  depositAddress: string;
  privateKey: string;
  orderType: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

const GuaranteeLetter = ({
  orderId,
  receivingAddress,
  depositAddress,
  privateKey,
  orderType,
  fromCurrency,
  toCurrency,
  amount
}: GuaranteeLetterProps) => {
  const letterText = generateGuaranteeLetter(
    receivingAddress,
    depositAddress,
    orderId,
    privateKey,
    orderType,
    fromCurrency,
    toCurrency,
    amount
  );

  const downloadLetter = () => {
    const element = document.createElement("a");
    const file = new Blob([letterText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `guarantee-letter-${orderId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Guarantee letter downloaded");
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <span>Guarantee Letter</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="bg-background p-3 rounded-md text-xs monospace whitespace-pre-wrap overflow-auto max-h-48">
          {letterText}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between mt-4">
        <p className="text-xs text-muted-foreground">
          This is your only proof of transaction. Keep it safe.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={downloadLetter}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GuaranteeLetter;

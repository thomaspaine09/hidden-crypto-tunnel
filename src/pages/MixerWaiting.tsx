
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MixerWaiting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30);
  const [checking, setChecking] = useState(true);
  
  // Simulate checking for a transaction
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 30; // Reset to 30 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // For demo purposes only - in a real app, this would check the blockchain
  const checkTransaction = () => {
    // Mock transaction check
    toast.info("Checking for transaction...");
    
    // Simulate API call with 80% chance of not finding payment
    setTimeout(() => {
      const found = Math.random() > 0.8;
      
      if (found) {
        toast.success("Payment detected! Processing your transaction.");
        navigate("/mixer"); // In real app, navigate to success page
      } else {
        toast.info("No payment detected yet. We'll keep checking.");
      }
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <div className="animate-pulse-subtle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                <path d="M22 12H2"></path>
                <path d="M12 2v20"></path>
                <path d="M17 3l-5 5-5-5"></path>
                <path d="M17 21l-5-5-5 5"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-2">Waiting for Transaction</h2>
          
          <p className="text-muted-foreground text-center mb-6">
            No payment detected. Waiting for transaction... (Checking again in {countdown}s)
          </p>
          
          <div className="w-full bg-muted rounded-full h-2 mb-6 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-1000" 
              style={{ width: `${((30 - countdown) / 30) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex flex-col w-full gap-4">
            <Button variant="outline" onClick={checkTransaction}>
              Check Now
            </Button>
            
            <Button variant="ghost" onClick={() => navigate("/mixer")}>
              Cancel and Return
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MixerWaiting;


import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ServiceLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

const ServiceLayout = ({ title, description, children }: ServiceLayoutProps) => {
  return (
    <div className="container max-w-3xl py-8 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl -z-10" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-primary/5 rounded-full filter blur-xl -z-10" />
      
      {/* Enhanced Matrix rain-like effect */}
      <div className="absolute inset-0 overflow-hidden -z-20 opacity-10 select-none pointer-events-none">
        <div className="matrix-code-1">01010110110101010010101010010101010101</div>
        <div className="matrix-code-2">10110101011010101001010110101011010101</div>
        <div className="matrix-code-3">01101010010101010010101101010010101010</div>
        <div className="matrix-code-4">10101010010101011010100101010101010101</div>
        <div className="matrix-code-5">01101010100101010010101010010101010101</div>
      </div>
      
      <div className="relative z-10">
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center">
          {title}
          <div className="ml-4 h-px flex-grow bg-gradient-to-r from-primary/50 to-transparent"></div>
        </h1>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Separator className="mb-6" />
        <Card className="p-6 border border-border/50 shadow-lg bg-card/95 backdrop-blur-sm">
          {children}
        </Card>
      </div>
    </div>
  );
};

export default ServiceLayout;

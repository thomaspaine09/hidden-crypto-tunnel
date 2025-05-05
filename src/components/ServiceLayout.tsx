
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
    <div className="container max-w-3xl py-8">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Separator className="mb-6" />
      <Card className="p-6">
        {children}
      </Card>
    </div>
  );
};

export default ServiceLayout;

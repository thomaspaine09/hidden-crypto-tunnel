
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import CryptoIcon from "@/components/CryptoIcon";
import { 
  ArrowRight, Shield, User, Code, Key, Clock, 
  CreditCard, Zap, AlertCircle, Lock, Bitcoin,
  Wallet, CircleDollarSign, ArrowUpDown
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Enhanced Matrix-style background effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="matrix-rain"></div>
      </div>

      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-primary/5 rounded-full filter blur-2xl"></div>
      </div>
      
      <div className="flex-1">
        {/* Hero Section with Bitcoin-themed styling */}
        <section className="py-20 px-4 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="text-[20rem] opacity-[0.02] font-mono tracking-tighter select-none text-primary">
              01010
            </div>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="bitcoin-float relative">
              <Bitcoin className="h-20 w-20 text-primary" />
              <div className="absolute inset-0 blur-md -z-10 opacity-50">
                <Bitcoin className="h-20 w-20 text-primary" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent inline-block">
              Anonymous
            </span>{" "}
            <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-500 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Crypto Swaps
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed backdrop-blur-sm bg-secondary/5 py-2 rounded-lg">
            Exchange cryptocurrencies with complete privacy. No accounts, no KYC, no tracking.
            Your keys, your coins, your privacy.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="btc-button group hover-expand" asChild>
              <Link to="/swap" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" /> Start Swapping 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="btc-button-alt hover-expand" asChild>
              <Link to="/mixer" className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> Use Mixer
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-crypto-pattern opacity-5 -z-10"></div>
          <div className="container max-w-6xl">
            <h2 className="text-2xl font-bold text-center mb-3">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Why Choose Us?
              </span>
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Built on principles of privacy, security, and decentralization. Our service offers the most secure way to exchange cryptocurrencies.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<Lock className="h-8 w-8 mb-2 text-primary" />}
                title="100% Private" 
                description="No accounts, no KYC, no personal information required. We don't track your activity or store any identifiable data."
              />
              <FeatureCard 
                icon={<Shield className="h-8 w-8 mb-2 text-primary" />}
                title="Secure Mixing" 
                description="Our mixing service uses advanced techniques to ensure complete transaction anonymity and break the chain of traceability."
              />
              <FeatureCard 
                icon={<User className="h-8 w-8 mb-2 text-primary" />}
                title="Non-Custodial" 
                description="We never hold your funds. All transactions are direct wallet-to-wallet with no intermediary control."
              />
              <FeatureCard 
                icon={<Code className="h-8 w-8 mb-2 text-primary" />}
                title="Transparent Code" 
                description="Our service is built on open principles. The code is available for review and ensures no backdoors exist."
              />
              <FeatureCard 
                icon={<Key className="h-8 w-8 mb-2 text-primary" />}
                title="One-Time Keys" 
                description="Every transaction uses unique addresses and keys, ensuring maximum privacy and security."
              />
              <FeatureCard 
                icon={<Clock className="h-8 w-8 mb-2 text-primary" />}
                title="Fast Processing" 
                description="Our automated system processes transactions quickly with minimal waiting times for confirmations."
              />
            </div>
          </div>
        </section>

        {/* Services Section with enhanced styling */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="binary-pattern h-full w-full opacity-10"></div>
          </div>
          
          <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -z-10 w-80 h-80 bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl"></div>
          
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-2">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Our Services
              </span>
            </h2>
            <div className="h-1 w-24 mx-auto mb-12 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ServiceCard 
                icon={<CreditCard className="h-5 w-5 text-primary" />}
                title="Crypto Swap"
                description="Exchange between cryptocurrencies anonymously"
                content="Swap between BTC, ETH, USDT, and XMR with minimal fees and maximum privacy. Every transaction is direct and untraceable."
                linkTo="/swap"
                linkText="Start Swapping"
              />

              <ServiceCard 
                icon={<Zap className="h-5 w-5 text-primary" />}
                title="Crypto Mixer"
                description="Enhance your privacy with our mixing service"
                content="Choose between private or public mixing to obfuscate transaction trails. Our advanced techniques ensure complete anonymity."
                linkTo="/mixer"
                linkText="Use Mixer"
              />

              <ServiceCard 
                icon={<CircleDollarSign className="h-5 w-5 text-primary" />}
                title="Pay As Me"
                description="Fixed amount forwarding system"
                content="Perfect for merchants who need exact amount matching for transactions. Simplify your payment system with our unique identifier approach."
                linkTo="/pay-as-me"
                linkText="Get Started"
              />
            </div>
          </div>
        </section>

        {/* Supported Cryptocurrencies - with enhanced styling */}
        <section className="py-16 relative">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-2">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Supported Cryptocurrencies
              </span>
            </h2>
            <div className="h-0.5 w-32 mx-auto mb-8 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
            
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { symbol: "btc", name: "Bitcoin", color: "bg-crypto-btc/10 border-crypto-btc/30" },
                { symbol: "eth", name: "Ethereum", color: "bg-crypto-eth/10 border-crypto-eth/30" },
                { symbol: "usdt", name: "Tether", color: "bg-crypto-usdt/10 border-crypto-usdt/30" },
                { symbol: "xmr", name: "Monero", color: "bg-crypto-xmr/10 border-crypto-xmr/30" }
              ].map(({ symbol, name, color }) => (
                <div 
                  key={symbol} 
                  className={`flex flex-col items-center py-6 px-10 rounded-xl border backdrop-blur-sm hover:animate-pulse-subtle ${color}`}
                >
                  <CryptoIcon symbol={symbol} size="lg" />
                  <span className="mt-3 font-medium">{name}</span>
                  <span className="text-xs text-muted-foreground mt-1">({symbol.toUpperCase()})</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Enhanced Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-primary/10 hover:border-primary/30 hover:shadow-glow-sm transition-all">
      <div className="text-center">
        <div className="mb-2 inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 border border-primary/20">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

// Enhanced Service Card Component
const ServiceCard = ({ 
  icon, title, description, content, linkTo, linkText 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  content: string,
  linkTo: string,
  linkText: string
}) => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/10 hover:border-primary/30 hover:shadow-glow-sm transition-all overflow-hidden group">
      <div className="absolute h-1 top-0 left-0 right-0 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          {content}
        </p>
        <Button variant="outline" className="w-full bg-secondary/40 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all" asChild>
          <Link to={linkTo} className="flex items-center justify-center gap-2">
            {linkText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default Index;

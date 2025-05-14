
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import CryptoIcon from "@/components/CryptoIcon";
import { ArrowRight, Shield, User, Code, Key, Clock, CreditCard, Zap, AlertCircle, Lock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Matrix-style background effect */}
      <div className="absolute inset-0 -z-10 bg-black/5 overflow-hidden">
        <div className="matrix-rain opacity-5"></div>
      </div>

      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="text-[20rem] opacity-[0.015] font-mono tracking-tighter select-none">
              01010
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-white bg-gradient-to-r from-white to-white/90 bg-clip-text relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-500 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Anonymous
            </span>{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Crypto Swaps
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Exchange cryptocurrencies with complete privacy. No accounts, no KYC, no tracking.
            Your keys, your coins, your privacy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="group" asChild>
              <Link to="/swap" className="flex items-center gap-2">
                Start Swapping 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/mixer" className="flex items-center gap-2">
                <Shield className="h-4 w-4 mr-1" /> Use Mixer
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container max-w-6xl">
            <h2 className="text-2xl font-bold text-center mb-3">Why Choose Us?</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Built on principles of privacy, security, and decentralization. Our service offers the most secure way to exchange cryptocurrencies.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<div className="text-center"><Lock className="h-8 w-8 mb-2 text-primary" /></div>}
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

        {/* Services Section */}
        <section className="py-16 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-black/5">
            <div className="binary-pattern opacity-5"></div>
          </div>
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-primary/10 bg-card/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Crypto Swap
                  </CardTitle>
                  <CardDescription>Exchange between cryptocurrencies anonymously</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Swap between BTC, ETH, USDT, and XMR with minimal fees and maximum privacy. Every transaction is direct and untraceable.
                  </p>
                  <Button variant="outline" className="w-full hover:bg-primary/10" asChild>
                    <Link to="/swap">Start Swapping</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/10 bg-card/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Crypto Mixer
                  </CardTitle>
                  <CardDescription>Enhance your privacy with our mixing service</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Choose between private or public mixing to obfuscate transaction trails. Our advanced techniques ensure complete anonymity.
                  </p>
                  <Button variant="outline" className="w-full hover:bg-primary/10" asChild>
                    <Link to="/mixer">Use Mixer</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/10 bg-card/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Pay As Me
                  </CardTitle>
                  <CardDescription>Fixed amount forwarding system</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Perfect for merchants who need exact amount matching for transactions. Simplify your payment system with our unique identifier approach.
                  </p>
                  <Button variant="outline" className="w-full hover:bg-primary/10" asChild>
                    <Link to="/pay-as-me">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Supported Currencies */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-8">Supported Cryptocurrencies</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {["btc", "eth", "usdt", "xmr"].map((symbol) => (
                <div key={symbol} className="flex flex-col items-center py-4 px-8 rounded-lg bg-secondary/20 border border-primary/10 backdrop-blur-sm hover:bg-secondary/30 transition-colors">
                  <CryptoIcon symbol={symbol} size="lg" />
                  <span className="mt-2 font-medium">
                    {symbol === "btc" && "Bitcoin"}
                    {symbol === "eth" && "Ethereum"}
                    {symbol === "usdt" && "Tether"}
                    {symbol === "xmr" && "Monero"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({symbol.toUpperCase()})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="p-6 rounded-lg bg-secondary/10 border border-primary/10 backdrop-blur-sm hover:bg-secondary/20 transition-colors">
      <div className="text-center">
        {icon}
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Index;

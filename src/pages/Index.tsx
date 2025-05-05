
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import CryptoIcon from "@/components/CryptoIcon";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-primary">Anonymous</span> Crypto Swaps
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Exchange cryptocurrencies with complete privacy. No accounts, no KYC, no tracking.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/swap">Start Swapping</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/mixer">Use Mixer</Link>
            </Button>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crypto Swap</CardTitle>
                  <CardDescription>Exchange between cryptocurrencies anonymously</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Swap between BTC, ETH, USDT, and XMR with minimal fees and maximum privacy.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/swap">Start Swapping</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crypto Mixer</CardTitle>
                  <CardDescription>Enhance your privacy with our mixing service</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Choose between private or public mixing to obfuscate transaction trails.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/mixer">Use Mixer</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pay As Me</CardTitle>
                  <CardDescription>Fixed amount forwarding system</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Perfect for merchants who need exact amount matching for transactions.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
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
                <div key={symbol} className="flex flex-col items-center">
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

      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AnonSwap. No logs. No tracking. Just privacy.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

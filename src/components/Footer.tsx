
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border bg-secondary/10 backdrop-blur-sm">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <div>
            <p className="text-base font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">AnonSwap</p>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} No logs. No tracking. Just privacy.
            </p>
          </div>
          
          <div className="flex space-x-8">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/swap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Swap</Link>
            <Link to="/mixer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mixer</Link>
            <Link to="/pay-as-me" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pay As Me</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

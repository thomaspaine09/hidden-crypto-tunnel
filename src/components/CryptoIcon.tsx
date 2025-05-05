
import { cn } from "@/lib/utils";

interface CryptoIconProps {
  symbol: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const CryptoIcon = ({ symbol, className, size = "md" }: CryptoIconProps) => {
  const getIcon = () => {
    switch (symbol.toLowerCase()) {
      case "btc":
        return "₿";
      case "eth":
        return "Ξ";
      case "usdt":
        return "₮";
      case "xmr":
        return "ɱ";
      default:
        return "?";
    }
  };

  const getColor = () => {
    switch (symbol.toLowerCase()) {
      case "btc":
        return "text-crypto-btc bg-crypto-btc/10";
      case "eth":
        return "text-crypto-eth bg-crypto-eth/10";
      case "usdt":
        return "text-crypto-usdt bg-crypto-usdt/10";
      case "xmr":
        return "text-crypto-xmr bg-crypto-xmr/10";
      default:
        return "text-gray-400 bg-gray-700/30";
    }
  };

  const getSize = () => {
    switch (size) {
      case "sm":
        return "w-6 h-6 text-xs";
      case "lg":
        return "w-12 h-12 text-xl";
      default:
        return "w-8 h-8 text-sm";
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold",
        getColor(),
        getSize(),
        className
      )}
    >
      {getIcon()}
    </div>
  );
};

export default CryptoIcon;

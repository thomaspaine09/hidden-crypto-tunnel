
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Swap from "./pages/Swap";
import Mixer from "./pages/Mixer";
import PayAsMePage from "./pages/PayAsMePage";
import MixerWaiting from "./pages/MixerWaiting";
import TrackOrder from "./pages/TrackOrder";
import { initFileSystem } from "./utils/fileSystemService";

const queryClient = new QueryClient();

const App = () => {
  // Initialize file system service when the app starts
  useEffect(() => {
    initFileSystem();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/swap" element={<Swap />} />
                <Route path="/mixer" element={<Mixer />} />
                <Route path="/mixer/waiting" element={<MixerWaiting />} />
                <Route path="/pay-as-me" element={<PayAsMePage />} />
                <Route path="/track" element={<TrackOrder />} />
                <Route path="/track-order" element={<Navigate to="/track" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

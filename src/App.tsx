import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Listings from "./pages/Listings";
import PropertyDetails from "./pages/PropertyDetails";
import Chat from "./pages/Chat";
import MarketInsights from "./pages/MarketInsights";
import NotFound from "./pages/NotFound";
import FloatingChatButton from "./components/FloatingChatButton";
import ChatDialog from "./components/ChatDialog";

const queryClient = new QueryClient();

const App = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/insights" element={<MarketInsights />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingChatButton onClick={() => setChatOpen(true)} />
          <ChatDialog open={chatOpen} onOpenChange={setChatOpen} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

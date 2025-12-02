import { useState, useRef, useEffect } from "react";
import { Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import PropertyCard from "./PropertyCard";

interface Message {
  role: "user" | "assistant";
  content: string;
  properties?: any[];
  timestamp: Date;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatDialog = ({ open, onOpenChange }: ChatDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.chat({
        message: input,
        session_id: "session_" + Date.now(),
        user_id: "user_" + Date.now(),
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.message,
        properties: response.properties,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "Find 2BHK flats in Pune under ₹60 lakh",
    "Show co-living spaces near IT parks",
    "Commercial properties for rent",
    "Luxury villas with swimming pool",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Real Estate Assistant
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Ask me anything about properties. I'm here to help you find your perfect place!
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6" ref={scrollRef}>
          <div className="space-y-4 py-4">
            {messages.length === 0 && (
              <div className="text-center space-y-4 py-8">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
                  <Send className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold">Start a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Try one of these suggestions:
                </p>
                <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.properties && message.properties.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      {message.properties.slice(0, 3).map((property) => (
                        <PropertyCard key={property.id || property.property_id} property={property} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about properties..."
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading} className="btn-primary">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { api, generateSessionId, Property } from "@/lib/api";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  properties?: Property[];
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Real Estate Assistant. I can help you find your dream property. Just tell me what you're looking for, for example: 'I want a 2BHK flat in Pune under ₹60 lakh with good connectivity.'",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
        session_id: sessionId,
        user_id: "user_demo",
        message: input,
        context: {
          previous_messages: messages.length,
        },
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.message,
        properties: response.properties,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Log any errors in metadata for debugging
      if (response.metadata?.error) {
        console.warn("Backend reported error in metadata:", response.metadata.error);
      }
    } catch (error) {
      console.error("Chat error:", error);
      
      // Extract error message
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to get response: ${errorMsg}`);
      
      const errorMessage: Message = {
        role: "assistant",
        content: `I apologize, but I'm having trouble connecting right now. Error: ${errorMsg}\n\nPlease try again or use the search feature to find properties.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "Show me 2BHK flats in Pune under ₹60 lakh",
    "I'm looking for a villa in Mumbai with a garden",
    "Find properties near metro stations in Bangalore",
    "What are the best investment properties right now?",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                <Bot className="h-7 w-7" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">AI Real Estate Assistant</h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Chat naturally to discover your perfect property
            </p>
          </div>

          {/* Chat Interface */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden" style={{ height: "calc(100vh - 300px)" }}>
            <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex space-x-3 max-w-3xl ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 ${message.role === "user" ? "bg-primary" : "bg-primary/10"} p-2 rounded-full h-10 w-10 flex items-center justify-center`}>
                        {message.role === "user" ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-primary" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 space-y-4">
                        <div className={`p-4 rounded-xl shadow-sm ${
                          message.role === "user"
                            ? "bg-primary text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        }`}>
                          <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>

                        {/* Properties */}
                        {message.properties && message.properties.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {message.properties.slice(0, 4).map((property) => (
                              <PropertyCard key={property.id || property.property_id} property={property} />
                            ))}
                          </div>
                        )}

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex space-x-3 max-w-3xl">
                      <div className="bg-primary/10 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 shadow-sm">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
              {messages.length === 1 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(question)}
                      className="text-xs hover:bg-primary hover:text-white border-gray-300 dark:border-gray-600"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message... e.g., 'Show me 2BHK flats in Pune'"
                  disabled={loading}
                  className="flex-1 h-12 text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
                <Button type="submit" disabled={loading || !input.trim()} size="lg" className="h-12 px-6 bg-primary text-white font-bold">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Chat;

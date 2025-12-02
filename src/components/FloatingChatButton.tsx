import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton = ({ onClick }: FloatingChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-white z-50 animate-float"
      aria-label="Open AI Chat"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
};

export default FloatingChatButton;

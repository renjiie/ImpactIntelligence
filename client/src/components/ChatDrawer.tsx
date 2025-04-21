import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, X, MessageSquare } from "lucide-react";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@shared/schema";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documentId?: number;
  isFullScreen?: boolean;
}

const ChatDrawer = ({ isOpen, onClose, documentId, isFullScreen = false }: ChatDrawerProps) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    messages,
    isLoading,
    sendMessage,
  } = useChatMessages(documentId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      await sendMessage(message);
      setMessage("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const drawerWidth = isFullScreen ? "w-full" : "w-0 lg:w-96";
  const mainWidth = isFullScreen ? "hidden" : "flex-grow";

  return (
    <div
      className={`${drawerWidth} bg-white border-l border-[var(--color-grey-200)] transition-all duration-300 ease-in-out flex flex-col z-10 elevation-2 overflow-hidden`}
    >
      <div className="flex justify-between items-center p-3 border-b border-[var(--color-grey-200)]">
        <div className="flex items-center">
          <MessageSquare className="text-[var(--color-primary-main)] mr-2 h-5 w-5" />
          <h2 className="font-medium">Document Assistant</h2>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-[var(--color-grey-100)] rounded-full lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {!messages.length && !isLoading && (
            <div className="chat-message bot">
              <p className="text-[var(--color-grey-800)]">
                Hi there! I'm your document assistant. Upload a PRD or BRD, and I'll analyze its impact on your existing knowledge base.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="chat-message bot">
              <p className="text-[var(--color-grey-800)]">Loading messages...</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`chat-message ${msg.role === "user" ? "user" : "bot"}`}
            >
              <p className="text-[var(--color-grey-800)]">{msg.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input p-3 border-t border-[var(--color-grey-200)]">
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            className="text-[var(--color-grey-600)] hover:bg-[var(--color-grey-100)] rounded-full"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            ref={inputRef}
            className="flex-grow border border-[var(--color-grey-300)] rounded-full px-4 py-2 focus:border-[var(--color-primary-main)]"
            placeholder="Ask a question about your document..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-[var(--color-primary-main)] hover:bg-blue-50 rounded-full ml-1"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatDrawer;

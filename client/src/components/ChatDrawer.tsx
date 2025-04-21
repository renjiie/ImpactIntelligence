import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, X, MessageSquare, Minimize, Maximize } from "lucide-react";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documentId?: number;
  isFullScreen?: boolean;
}

const ChatDrawer = ({ isOpen, onClose, documentId, isFullScreen = false }: ChatDrawerProps) => {
  const [message, setMessage] = useState("");
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
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

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  // If completely closed (not even minimized)
  if (!isOpen) {
    // Show a floating button to open the chat
    return (
      <Button
        variant="default"
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-30 bg-[var(--color-primary-main)]"
        onClick={onClose}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  // Calculate styles based on state
  const drawerClasses = minimized 
    ? "fixed bottom-0 right-4 w-72 h-12 shadow-lg rounded-t-lg"
    : isFullScreen
      ? "fixed inset-0 w-full h-full z-50"
      : isMobile
        ? "fixed bottom-0 right-0 left-0 h-1/2 shadow-lg z-40"
        : "fixed bottom-0 right-4 w-96 h-[500px] shadow-lg rounded-t-lg z-40";

  return (
    <div
      className={`${drawerClasses} bg-white border border-[var(--color-grey-200)] transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="flex justify-between items-center p-3 border-b border-[var(--color-grey-200)]">
        <div className="flex items-center">
          <MessageSquare className="text-[var(--color-primary-main)] mr-2 h-5 w-5" />
          <h2 className="font-medium">Document Assistant</h2>
        </div>
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-[var(--color-grey-100)] rounded-full"
            onClick={toggleMinimize}
          >
            {minimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-[var(--color-grey-100)] rounded-full ml-1"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="flex-grow p-4 overflow-y-auto">
            <div className="flex flex-col space-y-4">
              {!messages.length && !isLoading && (
                <div className="chat-message bot p-3 bg-[var(--color-grey-100)] rounded-lg">
                  <p className="text-[var(--color-grey-800)]">
                    Hi there! I'm your document assistant. Upload a PRD or BRD, and I'll analyze its impact on your existing knowledge base.
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="chat-message bot p-3 bg-[var(--color-grey-100)] rounded-lg">
                  <p className="text-[var(--color-grey-800)]">Loading messages...</p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`chat-message p-3 rounded-lg ${
                    msg.role === "user" 
                      ? "user bg-[var(--color-primary-light)] ml-8" 
                      : "bot bg-[var(--color-grey-100)] mr-8"
                  }`}
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
        </>
      )}
    </div>
  );
};

export default ChatDrawer;

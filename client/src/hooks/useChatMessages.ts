import { useState } from "react";
import { ChatMessage } from "@shared/schema";

export function useChatMessages(session_id: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate sending a message and getting an AI response
  const sendMessage = async (content: string) => {
    setIsSending(true);
    setError(null);
    try {
      // Add user message
      const userMsg: ChatMessage = {
        role: "user",
        content,
        createdAt: new Date().toISOString(),
        session_id,
      };
      setMessages((prev) => [...prev, userMsg]);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generate a mock AI response
      const aiResponse: ChatMessage = {
        role: "assistant",
        content: getAIResponse(content),
        createdAt: new Date().toISOString(),
        session_id,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (e: any) {
      setError("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // Simple mock AI response generator
  function getAIResponse(userMsg: string): string {
    const lower = userMsg.toLowerCase();
    if (lower.includes("hello") || lower.includes("hi")) {
      return "Hello! How can I assist you with your document today?";
    }
    if (lower.includes("impact")) {
      return "I can help analyze the impact of your document. Please upload or describe your document.";
    }
    if (lower.includes("thanks") || lower.includes("thank you")) {
      return "You're welcome! Let me know if you have more questions.";
    }
    return "I'm here to help! Please provide more details or ask a specific question.";
  }

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    isSending,
  };
}

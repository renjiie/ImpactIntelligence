import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { InsertChatMessage, ChatMessage } from "@shared/schema";

export function useChatMessages(documentId?: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const enabled = documentId !== undefined;
  
  const { data, isLoading, error } = useQuery({
    queryKey: documentId ? [`/api/documents/${documentId}/chat`] : [],
    enabled,
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      if (!documentId) {
        throw new Error("Document ID is required");
      }
      
      const messageData: Partial<InsertChatMessage> = {
        documentId,
        role: "user",
        content,
      };
      
      const response = await apiRequest("POST", `/api/documents/${documentId}/chat`, messageData);
      return response.json();
    },
    onSuccess: (newMessage) => {
      // Update messages in UI immediately
      setMessages((prev) => [...prev, newMessage]);
      
      // Simulate a short delay before getting the AI response
      setTimeout(async () => {
        try {
          const response = await apiRequest("GET", `/api/documents/${documentId}/chat/respond`);
          const aiResponse = await response.json();
          
          // Update messages again with AI response
          setMessages((prev) => [...prev, aiResponse]);
          
          // Invalidate the query to get the updated messages
          queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}/chat`] });
        } catch (error) {
          console.error("Error getting AI response:", error);
        }
      }, 500);
    },
  });

  const sendMessage = async (content: string) => {
    await mutation.mutateAsync(content);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    isSending: mutation.isPending,
  };
}

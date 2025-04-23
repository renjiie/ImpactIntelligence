import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useDocumentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadDocument = async (file: File): Promise<number> => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);
      formData.append("description", `Uploaded document: ${file.name}`);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to upload document");
      }

      const result = await response.json();

      toast({
        title: "Document uploaded successfully",
        description: "Your document is now being analyzed.",
        variant: "default",
      });

      return result.id;
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadDocument,
    isUploading,
  };
}

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, FileUp, Folder } from "lucide-react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";

interface DocumentUploadProps {
  onUploadComplete: (documentId: number) => void;
}

const DocumentUpload = ({ onUploadComplete }: DocumentUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument, isUploading } = useDocumentUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    try {
      const documentId = await uploadDocument(selectedFile);
      onUploadComplete(documentId);
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="bg-white elevation-2 p-4 max-w-2xl w-full text-center">
        <CardContent className="pt-6">
          <CloudUpload className="h-16 w-16 text-[var(--color-primary-main)] mx-auto mb-4" />
          <h2 className="text-2xl font-medium mb-2">Welcome to PRD Impact Analysis</h2>
          <p className="text-[var(--color-grey-600)] mb-6">
            Upload your PRD or BRD document to analyze its impact on your existing knowledge base
          </p>

          <div
            className="border-2 border-dashed border-[var(--color-grey-300)] rounded-lg p-8 mb-6 hover:border-[var(--color-primary-main)] transition cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
            />
            <div className="flex flex-col items-center">
              <CloudUpload className="h-10 w-10 text-[var(--color-grey-500)] mb-2" />
              <span className="text-[var(--color-grey-700)] font-medium">
                {selectedFile ? selectedFile.name : "Drag & drop files here or click to browse"}
              </span>
              <span className="text-[var(--color-grey-500)] text-sm mt-1">
                Supports PDF, DOCX, and TXT files
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="px-6 py-2 bg-[var(--color-primary-main)] text-white rounded-full elevation-1 hover:bg-[var(--color-primary-dark)] transition"
              onClick={handleSubmit}
              disabled={!selectedFile || isUploading}
            >
              <FileUp className="mr-1 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
            <Button
              variant="outline"
              className="px-6 py-2 bg-white text-[var(--color-primary-main)] border border-[var(--color-primary-main)] rounded-full hover:bg-blue-50 transition"
            >
              <Folder className="mr-1 h-4 w-4" />
              Browse Library
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;

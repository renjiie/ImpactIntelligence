import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export function useAnalysisState(documentId: number) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { data: document, isLoading: isDocumentLoading } = useQuery({
    queryKey: [`/api/documents/${documentId}`],
    enabled: !isNaN(documentId),
  });
  
  const { data: analysisResult, isLoading: isAnalysisLoading } = useQuery({
    queryKey: [`/api/documents/${documentId}/analysis`],
    enabled: !isNaN(documentId),
    refetchInterval: isAnalyzing ? 2000 : false, // Poll for analysis result when analyzing
  });

  useEffect(() => {
    // Set analyzing state based on the analysis result
    if (document && !analysisResult) {
      setIsAnalyzing(true);
    } else if (analysisResult) {
      setIsAnalyzing(false);
    }
  }, [document, analysisResult]);

  return {
    isLoading: isDocumentLoading || isAnalysisLoading,
    isAnalyzing,
  };
}

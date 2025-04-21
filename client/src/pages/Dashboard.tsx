import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ChatDrawer from "@/components/ChatDrawer";
import DocumentOverview from "@/components/DocumentOverview";
import AnalysisResults from "@/components/AnalysisResults";
import RelatedDocuments from "@/components/RelatedDocuments";
import TaskDialog from "@/components/TaskDialog";
import { useAnalysisState } from "@/hooks/useAnalysisState";
import { ImpactArea, DocumentResponse, AnalysisResponse, TaskResponse } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Document, AnalysisResult } from "@shared/schema";
import TaskQuickCreate from "@/components/TaskQuickCreate";

const Dashboard = () => {
  const params = useParams<{ id: string }>();
  const documentId = parseInt(params.id, 10);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedImpactArea, setSelectedImpactArea] = useState<ImpactArea | undefined>(undefined);
  const { isLoading, isAnalyzing } = useAnalysisState(documentId);

  const { data: document } = useQuery<any, any, Document>({
    queryKey: [`/api/documents/${documentId}`],
    enabled: !isNaN(documentId),
  });

  const { data: analysisResult } = useQuery<any, any, AnalysisResult>({
    queryKey: [`/api/documents/${documentId}/analysis`],
    enabled: !isNaN(documentId) && !isAnalyzing,
  });

  const { data: tasks = [] } = useQuery<any, any, TaskResponse[]>({
    queryKey: [`/api/documents/${documentId}/tasks`],
    enabled: !isNaN(documentId),
  });

  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };

  const handleCreateTask = (impactArea: ImpactArea) => {
    setSelectedImpactArea(impactArea);
    setIsTaskDialogOpen(true);
  };

  if (isLoading || isAnalyzing || !document || !analysisResult) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white rounded-lg elevation-2 p-8 max-w-md w-full text-center">
          <div className="inline-block w-16 h-16 mb-4">
            <Loader2 className="h-16 w-16 animate-spin text-[var(--color-primary-main)]" />
          </div>
          <h2 className="text-xl font-medium mb-2">
            {isAnalyzing ? "Analyzing Document" : "Loading Document"}
          </h2>
          <p className="text-[var(--color-grey-600)]">
            {isAnalyzing 
              ? "We're processing your document and identifying potential impacts..." 
              : "Loading document details..."}
          </p>
          <div className="mt-4 h-2 w-full bg-[var(--color-grey-200)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--color-primary-main)] rounded-full" 
              style={{ width: isAnalyzing ? "70%" : "100%" }}
            ></div>
          </div>
          <p className="text-sm text-[var(--color-grey-500)] mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  const impactAreas = Array.isArray(analysisResult.impactedAreas) 
    ? analysisResult.impactedAreas 
    : [];
  
  const relatedDocuments = Array.isArray(analysisResult.relatedDocuments) 
    ? analysisResult.relatedDocuments 
    : [];

  return (
    <>
      <div className="flex-grow p-4 overflow-auto">
        <DocumentOverview 
          document={document} 
          analysisResult={analysisResult} 
          tasksCount={tasks.length} 
        />
        
        <AnalysisResults 
          impactAreas={impactAreas}
          onCreateTask={handleCreateTask}  
        />
        
        <RelatedDocuments documents={relatedDocuments} />
      </div>

      <ChatDrawer
        isOpen={drawerOpen}
        onClose={toggleDrawer}
        documentId={documentId}
      />

      <TaskDialog
        open={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        documentId={documentId}
        impactArea={selectedImpactArea}
      />

      <TaskQuickCreate 
        documentId={documentId}
        impactAreas={impactAreas}
        onCreateTask={handleCreateTask}
      />
    </>
  );
};

export default Dashboard;

import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import DocumentOverview from "@/components/DocumentOverview";
import AnalysisResults from "@/components/AnalysisResults";
import RelatedDocuments from "@/components/RelatedDocuments";
import ChatDrawer from "@/components/ChatDrawer";
import TaskDialog from "@/components/TaskDialog";
import { useAnalysisState } from "@/hooks/useAnalysisState";
import { ImpactArea, TaskResponse } from "@/lib/types";
import { Loader2, AlertTriangle, BookOpen, CheckSquare } from "lucide-react";
import { Document, AnalysisResult } from "@shared/schema";
import TaskQuickCreate from "@/components/TaskQuickCreate";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Dashboard = () => {
  const params = useParams<{ id: string }>();
  const documentId = parseInt(params.id, 10);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedImpactArea, setSelectedImpactArea] = useState<ImpactArea | undefined>(undefined);
  const { isLoading, isAnalyzing } = useAnalysisState(documentId);
  const [activeTab, setActiveTab] = useState("impacts");

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
        
        <div className="bg-white rounded-lg elevation-1 p-4 mt-4">
          <Tabs 
            defaultValue="impacts" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full bg-[var(--color-grey-100)] p-1 rounded-lg">
              <TabsTrigger 
                value="impacts" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[var(--color-primary-main)]"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Impacts ({impactAreas.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="related" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[var(--color-primary-main)]"
              >
                <BookOpen className="h-4 w-4" />
                <span>Related Docs ({relatedDocuments.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tasks" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[var(--color-primary-main)]"
              >
                <CheckSquare className="h-4 w-4" />
                <span>Tasks ({tasks.length})</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="impacts" className="mt-4">
              <AnalysisResults 
                impactAreas={impactAreas}
                onCreateTask={handleCreateTask}  
              />
            </TabsContent>
            
            <TabsContent value="related" className="mt-4">
              <RelatedDocuments documents={relatedDocuments} />
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-4">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-medium">Tasks</h2>
                <button
                  className="px-4 py-2 bg-[var(--color-primary-main)] text-white rounded-full flex items-center gap-2 hover:bg-[var(--color-primary-dark)]"
                  onClick={() => {
                    if (impactAreas.length > 0) {
                      handleCreateTask(impactAreas[0]);
                    } else {
                      setIsTaskDialogOpen(true);
                    }
                  }}
                >
                  <CheckSquare className="h-4 w-4" />
                  Create New Task
                </button>
              </div>
              
              {tasks.length === 0 ? (
                <div className="bg-white rounded-lg border border-[var(--color-grey-200)] p-6 text-center">
                  <CheckSquare className="h-12 w-12 text-[var(--color-grey-400)] mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">No Tasks Yet</h3>
                  <p className="text-[var(--color-grey-600)] mb-4">
                    Create tasks based on the impact analysis to track follow-up actions.
                  </p>
                  <button
                    className="px-4 py-2 bg-[var(--color-primary-main)] text-white rounded-md inline-flex items-center gap-2"
                    onClick={() => {
                      if (impactAreas.length > 0) {
                        handleCreateTask(impactAreas[0]);
                      } else {
                        setIsTaskDialogOpen(true);
                      }
                    }}
                  >
                    <CheckSquare className="h-4 w-4" />
                    Create First Task
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-white rounded-lg border border-[var(--color-grey-200)] p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{task.title}</h3>
                          <p className="text-[var(--color-grey-600)] mt-1">{task.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center">
                              <span className="text-sm text-[var(--color-grey-500)]">Assignee:</span>
                              <span className="text-sm ml-1 text-[var(--color-grey-700)]">{task.assignee}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-[var(--color-grey-500)]">Due:</span>
                              <span className="text-sm ml-1 text-[var(--color-grey-700)]">{
                                new Date(task.dueDate).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })
                              }</span>
                            </div>
                            <div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {task.status === 'completed' ? 'Completed' :
                                 task.status === 'in-progress' ? 'In Progress' : 'Open'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
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
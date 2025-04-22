import { useState } from "react";
import DocumentOverview from "@/components/DocumentOverview";
import AnalysisResults from "@/components/AnalysisResults";
import RelatedDocuments from "@/components/RelatedDocuments";
import DocumentRelationshipGraph from "@/components/DocumentRelationshipGraph";
import { ImpactArea, TaskResponse } from "@/lib/types";
import { AlertTriangle, BookOpen, CheckSquare, Network } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { sampleImpactAreas, sampleRelatedDocuments, sampleAnalysisResponse } from "@/lib/sampleData";

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState("impacts");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedImpactArea, setSelectedImpactArea] = useState<ImpactArea | undefined>(undefined);

  // Sample document data - add missing required properties for the Document type
  const document = {
    id: 1,
    userId: 1,
    title: "User Profile Enhancements PRD",
    description: "Product Requirements Document for planned enhancements to the user profile system, including authentication updates and new dashboard features.",
    fileType: "text/plain",
    filePath: "/uploads/prd.txt",
    contentText: "Content of the PRD document...",
    uploadedAt: new Date("2024-04-22T10:00:00Z")
  };

  // Sample tasks
  const tasks: TaskResponse[] = [
    {
      id: 1,
      documentId: 1,
      title: "Review Authentication Service Impact",
      description: "Evaluate the proposed changes to password requirements and their impact on the existing OAuth implementation.",
      assignee: "sarah.johnson@example.com",
      dueDate: "2024-05-05",
      status: "in-progress",
      createdAt: "2024-04-22"
    },
    {
      id: 2,
      documentId: 1,
      title: "Plan API Updates for User Management",
      description: "Document required changes to User Management API endpoints to support new profile features.",
      assignee: "michael.chen@example.com",
      dueDate: "2024-05-10",
      status: "open",
      createdAt: "2024-04-22"
    }
  ];

  const handleCreateTask = (impactArea: ImpactArea) => {
    setSelectedImpactArea(impactArea);
    setIsTaskDialogOpen(true);
    // This is just a preview, so we don't actually open the dialog
    console.log("Would create task for:", impactArea.name);
  };

  return (
    <div className="flex-grow p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">PRD Impact Analysis Dashboard Preview</h1>
      
      <DocumentOverview 
        document={document} 
        analysisResult={sampleAnalysisResponse} 
        tasksCount={tasks.length} 
      />
      
      <div className="bg-white rounded-lg elevation-1 p-4 mt-4">
        <Tabs 
          defaultValue="impacts" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full bg-[var(--color-grey-100)] p-1 rounded-lg">
            <TabsTrigger 
              value="impacts" 
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[var(--color-primary-main)]"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Impacts ({sampleImpactAreas.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="related" 
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[var(--color-primary-main)]"
            >
              <BookOpen className="h-4 w-4" />
              <span>Related Docs ({sampleRelatedDocuments.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[var(--color-primary-main)]"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Tasks ({tasks.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="relationships" 
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[var(--color-primary-main)]"
            >
              <Network className="h-4 w-4" />
              <span>Relationships</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="impacts" className="mt-4">
            <AnalysisResults 
              impactAreas={sampleImpactAreas}
              onCreateTask={handleCreateTask}  
            />
          </TabsContent>
          
          <TabsContent value="related" className="mt-4">
            <RelatedDocuments documents={sampleRelatedDocuments} />
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-medium">Tasks</h2>
              <button
                className="px-4 py-2 bg-[var(--color-primary-main)] text-white rounded-full flex items-center gap-2 hover:bg-[var(--color-primary-dark)]"
                onClick={() => {
                  if (sampleImpactAreas.length > 0) {
                    handleCreateTask(sampleImpactAreas[0]);
                  }
                }}
              >
                <CheckSquare className="h-4 w-4" />
                Create New Task
              </button>
            </div>
            
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
          </TabsContent>
          
          <TabsContent value="relationships" className="mt-4">
            <DocumentRelationshipGraph 
              currentDocument={document}
              relatedDocuments={sampleRelatedDocuments}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating task creation button would appear here */}
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center text-gray-500">
        <p>This is a static preview showing the dashboard with sample data.</p>
      </div>
    </div>
  );
};

export default DashboardPreview;
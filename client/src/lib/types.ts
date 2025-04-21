// Additional types for frontend use

export interface ImpactArea {
  name: string;
  impactLevel: "High" | "Medium" | "Low";
  description: string;
  conflict?: string;
  recommendation?: string;
  contact: {
    name: string;
    title: string;
    email: string;
  };
}

export interface RelatedDocument {
  title: string;
  type: string;
  lastUpdated: string;
  tags: string[];
}

export interface AnalysisResponse {
  id: number;
  documentId: number;
  impactLevel: "High" | "Medium" | "Low";
  impactedAreas: ImpactArea[];
  relatedDocuments: RelatedDocument[];
  analysisDate: string;
}

export interface DocumentResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  fileType: string;
  uploadedAt: string;
}

export interface TaskResponse {
  id: number;
  documentId: number;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: "open" | "in-progress" | "completed";
  googleDriveTaskId?: string;
  createdAt: string;
}

export interface CreateTaskRequest {
  documentId: number;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
}

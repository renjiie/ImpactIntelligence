import { apiRequest } from "./queryClient";
import { DocumentResponse, AnalysisResponse, TaskResponse, CreateTaskRequest } from "./types";

export const documentApi = {
  getDocument: async (id: number): Promise<DocumentResponse> => {
    const response = await apiRequest("GET", `/api/documents/${id}`);
    return response.json();
  },
  
  getAnalysis: async (documentId: number): Promise<AnalysisResponse> => {
    const response = await apiRequest("GET", `/api/documents/${documentId}/analysis`);
    return response.json();
  },
  
  getTasks: async (documentId: number): Promise<TaskResponse[]> => {
    const response = await apiRequest("GET", `/api/documents/${documentId}/tasks`);
    return response.json();
  },
  
  createTask: async (task: CreateTaskRequest): Promise<TaskResponse> => {
    const response = await apiRequest("POST", "/api/tasks", task);
    return response.json();
  }
};

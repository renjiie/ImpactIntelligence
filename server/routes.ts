import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { upload } from "./multer-config";
import { analyzeDocument } from "./bedrock";
import { createGoogleDriveTask } from "./google-drive";
import { z } from "zod";
import { insertTaskSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload document
  app.post("/api/documents/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Mock user ID for demo purposes
      const userId = 1;
      
      const document = await storage.createDocument({
        userId,
        title: req.body.title || req.file.originalname,
        description: req.body.description || "",
        fileType: req.file.mimetype,
        filePath: req.file.path,
        contentText: req.body.content || "Document content would be extracted here", // In a real app, extract text from document
      });

      // Start analysis in background
      analyzeDocument(document.id).catch(err => {
        console.error("Error analyzing document:", err);
      });

      res.status(201).json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Error uploading document" });
    }
  });

  // Get document by ID
  app.get("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      const document = await storage.getDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      console.error("Error getting document:", error);
      res.status(500).json({ message: "Error getting document" });
    }
  });

  // Get analysis results for a document
  app.get("/api/documents/:id/analysis", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      const analysisResult = await storage.getDocumentAnalysisResult(documentId);
      
      if (!analysisResult) {
        // If analysis is not complete yet, create a placeholder analysis
        const mockAnalysis = {
          id: 0,
          documentId,
          impactLevel: "Medium",
          impactedAreas: [],
          relatedDocuments: [],
          analysisDate: new Date(),
        };
        return res.json(mockAnalysis);
      }
      
      res.json(analysisResult);
    } catch (error) {
      console.error("Error getting analysis results:", error);
      res.status(500).json({ message: "Error getting analysis results" });
    }
  });

  // Create a task for a document
  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      
      // Create task in Google Drive first
      const googleDriveTaskId = await createGoogleDriveTask({
        title: taskData.title,
        description: taskData.description || "",
        assignee: taskData.assignee || "",
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      });
      
      // Then save task in our system
      const task = await storage.createTask({
        ...taskData,
        googleDriveTaskId,
      });
      
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Error creating task" });
    }
  });

  // Get tasks for a document
  app.get("/api/documents/:id/tasks", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      const tasks = await storage.getDocumentTasks(documentId);
      res.json(tasks);
    } catch (error) {
      console.error("Error getting tasks:", error);
      res.status(500).json({ message: "Error getting tasks" });
    }
  });

  // Get chat messages for a document
  app.get("/api/documents/:id/chat", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      const messages = await storage.getDocumentChatMessages(documentId);
      res.json(messages);
    } catch (error) {
      console.error("Error getting chat messages:", error);
      res.status(500).json({ message: "Error getting chat messages" });
    }
  });

  // Add a new chat message
  app.post("/api/documents/:id/chat", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        documentId,
      });
      
      const message = await storage.createChatMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating chat message:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Error creating chat message" });
    }
  });

  // Get AI response to the latest message
  app.get("/api/documents/:id/chat/respond", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      
      // Get document and analysis for context
      const document = await storage.getDocument(documentId);
      const analysis = await storage.getDocumentAnalysisResult(documentId);
      
      // Get chat history
      const messages = await storage.getDocumentChatMessages(documentId);
      
      // Get the last user message to respond to
      const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
      
      if (!lastUserMessage || !document) {
        return res.status(400).json({ message: "No message to respond to or document not found" });
      }
      
      // Generate response - in a real app, send to Bedrock
      const responseContent = await generateAIResponse(lastUserMessage.content, document, analysis);
      
      // Save the AI response
      const message = await storage.createChatMessage({
        documentId,
        role: "assistant",
        content: responseContent,
      });
      
      res.json(message);
    } catch (error) {
      console.error("Error generating AI response:", error);
      res.status(500).json({ message: "Error generating AI response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate AI responses
async function generateAIResponse(userMessage: string, document: any, analysis: any): Promise<string> {
  // This would normally call AWS Bedrock
  // For demo, create context-aware responses
  
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("impact") || lowerMessage.includes("analysis")) {
    return `I've analyzed the impact of "${document.title}" against the knowledge base. The impact level is ${analysis?.impactLevel || 'Medium'} with ${analysis?.impactedAreas?.length || 0} potential conflicts identified. Would you like to explore specific areas of impact?`;
  } 
  
  if (lowerMessage.includes("conflict") || lowerMessage.includes("problem")) {
    return "The main conflicts identified are related to potential overlaps with existing systems. The most critical one involves integration points that could require significant refactoring. Would you like me to suggest some solutions to these conflicts?";
  }
  
  if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest") || lowerMessage.includes("solution")) {
    return "Based on my analysis, I recommend scheduling coordination meetings with the affected teams early in the development cycle. Additionally, consider creating interface contracts to clearly define integration points and ensure backward compatibility.";
  }
  
  if (lowerMessage.includes("who") || lowerMessage.includes("contact") || lowerMessage.includes("team")) {
    return "For the identified impact areas, you should contact: Jane Smith (Engineering Lead) for payment processing concerns, Michael Johnson (Product Owner) for user profile changes, and Sarah Lee (Analytics Lead) for analytics requirements.";
  }
  
  // Default response
  return "I'm analyzing your document to provide insights on its impact. Feel free to ask specific questions about potential conflicts, affected systems, or recommendations for implementation.";
}

import {
  users,
  type User,
  type InsertUser,
  documents,
  type Document,
  type InsertDocument,
  analysisResults,
  type AnalysisResult,
  type InsertAnalysisResult,
  tasks,
  type Task,
  type InsertTask,
  chatMessages,
  type ChatMessage,
  type InsertChatMessage,
  type ImpactArea,
  type RelatedDocument,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Document methods
  createDocument(document: InsertDocument): Promise<Document>;
  getDocument(id: number): Promise<Document | undefined>;
  getUserDocuments(userId: number): Promise<Document[]>;

  // Analysis results methods
  createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult>;
  getAnalysisResult(id: number): Promise<AnalysisResult | undefined>;
  getDocumentAnalysisResult(
    documentId: number
  ): Promise<AnalysisResult | undefined>;

  // Task methods
  createTask(task: InsertTask): Promise<Task>;
  getTask(id: number): Promise<Task | undefined>;
  getDocumentTasks(documentId: number): Promise<Task[]>;
  updateTask(
    id: number,
    taskUpdate: Partial<InsertTask>
  ): Promise<Task | undefined>;

  // Chat message methods
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getDocumentChatMessages(documentId: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documents: Map<number, Document>;
  private analysisResults: Map<number, AnalysisResult>;
  private tasks: Map<number, Task>;
  private chatMessages: Map<number, ChatMessage>;
  private currentIds: {
    user: number;
    document: number;
    analysisResult: number;
    task: number;
    chatMessage: number;
  };

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.analysisResults = new Map();
    this.tasks = new Map();
    this.chatMessages = new Map();
    this.currentIds = {
      user: 1,
      document: 1,
      analysisResult: 1,
      task: 1,
      chatMessage: 1,
    };
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Document methods
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentIds.document++;
    const now = new Date();
    const document: Document = {
      ...insertDocument,
      id,
      uploadedAt: now,
      description: insertDocument.description ?? null,
      contentText: insertDocument.contentText ?? null,
    };
    this.documents.set(id, document);
    return document;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getUserDocuments(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (document) => document.userId === userId
    );
  }

  // Analysis results methods
  async createAnalysisResult(
    insertResult: InsertAnalysisResult
  ): Promise<AnalysisResult> {
    const id = this.currentIds.analysisResult++;
    const now = new Date();
    const result: AnalysisResult = {
      ...insertResult,
      id,
      analysisDate: now,
    };
    this.analysisResults.set(id, result);
    return result;
  }

  async getAnalysisResult(id: number): Promise<AnalysisResult | undefined> {
    return this.analysisResults.get(id);
  }

  async getDocumentAnalysisResult(
    documentId: number
  ): Promise<AnalysisResult | undefined> {
    return Array.from(this.analysisResults.values()).find(
      (result) => result.documentId === documentId
    );
  }

  // Task methods
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentIds.task++;
    const now = new Date();
    const task: Task = {
      ...insertTask,
      id,
      status: "open",
      createdAt: now,
      description: insertTask.description ?? null,
      assignee: insertTask.assignee ?? null,
      dueDate: insertTask.dueDate ?? null,
      googleDriveTaskId: insertTask.googleDriveTaskId ?? null,
    };
    this.tasks.set(id, task);
    return task;
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getDocumentTasks(documentId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.documentId === documentId
    );
  }

  async updateTask(
    id: number,
    taskUpdate: Partial<InsertTask>
  ): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;

    const updatedTask: Task = {
      ...existingTask,
      ...taskUpdate,
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  // Chat message methods
  async createChatMessage(
    insertMessage: InsertChatMessage
  ): Promise<ChatMessage> {
    const id = this.currentIds.chatMessage++;
    const now = new Date();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: now,
      documentId: insertMessage.documentId ?? null,
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getDocumentChatMessages(documentId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((message) => message.documentId === documentId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

export const storage = new MemStorage();

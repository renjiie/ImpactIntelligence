import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User definition
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
});

// Document definition
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  fileType: text("file_type").notNull(), // PDF, DOCX, TXT
  filePath: text("file_path").notNull(),
  contentText: text("content_text"), // Extracted text from document
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

// Analysis results definition
export const analysisResults = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  impactLevel: text("impact_level").notNull(), // High, Medium, Low
  impactedAreas: jsonb("impacted_areas").notNull(), // Array of impacted areas with details
  relatedDocuments: jsonb("related_documents").notNull(), // Array of related documents from knowledge base
  analysisDate: timestamp("analysis_date").notNull().defaultNow(),
});

// Task definition
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  assignee: text("assignee"),
  dueDate: timestamp("due_date"),
  status: text("status").notNull().default("open"), // open, in-progress, completed
  googleDriveTaskId: text("google_drive_task_id"), // ID of task in Google Drive
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Chat message definition
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id"),
  role: text("role").notNull(), // "user" or "assistant"
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});
export const insertAnalysisResultSchema = createInsertSchema(analysisResults).omit({
  id: true,
  analysisDate: true,
});
export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  status: true,
  createdAt: true,
});
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Additional schemas for API responses
export const impactAreaSchema = z.object({
  name: z.string(),
  impactLevel: z.enum(["High", "Medium", "Low"]),
  description: z.string(),
  conflict: z.string().optional(),
  recommendation: z.string().optional(),
  contact: z.object({
    name: z.string(),
    title: z.string(),
    email: z.string().email(),
  }),
});

export const relatedDocumentSchema = z.object({
  title: z.string(),
  type: z.string(),
  lastUpdated: z.string(),
  tags: z.array(z.string()),
});

export type ImpactArea = z.infer<typeof impactAreaSchema>;
export type RelatedDocument = z.infer<typeof relatedDocumentSchema>;

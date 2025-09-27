import {
  users,
  cases,
  conversations,
  messages,
  savedQueries,
  alertSubscriptions,
  policyUpdates,
  documentEmbeddings,
  type User,
  type UpsertUser,
  type Case,
  type InsertCase,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type SavedQuery,
  type InsertSavedQuery,
  type AlertSubscription,
  type InsertAlertSubscription,
  type PolicyUpdate,
  type DocumentEmbedding,
  type InsertDocumentEmbedding,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Case operations
  getUserCases(userId: string): Promise<Case[]>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCase(id: string, updates: Partial<InsertCase>): Promise<Case>;
  deleteCase(id: string): Promise<void>;
  
  // Conversation operations
  getUserConversations(userId: string): Promise<Conversation[]>;
  createConversation(conversationData: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  
  // Message operations
  getConversationMessages(conversationId: string): Promise<Message[]>;
  createMessage(messageData: InsertMessage): Promise<Message>;
  
  // Saved query operations
  getUserSavedQueries(userId: string): Promise<SavedQuery[]>;
  createSavedQuery(queryData: InsertSavedQuery): Promise<SavedQuery>;
  deleteSavedQuery(id: string): Promise<void>;
  
  // Alert subscription operations
  getUserAlertSubscriptions(userId: string): Promise<AlertSubscription[]>;
  createAlertSubscription(subscriptionData: InsertAlertSubscription): Promise<AlertSubscription>;
  updateAlertSubscription(id: string, updates: Partial<InsertAlertSubscription>): Promise<AlertSubscription>;
  deleteAlertSubscription(id: string): Promise<void>;
  
  // Policy update operations
  getRecentPolicyUpdates(limit?: number): Promise<PolicyUpdate[]>;
  createPolicyUpdate(updateData: Omit<PolicyUpdate, 'id' | 'createdAt'>): Promise<PolicyUpdate>;
  
  // Document embedding operations for RAG
  getDocumentEmbeddings(query: string): Promise<DocumentEmbedding[]>;
  createDocumentEmbedding(embeddingData: InsertDocumentEmbedding): Promise<DocumentEmbedding>;
  searchSimilarDocuments(embedding: number[], limit?: number): Promise<DocumentEmbedding[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Case operations
  async getUserCases(userId: string): Promise<Case[]> {
    return db.select().from(cases).where(eq(cases.userId, userId)).orderBy(desc(cases.updatedAt));
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const [newCase] = await db.insert(cases).values(caseData).returning();
    return newCase;
  }

  async updateCase(id: string, updates: Partial<InsertCase>): Promise<Case> {
    const [updatedCase] = await db
      .update(cases)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(cases.id, id))
      .returning();
    return updatedCase;
  }

  async deleteCase(id: string): Promise<void> {
    await db.delete(cases).where(eq(cases.id, id));
  }

  // Conversation operations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    return db.select().from(conversations).where(eq(conversations.userId, userId)).orderBy(desc(conversations.updatedAt));
  }

  async createConversation(conversationData: InsertConversation): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values(conversationData).returning();
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  // Message operations
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(messageData).returning();
    return message;
  }

  // Saved query operations
  async getUserSavedQueries(userId: string): Promise<SavedQuery[]> {
    return db.select().from(savedQueries).where(eq(savedQueries.userId, userId)).orderBy(desc(savedQueries.createdAt));
  }

  async createSavedQuery(queryData: InsertSavedQuery): Promise<SavedQuery> {
    const [savedQuery] = await db.insert(savedQueries).values(queryData).returning();
    return savedQuery;
  }

  async deleteSavedQuery(id: string): Promise<void> {
    await db.delete(savedQueries).where(eq(savedQueries.id, id));
  }

  // Alert subscription operations
  async getUserAlertSubscriptions(userId: string): Promise<AlertSubscription[]> {
    return db.select().from(alertSubscriptions).where(eq(alertSubscriptions.userId, userId));
  }

  async createAlertSubscription(subscriptionData: InsertAlertSubscription): Promise<AlertSubscription> {
    const [subscription] = await db.insert(alertSubscriptions).values(subscriptionData).returning();
    return subscription;
  }

  async updateAlertSubscription(id: string, updates: Partial<InsertAlertSubscription>): Promise<AlertSubscription> {
    const [subscription] = await db
      .update(alertSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(alertSubscriptions.id, id))
      .returning();
    return subscription;
  }

  async deleteAlertSubscription(id: string): Promise<void> {
    await db.delete(alertSubscriptions).where(eq(alertSubscriptions.id, id));
  }

  // Policy update operations
  async getRecentPolicyUpdates(limit: number = 10): Promise<PolicyUpdate[]> {
    return db.select().from(policyUpdates).orderBy(desc(policyUpdates.publishedAt)).limit(limit);
  }

  async createPolicyUpdate(updateData: Omit<PolicyUpdate, 'id' | 'createdAt'>): Promise<PolicyUpdate> {
    const [update] = await db.insert(policyUpdates).values(updateData).returning();
    return update;
  }

  // Document embedding operations for RAG
  async getDocumentEmbeddings(query: string): Promise<DocumentEmbedding[]> {
    return db.select().from(documentEmbeddings).where(sql`content ILIKE ${'%' + query + '%'}`).limit(10);
  }

  async createDocumentEmbedding(embeddingData: InsertDocumentEmbedding): Promise<DocumentEmbedding> {
    const [embedding] = await db.insert(documentEmbeddings).values(embeddingData).returning();
    return embedding;
  }

  async searchSimilarDocuments(embedding: number[], limit: number = 5): Promise<DocumentEmbedding[]> {
    // This would typically use a vector similarity search
    // For now, we'll return recent documents as a placeholder
    return db.select().from(documentEmbeddings).orderBy(desc(documentEmbeddings.createdAt)).limit(limit);
  }
}

export const storage = new DatabaseStorage();

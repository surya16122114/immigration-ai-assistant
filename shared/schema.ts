import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Immigration cases tracking
export const cases = pgTable("cases", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  caseType: varchar("case_type").notNull(), // H-1B, OPT, Green Card, etc.
  receiptNumber: varchar("receipt_number"),
  status: varchar("status").notNull().default("pending"), // pending, in-progress, approved, denied
  progress: integer("progress").notNull().default(0), // 0-100
  expectedCompletion: timestamp("expected_completion"),
  title: varchar("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat conversations
export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: uuid("conversation_id").references(() => conversations.id).notNull(),
  role: varchar("role").notNull(), // user, assistant
  content: text("content").notNull(),
  sources: jsonb("sources"), // Array of source citations
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved queries
export const savedQueries = pgTable("saved_queries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  query: text("query").notNull(),
  response: text("response"),
  tags: jsonb("tags"), // Array of tags
  createdAt: timestamp("created_at").defaultNow(),
});

// Alert subscriptions
export const alertSubscriptions = pgTable("alert_subscriptions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  alertType: varchar("alert_type").notNull(), // visa_bulletin, h1b_lottery, policy_changes
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Policy updates
export const policyUpdates = pgTable("policy_updates", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content"),
  source: varchar("source").notNull(), // USCIS, DOS, etc.
  sourceUrl: varchar("source_url"),
  category: varchar("category").notNull(), // h1b, opt, green_card, etc.
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Immigration document embeddings for RAG
export const documentEmbeddings = pgTable("document_embeddings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").notNull(),
  content: text("content").notNull(),
  embedding: jsonb("embedding").notNull(), // Vector embedding
  metadata: jsonb("metadata"), // Document metadata
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema exports for frontend/backend
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertCase = typeof cases.$inferInsert;
export type Case = typeof cases.$inferSelect;

export type InsertConversation = typeof conversations.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;

export type InsertMessage = typeof messages.$inferInsert;
export type Message = typeof messages.$inferSelect;

export type InsertSavedQuery = typeof savedQueries.$inferInsert;
export type SavedQuery = typeof savedQueries.$inferSelect;

export type InsertAlertSubscription = typeof alertSubscriptions.$inferInsert;
export type AlertSubscription = typeof alertSubscriptions.$inferSelect;

export type InsertPolicyUpdate = typeof policyUpdates.$inferInsert;
export type PolicyUpdate = typeof policyUpdates.$inferSelect;

export type InsertDocumentEmbedding = typeof documentEmbeddings.$inferInsert;
export type DocumentEmbedding = typeof documentEmbeddings.$inferSelect;

// Zod schemas for validation
export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertSavedQuerySchema = createInsertSchema(savedQueries).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSubscriptionSchema = createInsertSchema(alertSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

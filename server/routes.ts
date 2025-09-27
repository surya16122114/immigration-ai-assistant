import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertCaseSchema, 
  insertMessageSchema, 
  insertSavedQuerySchema, 
  insertAlertSubscriptionSchema 
} from "@shared/schema";
import { openaiService } from "./services/openai";
import { sendgridService } from "./services/sendgrid";
import { ragPipeline } from "./services/ragPipeline";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Case management routes
  app.get('/api/cases', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cases = await storage.getUserCases(userId);
      res.json(cases);
    } catch (error) {
      console.error("Error fetching cases:", error);
      res.status(500).json({ message: "Failed to fetch cases" });
    }
  });

  app.post('/api/cases', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCaseSchema.parse({ ...req.body, userId });
      const newCase = await storage.createCase(validatedData);
      res.json(newCase);
    } catch (error) {
      console.error("Error creating case:", error);
      res.status(500).json({ message: "Failed to create case" });
    }
  });

  app.put('/api/cases/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedCase = await storage.updateCase(id, updates);
      res.json(updatedCase);
    } catch (error) {
      console.error("Error updating case:", error);
      res.status(500).json({ message: "Failed to update case" });
    }
  });

  app.delete('/api/cases/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCase(id);
      res.json({ message: "Case deleted successfully" });
    } catch (error) {
      console.error("Error deleting case:", error);
      res.status(500).json({ message: "Failed to delete case" });
    }
  });

  // Chat and conversation routes
  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.post('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { title } = req.body;
      const conversation = await storage.createConversation({ userId, title });
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.get('/api/conversations/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getConversationMessages(id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // AI Chat endpoint with RAG
  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const { message, conversationId } = req.body;
      const userId = req.user.claims.sub;

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId,
        role: 'user',
        content: message,
      });

      // Get relevant documents using RAG
      const relevantDocs = await ragPipeline.searchRelevantDocuments(message);
      
      // Generate AI response with context
      const aiResponse = await openaiService.generateImmigrationResponse(message, relevantDocs);
      
      // Save AI response
      const assistantMessage = await storage.createMessage({
        conversationId,
        role: 'assistant',
        content: aiResponse.content,
        sources: aiResponse.sources,
      });

      res.json({
        userMessage,
        assistantMessage,
        sources: aiResponse.sources,
      });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Saved queries routes
  app.get('/api/saved-queries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedQueries = await storage.getUserSavedQueries(userId);
      res.json(savedQueries);
    } catch (error) {
      console.error("Error fetching saved queries:", error);
      res.status(500).json({ message: "Failed to fetch saved queries" });
    }
  });

  app.post('/api/saved-queries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertSavedQuerySchema.parse({ ...req.body, userId });
      const savedQuery = await storage.createSavedQuery(validatedData);
      res.json(savedQuery);
    } catch (error) {
      console.error("Error saving query:", error);
      res.status(500).json({ message: "Failed to save query" });
    }
  });

  app.delete('/api/saved-queries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSavedQuery(id);
      res.json({ message: "Query deleted successfully" });
    } catch (error) {
      console.error("Error deleting query:", error);
      res.status(500).json({ message: "Failed to delete query" });
    }
  });

  // Alert subscription routes
  app.get('/api/alert-subscriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscriptions = await storage.getUserAlertSubscriptions(userId);
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching alert subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch alert subscriptions" });
    }
  });

  app.post('/api/alert-subscriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertAlertSubscriptionSchema.parse({ ...req.body, userId });
      const subscription = await storage.createAlertSubscription(validatedData);
      res.json(subscription);
    } catch (error) {
      console.error("Error creating alert subscription:", error);
      res.status(500).json({ message: "Failed to create alert subscription" });
    }
  });

  app.put('/api/alert-subscriptions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const subscription = await storage.updateAlertSubscription(id, updates);
      res.json(subscription);
    } catch (error) {
      console.error("Error updating alert subscription:", error);
      res.status(500).json({ message: "Failed to update alert subscription" });
    }
  });

  app.delete('/api/alert-subscriptions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAlertSubscription(id);
      res.json({ message: "Alert subscription deleted successfully" });
    } catch (error) {
      console.error("Error deleting alert subscription:", error);
      res.status(500).json({ message: "Failed to delete alert subscription" });
    }
  });

  // Policy updates routes
  app.get('/api/policy-updates', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const updates = await storage.getRecentPolicyUpdates(limit);
      res.json(updates);
    } catch (error) {
      console.error("Error fetching policy updates:", error);
      res.status(500).json({ message: "Failed to fetch policy updates" });
    }
  });

  // Send email alert
  app.post('/api/send-alert', isAuthenticated, async (req: any, res) => {
    try {
      const { email, subject, content, type } = req.body;
      const success = await sendgridService.sendAlert(email, subject, content, type);
      
      if (success) {
        res.json({ message: "Alert sent successfully" });
      } else {
        res.status(500).json({ message: "Failed to send alert" });
      }
    } catch (error) {
      console.error("Error sending alert:", error);
      res.status(500).json({ message: "Failed to send alert" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

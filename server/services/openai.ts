import OpenAI from "openai";

// Using GPT-4o-mini for optimal speed and cost efficiency while maintaining quality
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

// Simple in-memory cache for common queries (improves response time for repeated questions)
const queryCache = new Map<string, { response: ImmigrationResponse; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

interface ImmigrationResponse {
  content: string;
  sources: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}

interface DocumentContext {
  content: string;
  source: string;
  url?: string;
}

class OpenAIService {
  async generateImmigrationResponse(query: string, context: DocumentContext[]): Promise<ImmigrationResponse> {
    try {
      // Check cache first (significant speedup for repeated questions)
      const cacheKey = `${query}:${context.map(c => c.content.substring(0, 50)).join(',')}`;
      const cached = queryCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('Cache hit for query:', query.substring(0, 50));
        return cached.response;
      }

      const systemPrompt = `You are an expert Immigration AI Assistant that provides accurate, up-to-date information on U.S. immigration laws, visa categories, work permits, green cards, citizenship, and policy updates.

CRITICAL INSTRUCTIONS:
- Always cite official government sources (USCIS, Department of State, CBP, consulates)
- Distinguish between general informational guidance vs. legal advice
- Include disclaimer: "I am not a lawyer. This is not legal advice."
- Provide step-by-step instructions when appropriate
- If unsure, recommend consulting a qualified immigration attorney
- Use the provided document context to inform your response
- Always respond in JSON format with 'content' and 'sources' fields

Document Context:
${context.map(doc => `Source: ${doc.source}\nContent: ${doc.content}\n---`).join('\n')}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please answer this immigration question: ${query}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Extract sources from context
      const sources = context.map(doc => ({
        title: doc.source,
        url: doc.url || '',
        excerpt: doc.content.substring(0, 150) + '...'
      }));

      const aiResponse = {
        content: result.content || "I apologize, but I couldn't generate a proper response. Please try rephrasing your question.",
        sources: sources
      };

      // Cache the response
      queryCache.set(cacheKey, { response: aiResponse, timestamp: Date.now() });
      
      // Clean old cache entries (keep cache size manageable)
      if (queryCache.size > 100) {
        const oldestKey = queryCache.keys().next().value;
        queryCache.delete(oldestKey);
      }

      return aiResponse;
    } catch (error) {
      console.error("OpenAI service error:", error);
      throw new Error("Failed to generate AI response");
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw new Error("Failed to generate embedding");
    }
  }

  async summarizeDocument(content: string, documentType: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert at summarizing immigration documents. Create a concise summary of the following ${documentType} document, focusing on key requirements, deadlines, and important information for immigration applicants.`
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.5,
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("Error summarizing document:", error);
      throw new Error("Failed to summarize document");
    }
  }
}

export const openaiService = new OpenAIService();

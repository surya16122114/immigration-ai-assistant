import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

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
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please answer this immigration question: ${query}` }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Extract sources from context
      const sources = context.map(doc => ({
        title: doc.source,
        url: doc.url || '',
        excerpt: doc.content.substring(0, 150) + '...'
      }));

      return {
        content: result.content || "I apologize, but I couldn't generate a proper response. Please try rephrasing your question.",
        sources: sources
      };
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
        model: "gpt-5",
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
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("Error summarizing document:", error);
      throw new Error("Failed to summarize document");
    }
  }
}

export const openaiService = new OpenAIService();

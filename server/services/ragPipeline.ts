import { storage } from "../storage";
import { openaiService } from "./openai";
import type { DocumentEmbedding } from "@shared/schema";

interface DocumentContext {
  content: string;
  source: string;
  url?: string;
}

class RAGPipeline {
  async searchRelevantDocuments(query: string, limit: number = 3): Promise<DocumentContext[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await openaiService.generateEmbedding(query);
      
      // Search for similar documents using vector similarity
      const similarDocs = await storage.searchSimilarDocuments(queryEmbedding, limit);
      
      // If no documents found, try text-based search as fallback
      if (similarDocs.length === 0) {
        const textSearchDocs = await storage.getDocumentEmbeddings(query);
        return this.formatDocumentsForContext(textSearchDocs.slice(0, limit));
      }
      
      return this.formatDocumentsForContext(similarDocs);
    } catch (error) {
      console.error("Error searching relevant documents:", error);
      
      // Fallback to basic text search
      const fallbackDocs = await storage.getDocumentEmbeddings(query);
      return this.formatDocumentsForContext(fallbackDocs.slice(0, limit));
    }
  }

  private formatDocumentsForContext(documents: DocumentEmbedding[]): DocumentContext[] {
    return documents.map(doc => ({
      content: doc.content,
      source: doc.metadata?.source || 'USCIS',
      url: doc.metadata?.url
    }));
  }

  async processAndStoreDocument(
    content: string, 
    documentId: string, 
    metadata: any
  ): Promise<void> {
    try {
      // Split document into chunks for better retrieval
      const chunks = this.chunkDocument(content);
      
      for (const chunk of chunks) {
        // Generate embedding for each chunk
        const embedding = await openaiService.generateEmbedding(chunk);
        
        // Store chunk with embedding
        await storage.createDocumentEmbedding({
          documentId: `${documentId}_${chunks.indexOf(chunk)}`,
          content: chunk,
          embedding: embedding,
          metadata: metadata
        });
      }
    } catch (error) {
      console.error("Error processing document:", error);
      throw new Error("Failed to process and store document");
    }
  }

  private chunkDocument(content: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;
    
    while (start < content.length) {
      const end = Math.min(start + chunkSize, content.length);
      let chunk = content.slice(start, end);
      
      // Try to end at a sentence boundary
      if (end < content.length) {
        const lastPeriod = chunk.lastIndexOf('.');
        const lastNewline = chunk.lastIndexOf('\n');
        const lastSpace = chunk.lastIndexOf(' ');
        
        const boundary = Math.max(lastPeriod, lastNewline, lastSpace);
        if (boundary > start + chunkSize * 0.7) {
          chunk = content.slice(start, boundary + 1);
        }
      }
      
      chunks.push(chunk.trim());
      start = start + chunkSize - overlap;
      
      if (start >= content.length) break;
    }
    
    return chunks.filter(chunk => chunk.length > 50); // Filter out very small chunks
  }

  async initializeKnowledgeBase(): Promise<void> {
    // Sample immigration documents to seed the knowledge base
    const immigrationDocuments = [
      {
        id: 'uscis_h1b_guide',
        title: 'H-1B Specialty Occupations Guide',
        content: `
          H-1B Classification Overview:
          The H-1B program allows companies to temporarily employ foreign workers in occupations that require highly specialized knowledge and a bachelor's degree or higher in the specific specialty, or its equivalent.
          
          Key Requirements:
          - The position must qualify as a specialty occupation
          - The foreign worker must hold a U.S. bachelor's degree or higher, or its foreign equivalent
          - The petitioner must file Form I-129 with required documentation
          - The position must pay the prevailing wage or the actual wage paid to similarly employed workers
          
          Annual Cap:
          The H-1B program has an annual numerical limit (cap) of 65,000 visas each fiscal year, with an additional 20,000 visas available for individuals who have earned a U.S. master's degree or higher.
          
          Application Process:
          1. Employer files Labor Condition Application (LCA) with DOL
          2. Employer files Form I-129 petition with USCIS
          3. If approved and subject to cap, worker applies for visa at consulate or files for change of status
          
          Duration:
          Initial period up to 3 years, may be extended for additional 3 years (total maximum of 6 years).
        `,
        metadata: {
          source: 'USCIS',
          url: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations',
          category: 'h1b',
          lastUpdated: '2024-01-15'
        }
      },
      {
        id: 'uscis_opt_guide',
        title: 'Optional Practical Training (OPT) Guide',
        content: `
          Optional Practical Training (OPT) Overview:
          OPT is temporary employment that is directly related to an F-1 student's major area of study. Students can apply for OPT to work in the United States for up to 12 months after graduation.
          
          Types of OPT:
          - Pre-completion OPT: Work while still enrolled in studies
          - Post-completion OPT: Work after completing studies
          - STEM OPT Extension: Additional 24 months for STEM graduates
          
          Eligibility Requirements:
          - Must be in valid F-1 status
          - Must have been enrolled full-time for at least one academic year
          - Must not have used 12 months of post-completion OPT previously
          - Employment must be directly related to major area of study
          
          Application Process:
          1. Receive recommendation from Designated School Official (DSO)
          2. File Form I-765 with USCIS
          3. Pay required fees
          4. Wait for Employment Authorization Document (EAD)
          
          STEM Extension:
          Students with degrees in Science, Technology, Engineering, and Mathematics fields may apply for a 24-month extension of their post-completion OPT.
          
          Important Deadlines:
          - Apply no earlier than 90 days before program completion
          - Apply no later than 60 days after program completion
          - Must begin employment within 90 days of EAD start date
        `,
        metadata: {
          source: 'USCIS',
          url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students',
          category: 'opt',
          lastUpdated: '2024-02-01'
        }
      },
      {
        id: 'dos_green_card_process',
        title: 'Green Card Application Process',
        content: `
          Permanent Residence (Green Card) Overview:
          A green card gives you official immigration status in the United States, allowing you to live and work permanently in the country.
          
          Ways to Get a Green Card:
          - Through Family (immediate relatives, family preference categories)
          - Through Employment (EB-1, EB-2, EB-3, EB-4, EB-5 categories)
          - Through Investment (EB-5 Immigrant Investor Program)
          - Through Special Programs (Diversity Visa, Special Immigrant categories)
          
          Employment-Based Categories:
          - EB-1: Priority workers (extraordinary ability, outstanding professors/researchers, multinational executives)
          - EB-2: Advanced degree professionals or exceptional ability workers
          - EB-3: Skilled workers, professionals, other workers
          - EB-4: Special immigrants
          - EB-5: Immigrant investors
          
          Process Steps:
          1. Labor Certification (PERM) - if required for category
          2. File Form I-140 (Immigrant Petition for Alien Worker)
          3. Wait for priority date to become current (if applicable)
          4. Apply for adjustment of status (Form I-485) or consular processing
          
          Priority Dates:
          Most employment-based categories have annual limits, creating waiting periods for applicants from certain countries, particularly India and China.
          
          Adjustment of Status vs. Consular Processing:
          - Adjustment of Status: Apply while in the U.S.
          - Consular Processing: Apply at U.S. consulate in home country
        `,
        metadata: {
          source: 'Department of State',
          url: 'https://travel.state.gov/content/travel/en/us-visas/immigrate.html',
          category: 'green_card',
          lastUpdated: '2024-01-30'
        }
      }
    ];

    // Process and store each document
    for (const doc of immigrationDocuments) {
      try {
        await this.processAndStoreDocument(doc.content, doc.id, doc.metadata);
        console.log(`Processed document: ${doc.title}`);
      } catch (error) {
        console.error(`Failed to process document ${doc.title}:`, error);
      }
    }
  }
}

export const ragPipeline = new RAGPipeline();

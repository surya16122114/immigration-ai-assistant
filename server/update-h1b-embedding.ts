import { openaiService } from "./services/openai";
import { db } from "./db";
import { documentEmbeddings } from "../shared/schema";
import { eq } from "drizzle-orm";

async function updateH1BEmbedding() {
  const content = `H-1B Fee Update September 2025 - Trump Administration Announcement:
  
The Trump administration announced a new $100,000 fee for H-1B visa petitions on September 19, 2025, effective September 21, 2025.

Key Details:
- Fee Amount: $100,000 per petition (one-time, not annual)
- Effective Date: September 21, 2025
- Applies to: New H-1B petitions for foreign nationals outside the U.S.
- Does NOT apply to: Current visa holders, renewals/extensions, petitions filed before Sept 21, 2025

Previous vs New Costs:
- Previous fee range: $1,700 - $5,000
- New total cost: ~$100,000+ (20-50x increase)

The $100,000 is in ADDITION to existing processing and vetting costs.

Most Affected Employers:
- Amazon (10,000+ approvals)
- Microsoft (5,000+ approvals)
- Meta (5,000+ approvals)
- Tata Consulting (5,000+ approvals)
- Apple (4,000+ approvals)
- Google (4,000+ approvals)

Countries Most Affected:
- India: 71% of H-1B beneficiaries
- China: 11.7% of beneficiaries

Administration Rationale:
- Discourage spam applications
- Protect American workers wages
- Ensure only truly extraordinary talent receives H-1Bs
- Prevent companies from replacing US workers with cheaper foreign labor

Status: Faces legal challenges regarding Congressional authorization for such high fees.`;

  console.log("Generating embedding for H-1B fee update...");
  const embedding = await openaiService.generateEmbedding(content);
  
  console.log("Updating database with embedding...");
  await db.update(documentEmbeddings)
    .set({ embedding: JSON.stringify(embedding) })
    .where(eq(documentEmbeddings.documentId, 'trump_h1b_fee_2025'));
  
  console.log("✅ H-1B fee update embedding added successfully!");
  process.exit(0);
}

updateH1BEmbedding().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});

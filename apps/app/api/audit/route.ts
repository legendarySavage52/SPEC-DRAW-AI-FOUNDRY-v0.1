import { NextResponse } from "next/server";
import { runRepositoryAudit } from "../../../agents/repository-audit";

export async function POST() {
  try {
    // Replace these strings with your target configuration
    // Ideally, these would eventually be pulled from process.env or a UI input
    const OWNER = "legendarySavage52"; 
    const REPO = "SPEC-DRAW-AI-FOUNDRY-v0.1"; 

    if (!process.env.OPENAI_API_KEY || !process.env.GITHUB_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Missing required server-side environment variables configuration." },
        { status: 500 }
      );
    }

    // Fire off Agent 001 to crawl the repo and run the LLM analysis
    const auditResult = await runRepositoryAudit(OWNER, REPO);

    // Return the response back to your Foundry Dashboard UI
    return NextResponse.json(auditResult);
  } catch (error: any) {
    console.error("Agent 001 Execution Failure:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while running the repository audit." },
      { status: 500 }
    );
  }
}

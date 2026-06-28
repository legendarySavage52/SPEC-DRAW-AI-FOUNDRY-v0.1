import { OpenAI } from "openai";
import { FileTreeItem } from "./github";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateArchitectureAnalysis(fileTree: FileTreeItem[], packageJsonContext: string) {
  const structureSummary = fileTree
    .filter(f => f.type === 'blob' && !f.path.includes('node_modules') && !f.path.includes('.next'))
    .map(f => f.path)
    .join('\n');

  const systemPrompt = `You are the Lead Principal AI Architect for Spec-Draw. 
Your job is to analyze the provided file structure and package configurations to output a deep technical assessment. 
Be critical, call out technical debt, missing architecture boundaries, and gaps based on a standard production SaaS stack.`;

  const userPrompt = `
Here is the current repository file map:
${structureSummary}

Here is the root/app dependency context:
${packageJsonContext}

Generate an analysis containing:
1. Feature Matrix Status (What is fully built vs missing vs partial)
2. Database / API Schema inferences
3. Immediate Technical Debt (Dead files, structure flaws)
4. Recommended Roadmap items.
Return the output cleanly formatted in markdown.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.2,
  });

  return response.choices[0].message.content;
}

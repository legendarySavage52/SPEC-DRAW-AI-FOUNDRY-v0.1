import { fetchRepositoryTree, fetchFileContent } from "./github";
import { generateArchitectureAnalysis } from "./analyzer";

export async function runRepositoryAudit(owner: string, repo: string) {
  console.log(`🚀 Agent 001 initiating audit on ${owner}/${repo}...`);
  
  // 1. Scan Structure
  const tree = await fetchRepositoryTree(owner, repo);
  
  // 2. Extract Key Context files
  let rootPackageJson = "";
  if (tree.some(f => f.path === "package.json")) {
    rootPackageJson = await fetchFileContent(owner, repo, "package.json");
  }

  // 3. Run LLM Engine Analysis
  const analysisMarkdown = await generateArchitectureAnalysis(tree, rootPackageJson);

  return {
    timestamp: new Date().toISOString(),
    totalFilesScanned: tree.length,
    report: analysisMarkdown
  };
}

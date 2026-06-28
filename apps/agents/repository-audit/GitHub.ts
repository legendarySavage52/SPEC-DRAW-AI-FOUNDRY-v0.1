import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

export interface FileTreeItem {
  path: string;
  type: 'tree' | 'blob';
  content?: string;
}

export async function fetchRepositoryTree(owner: string, repo: string, branch = "main"): Promise<FileTreeItem[]> {
  // Get the latest commit SHA for the branch
  const { data: refData } = await octokit.git.getRef({ owner, repo, ref: `heads/${branch}` });
  const commitSha = refData.object.sha;

  // Fetch the entire tree recursively
  const { data: treeData } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: commitSha,
    recursive: "true",
  });

  return treeData.tree.map(item => ({
    path: item.path || '',
    type: item.type as 'tree' | 'blob'
  }));
}

export async function fetchFileContent(owner: string, repo: string, path: string): Promise<string> {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    if ('content' in data && !Array.isArray(data)) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    return '';
  } catch (error) {
    console.error(`Failed to fetch content for ${path}:`, error);
    return '';
  }
}

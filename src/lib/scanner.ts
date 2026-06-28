// src/lib/scanner.ts
/**
 * scanRepository: lightweight starter scanner.
 * - Recursively walks directories (skips node_modules and .git)
 * - Reads package.json if present
 * - Collects basic file metadata
 *
 * This is a conservative, safe stub intended for MVP usage and tests.
 */

import { readdir, stat, readFile } from 'fs/promises';
import path from 'path';
import { ScanResult, ScannedFile } from '../types/index';

const DEFAULT_EXCLUDES = ['node_modules', '.git'];

/**
 * Recursively walk a directory and return all file paths (relative)
 */
async function walk(dir: string, root: string, out: ScannedFile[]): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (DEFAULT_EXCLUDES.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full) || entry.name;
    if (entry.isDirectory()) {
      await walk(full, root, out);
    } else if (entry.isFile()) {
      try {
        const s = await stat(full);
        const ext = path.extname(entry.name).toLowerCase();
        // Naive import extraction left empty for now; robust parsing belongs in later iteration
        const file: ScannedFile = {
          path: rel.split(path.sep).join('/'),
          ext,
          size: s.size,
          imports: [],
        };
        out.push(file);
      } catch (e) {
        // ignore file read/stat errors per conservative scanning policy
      }
    }
  }
}

/**
 * Scan a repository directory and return a typed ScanResult.
 */
export async function scanRepository(rootPath: string): Promise<ScanResult> {
  const absRoot = path.resolve(rootPath);
  const files: ScannedFile[] = [];
  try {
    await walk(absRoot, absRoot, files);
  } catch (e) {
    // swallow errors but include partial results
  }

  // Attempt to read package.json if present
  let pkg: Record<string, unknown> | undefined;
  try {
    const pkgPath = path.join(absRoot, 'package.json');
    const content = await readFile(pkgPath, 'utf-8');
    pkg = JSON.parse(content) as Record<string, unknown>;
  } catch (e) {
    // no package.json is fine
  }

  return {
    root: absRoot,
    files,
    packageJson: pkg,
  };
}

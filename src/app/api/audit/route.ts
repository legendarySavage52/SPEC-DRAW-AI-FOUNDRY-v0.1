// src/app/api/audit/route.ts
/**
 * Simple Next.js App Router POST handler for kicking off an audit.
 * Expects a JSON body: { rootPath?: string }
 * Returns: { reportId }
 */

import { NextResponse } from 'next/server';
import type { Request } from 'next/server';
import { scanRepository } from '../../..//lib/scanner';
import { buildAuditReport } from '../../..//lib/report-builder';
import { saveReport } from '../../..//lib/report-store';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rootPath = typeof body.rootPath === 'string' ? body.rootPath : '.';
    const scan = await scanRepository(rootPath);
    // feature detection is a future step; pass undefined for now
    const report = buildAuditReport(scan);
    saveReport(report);
    return NextResponse.json({ reportId: report.id });
  } catch (err) {
    return NextResponse.json({ error: 'failed to run audit' }, { status: 500 });
  }
}

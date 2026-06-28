// src/lib/report-store.ts
/**
 * Very small in-memory report store for MVP. Exposes get / save operations.
 * This is intentionally simple; replace with filesystem or DB backing in later iterations.
 */

import { AuditReport } from '../types/index';

const store = new Map<string, AuditReport>();

export function saveReport(report: AuditReport): void {
  store.set(report.id, report);
}

export function getReport(id: string): AuditReport | undefined {
  return store.get(id);
}

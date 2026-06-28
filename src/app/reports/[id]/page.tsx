// src/app/reports/[id]/page.tsx
import React from 'react';
import { getReport } from '../../../lib/report-store';

type Props = { params: { id: string } };

export default function ReportPage({ params }: Props) {
  const report = getReport(params.id);
  if (!report) {
    return (
      <div>
        <h1>Report not found</h1>
        <p>No report with id {params.id} was found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Audit Report: {report.id}</h1>
      <p>Created: {report.createdAt}</p>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{report.summary}</pre>
    </div>
  );
}

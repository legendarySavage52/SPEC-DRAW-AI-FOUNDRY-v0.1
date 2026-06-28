"use client";

import React, { useState } from 'react';
import { Shield, Database, RefreshCw, Layers, FileText, Code } from 'lucide-react';

export default function FoundryDashboard() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [stats, setStats] = useState<{ files: number; time: string } | null>(null);

  const triggerAudit = async () => {
    setLoading(true);
    try {
      // Direct call to an API route handling the agent runner
      const res = await fetch('/api/audit', { method: 'POST' });
      const data = await res.json();
      setReport(data.report);
      setStats({ files: data.totalFilesScanned, time: data.timestamp });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 pb-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-amber-500">SPEC-DRAW AI FOUNDRY</h1>
          <p className="text-sm text-slate-400">Internal Control Center & Autonomous Engineering Stack</p>
        </div>
        <button 
          onClick={triggerAudit}
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold px-4 py-2 rounded flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Auditing Repo...' : 'Run Repository Audit'}
        </button>
      </header>

      {/* Overview Metric Grids */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded border border-slate-800">
          <div className="flex justify-between text-slate-400 text-sm mb-2">
            <span>Repository Status</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-mono font-bold">92% <span className="text-xs text-emerald-400">Healthy</span></div>
        </div>
        <div className="bg-slate-900 p-6 rounded border border-slate-800">
          <div className="flex justify-between text-slate-400 text-sm mb-2">
            <span>Active Module Track</span>
            <Code className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg font-bold truncate">apps/web (Spec-Draw)</div>
        </div>
        <div className="bg-slate-900 p-6 rounded border border-slate-800">
          <div className="flex justify-between text-slate-400 text-sm mb-2">
            <span>Database Integrity</span>
            <Database className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-mono font-bold">14 Tables</div>
        </div>
        <div className="bg-slate-900 p-6 rounded border border-slate-800">
          <div className="flex justify-between text-slate-400 text-sm mb-2">
            <span>Security Framework</span>
            <Shield className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-sm text-emerald-400 font-semibold mt-1">Supabase RLS Active</div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Status Bar */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded border border-slate-800">
            <h3 className="font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">Agent Queue Status</h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between p-2 bg-slate-950 rounded border-l-2 border-amber-500">
                <span className="text-amber-400">AGENT_001_AUDIT</span>
                <span className="text-slate-400">{loading ? "RUNNING" : "IDLE"}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded border-l-2 border-slate-700 opacity-40">
                <span>AGENT_002_CODER</span>
                <span>LOCKED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Manifest Panel */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded border border-slate-800 p-6 min-h-[450px]">
            <div className="flex items-center gap-2 mb-4 text-slate-300 font-semibold border-b border-slate-800 pb-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <h2>Agent Output Master Logs</h2>
              {stats && <span className="text-xs font-mono ml-auto text-slate-500">Scanned {stats.files} files</span>}
            </div>

            {report ? (
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {report}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-sm">
                <p>No audit has been initiated for this current session lifecycle.</p>
                <p className="text-xs text-slate-600 mt-1">Click "Run Repository Audit" above to run Agent 001.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

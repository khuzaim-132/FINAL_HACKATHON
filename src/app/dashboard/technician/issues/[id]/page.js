"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function TechnicianIssueDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState(null);
  const [maintenance, setMaintenance] = useState({
    inspection_findings: "",
    notes: "",
    cost: "",
    parts_used: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/issues/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data.error) router.push("/dashboard/technician/issues"); else setIssue(data.issue); });
  }, [id, router]);

  async function handleStartInspection() {
    await fetch(`/api/issues/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "under_inspection" }),
    });
    fetch(`/api/issues/${id}`).then((r) => r.json()).then((data) => setIssue(data.issue));
  }

  async function handleStartMaintenance(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue_id: id,
          asset_id: issue.asset_id,
          inspection_findings: maintenance.inspection_findings,
          notes: maintenance.notes,
          parts_used: maintenance.parts_used ? maintenance.parts_used.split(",").map((s) => s.trim()) : [],
          cost: maintenance.cost ? parseFloat(maintenance.cost) : null,
        }),
      });
      const data = await res.json();
      if (data.record) {
        await fetch(`/api/issues/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "under_maintenance" }),
        });
        fetch(`/api/issues/${id}`).then((r) => r.json()).then((data) => setIssue(data.issue));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleResolve() {
    await fetch(`/api/issues/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "resolved" }),
    });
    fetch(`/api/issues/${id}`).then((r) => r.json()).then((data) => setIssue(data.issue));
  }

  if (!issue) return <div className="p-8 text-sm text-zinc-400">Loading...</div>;

  return (
    <div className="p-8">
      <Link href="/dashboard/technician/issues" className="mb-4 inline-block text-sm text-zinc-500 hover:text-zinc-900">&larr; Back to Tasks</Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">{issue.title}</h1>
                <p className="mt-1 text-sm text-zinc-400">{issue.asset_name} ({issue.asset_code})</p>
              </div>
              <div className="flex gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  issue.priority === "critical" ? "bg-red-100 text-red-700" :
                  issue.priority === "high" ? "bg-orange-100 text-orange-700" :
                  issue.priority === "medium" ? "bg-amber-100 text-amber-700" :
                  "bg-green-100 text-green-700"
                }`}>{issue.priority}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  issue.status === "resolved" ? "bg-green-100 text-green-700" :
                  issue.status === "assigned" ? "bg-amber-100 text-amber-700" :
                  issue.status === "under_inspection" ? "bg-blue-100 text-blue-700" :
                  "bg-purple-100 text-purple-700"
                }`}>{issue.status.replace(/_/g, " ")}</span>
              </div>
            </div>

            {issue.description && (
              <div className="mt-4 rounded-lg bg-zinc-50 p-4">
                <p className="text-sm text-zinc-700">{issue.description}</p>
              </div>
            )}

            {issue.ai_suggestions && (
              <div className="mt-4 rounded-lg bg-zinc-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-zinc-700">AI Analysis</h3>
                <div className="space-y-2 text-sm">
                  {issue.ai_suggestions.possible_causes?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-zinc-500">Possible Causes:</p>
                      <ul className="list-inside list-disc text-zinc-600">
                        {issue.ai_suggestions.possible_causes.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                  {issue.ai_suggestions.diagnostic_checks?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-zinc-500">Diagnostic Checks:</p>
                      <ul className="list-inside list-disc text-zinc-600">
                        {issue.ai_suggestions.diagnostic_checks.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {(issue.status === "assigned" || issue.status === "under_inspection") && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">
                {issue.status === "assigned" ? "Start Inspection" : "Record Findings"}
              </h2>
              <form onSubmit={handleStartMaintenance} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Inspection Findings</label>
                  <textarea rows={3} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none" value={maintenance.inspection_findings} onChange={(e) => setMaintenance({ ...maintenance, inspection_findings: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Maintenance Notes</label>
                  <textarea rows={3} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none" value={maintenance.notes} onChange={(e) => setMaintenance({ ...maintenance, notes: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">Cost ($)</label>
                    <input type="number" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none" value={maintenance.cost} onChange={(e) => setMaintenance({ ...maintenance, cost: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">Parts Used</label>
                    <input className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none" value={maintenance.parts_used} onChange={(e) => setMaintenance({ ...maintenance, parts_used: e.target.value })} placeholder="Comma separated" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">
                  {loading ? "Saving..." : "Start Maintenance"}
                </button>
              </form>

              {issue.status === "assigned" && (
                <button onClick={handleStartInspection} className="mt-3 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                  Skip to Inspection
                </button>
              )}
            </div>
          )}

          {issue.status === "under_maintenance" && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Complete Repair</h2>
              <p className="mb-4 text-sm text-zinc-500">Confirm that the repair is complete and issue is resolved.</p>
              <button onClick={handleResolve} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                Mark as Resolved
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Asset Info</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-zinc-400">Name:</span> <span className="ml-2">{issue.asset_name}</span></div>
              <div><span className="text-zinc-400">Code:</span> <span className="ml-2 font-mono">{issue.asset_code}</span></div>
              <div><span className="text-zinc-400">Location:</span> <span className="ml-2">{issue.location || "-"}</span></div>
              <div><span className="text-zinc-400">Reported:</span> <span className="ml-2">{new Date(issue.created_at).toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

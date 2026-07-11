"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminIssueDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState("");

  useEffect(() => {
    fetch(`/api/issues/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data.error) router.push("/dashboard/admin/issues"); else setIssue(data.issue); });
    fetch("/api/users/technicians")
      .then((r) => r.json())
      .then((data) => setTechnicians(data.technicians || []));
  }, [id, router]);

  async function handleAssign() {
    if (!selectedTech) return;
    await fetch(`/api/issues/${id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ technician_id: selectedTech }),
    });
    router.refresh();
  }

  if (!issue) return <div className="p-8 text-sm text-zinc-400">Loading...</div>;

  return (
    <div className="p-8">
      <Link href="/dashboard/admin/issues" className="mb-4 inline-block text-sm text-zinc-500 hover:text-zinc-900">&larr; Back to Issues</Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">{issue.title}</h1>
                <p className="mt-1 text-sm text-zinc-400">
                  {issue.asset_name} ({issue.asset_code})
                </p>
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
                  issue.status === "reported" ? "bg-red-100 text-red-700" :
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

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-zinc-400">Category:</span> <span className="ml-2 capitalize">{issue.category || "-"}</span></div>
              <div><span className="text-zinc-400">Reported by:</span> <span className="ml-2">{issue.reported_by_name || "Anonymous"}</span></div>
              <div><span className="text-zinc-400">Assigned to:</span> <span className="ml-2">{issue.assigned_to_name || "Unassigned"}</span></div>
              <div><span className="text-zinc-400">Date:</span> <span className="ml-2">{new Date(issue.created_at).toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {issue.status === "reported" && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Assign Technician</h2>
              <div className="space-y-3">
                <select
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                >
                  <option value="">Select technician...</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!selectedTech}
                  className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  Assign
                </button>
              </div>
            </div>
          )}

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">AI Suggestions</h2>
            {issue.ai_suggestions ? (
              <pre className="text-xs text-zinc-600">{JSON.stringify(issue.ai_suggestions, null, 2)}</pre>
            ) : (
              <p className="text-sm text-zinc-400">No AI analysis available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

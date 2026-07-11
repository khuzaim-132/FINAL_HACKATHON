"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = filter ? `/api/issues?status=${filter}` : "/api/issues";
    fetch(url)
      .then((r) => r.json())
      .then((data) => setIssues(data.issues || []))
      .finally(() => setLoading(false));
  }, [filter]);

  const total = issues.length;
  const critical = issues.filter((i) => i.priority === "critical").length;
  const high = issues.filter((i) => i.priority === "high").length;
  const medium = issues.filter((i) => i.priority === "medium").length;
  const low = issues.filter((i) => i.priority === "low").length;
  const resolved = issues.filter((i) => i.status === "resolved").length;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Issues</h1>
        <div className="flex gap-2">
          {["", "reported", "assigned", "under_inspection", "under_maintenance", "resolved"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === s ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>
              {s ? s.replace(/_/g, " ") : "All"}
            </button>
          ))}
        </div>
      </div>

      {total > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-5">
          <div className="rounded-lg border bg-white px-4 py-3 text-center">
            <p className="text-xl font-bold text-zinc-900">{total}</p>
            <p className="text-xs text-zinc-400">Total</p>
          </div>
          <div className="rounded-lg border bg-white px-4 py-3 text-center">
            <p className="text-xl font-bold text-red-600">{critical}</p>
            <p className="text-xs text-zinc-400">Critical</p>
          </div>
          <div className="rounded-lg border bg-white px-4 py-3 text-center">
            <p className="text-xl font-bold text-orange-600">{high}</p>
            <p className="text-xs text-zinc-400">High</p>
          </div>
          <div className="rounded-lg border bg-white px-4 py-3 text-center">
            <p className="text-xl font-bold text-amber-600">{medium}</p>
            <p className="text-xs text-zinc-400">Medium</p>
          </div>
          <div className="rounded-lg border bg-white px-4 py-3 text-center">
            <p className="text-xl font-bold text-green-600">{resolved}</p>
            <p className="text-xs text-zinc-400">Resolved</p>
          </div>
        </div>
      )}

      {total > 0 && (
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-zinc-700">Priority Distribution</h3>
            <div className="space-y-2">
              <RatioBar label="Critical" value={critical} total={total} color="bg-red-500" />
              <RatioBar label="High" value={high} total={total} color="bg-orange-500" />
              <RatioBar label="Medium" value={medium} total={total} color="bg-amber-500" />
              <RatioBar label="Low" value={low} total={total} color="bg-green-500" />
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-zinc-700">Resolution Progress</h3>
            <div className="space-y-2">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-zinc-700">Resolved</span>
                <span className="font-medium text-zinc-900">{resolved}/{total} ({total > 0 ? ((resolved / total) * 100).toFixed(1) : "0.0"}%)</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${total > 0 ? (resolved / total) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-zinc-400">Loading...</p>
      ) : issues.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-zinc-400">No issues found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-600">Title</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Asset</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Priority</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Assigned To</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Date</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-zinc-50">
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-zinc-800">{issue.title}</td>
                  <td className="px-4 py-3 text-zinc-600">{issue.asset_name}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      issue.priority === "critical" ? "bg-red-100 text-red-700" :
                      issue.priority === "high" ? "bg-orange-100 text-orange-700" :
                      issue.priority === "medium" ? "bg-amber-100 text-amber-700" :
                      "bg-green-100 text-green-700"
                    }`}>{issue.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      issue.status === "resolved" ? "bg-green-100 text-green-700" :
                      issue.status === "reported" ? "bg-red-100 text-red-700" :
                      issue.status === "assigned" ? "bg-amber-100 text-amber-700" :
                      issue.status === "under_inspection" ? "bg-blue-100 text-blue-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>{issue.status.replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{issue.assigned_to_name || "-"}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{new Date(issue.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/admin/issues/${issue.id}`} className="text-sm font-medium text-zinc-900 underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RatioBar({ label, value, total, color }) {
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-zinc-700">{label}</span>
        <span className="font-medium text-zinc-900">{value} ({pct}%)</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

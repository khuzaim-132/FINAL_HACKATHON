"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TechnicianIssuesPage() {
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

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">My Tasks</h1>
        <div className="flex gap-2">
          {["", "assigned", "under_inspection", "under_maintenance", "resolved"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === s ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>
              {s ? s.replace(/_/g, " ") : "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">Loading...</p>
      ) : issues.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-zinc-400">No tasks assigned to you.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {issues.map((issue) => (
            <Link key={issue.id} href={`/dashboard/technician/issues/${issue.id}`} className="block rounded-xl border bg-white p-5 transition-colors hover:bg-zinc-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900">{issue.title}</h3>
                  <p className="mt-0.5 text-sm text-zinc-400">{issue.asset_name} ({issue.asset_code})</p>
                </div>
                <div className="flex gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    issue.priority === "critical" ? "bg-red-100 text-red-700" :
                    issue.priority === "high" ? "bg-orange-100 text-orange-700" :
                    issue.priority === "medium" ? "bg-amber-100 text-amber-700" :
                    "bg-green-100 text-green-700"
                  }`}>{issue.priority}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    issue.status === "assigned" ? "bg-amber-100 text-amber-700" :
                    issue.status === "under_inspection" ? "bg-blue-100 text-blue-700" :
                    issue.status === "under_maintenance" ? "bg-purple-100 text-purple-700" :
                    "bg-green-100 text-green-700"
                  }`}>{issue.status.replace(/_/g, " ")}</span>
                </div>
              </div>
              {issue.location && <p className="mt-2 text-xs text-zinc-400">Location: {issue.location}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

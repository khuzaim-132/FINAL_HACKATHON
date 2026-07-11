"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";

export default function TechnicianDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setAnalytics);
  }, []);

  if (!analytics) {
    return <div className="p-8 text-sm text-zinc-400">Loading...</div>;
  }

  const assigned = analytics.issueCounts?.find((s) => s.status === "assigned")?.count || 0;
  const inspecting = analytics.issueCounts?.find((s) => s.status === "under_inspection")?.count || 0;
  const resolved = analytics.issueCounts?.find((s) => s.status === "resolved")?.count || 0;

  const total = assigned + inspecting + resolved + (analytics.issueCounts?.find((s) => s.status === "under_maintenance")?.count || 0);
  const reported = analytics.issueCounts?.find((s) => s.status === "reported")?.count || 0;
  const maintenance = analytics.issueCounts?.find((s) => s.status === "under_maintenance")?.count || 0;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Technician Dashboard</h1>

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard label="Assigned" value={assigned} color="text-amber-600" />
        <StatCard label="Inspecting" value={inspecting} color="text-blue-600" />
        <StatCard label="Resolved" value={resolved} color="text-green-600" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">My Tasks</h2>
          <Link
            href="/dashboard/technician/issues"
            className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            View Assigned Issues
          </Link>

          {analytics.recentIssues?.length > 0 && (
            <div className="mt-4 space-y-3">
              {analytics.recentIssues.slice(0, 5).map((issue) => (
                <Link
                  key={issue.id}
                  href={`/dashboard/technician/issues/${issue.id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 transition-colors hover:bg-zinc-50"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{issue.title}</p>
                    <p className="text-xs text-zinc-400">{issue.asset_name} ({issue.asset_code})</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    issue.status === "assigned" ? "bg-amber-100 text-amber-700" :
                    issue.status === "under_inspection" ? "bg-blue-100 text-blue-700" :
                    issue.status === "under_maintenance" ? "bg-purple-100 text-purple-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {issue.status.replace(/_/g, " ")}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Issue Completion Ratio</h2>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative h-32 w-32">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e4e4e7" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none" stroke="#22c55e" strokeWidth="3"
                  strokeDasharray={`${total > 0 ? (resolved / total) * 100 : 0} ${total > 0 ? 100 - (resolved / total) * 100 : 100}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-zinc-900">
                  {total > 0 ? Math.round((resolved / total) * 100) : 0}%
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-zinc-500">{resolved} resolved out of {total} total</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Issue Status Breakdown</h2>
          <div className="space-y-3">
            <RatioBar label="Reported" value={reported} total={total + reported} color="bg-red-500" />
            <RatioBar label="Assigned" value={assigned} total={total + reported} color="bg-amber-500" />
            <RatioBar label="Under Inspection" value={inspecting} total={total + reported} color="bg-blue-500" />
            <RatioBar label="Under Maintenance" value={maintenance} total={total + reported} color="bg-purple-500" />
            <RatioBar label="Resolved" value={resolved} total={total + reported} color="bg-green-500" />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Performance Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3">
              <span className="text-sm text-zinc-600">Resolution Rate</span>
              <span className="text-lg font-bold text-green-600">
                {total > 0 ? Math.round((resolved / (total + reported)) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3">
              <span className="text-sm text-zinc-600">Active Tasks</span>
              <span className="text-lg font-bold text-amber-600">{assigned + inspecting + maintenance}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3">
              <span className="text-sm text-zinc-600">Total Issues</span>
              <span className="text-lg font-bold text-zinc-900">{total + reported}</span>
            </div>
          </div>
        </div>
      </div>
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

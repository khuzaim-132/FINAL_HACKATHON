"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setAnalytics);
  }, []);

  if (!analytics) {
    return <div className="p-8 text-sm text-zinc-400">Loading...</div>;
  }

  const openIssues = analytics.issueCounts?.find((s) => s.status !== "resolved")?.count || 0;
  const criticalIssues = analytics.priorityCounts?.find((s) => s.priority === "critical")?.count || 0;
  const underMaintenance = analytics.statusCounts?.find((s) => s.status === "under_maintenance")?.count || 0;

  const total = analytics.totalAssets || 0;
  const totalIssues = analytics.issueCounts?.reduce((s, c) => s + c.count, 0) || 0;
  const resolved = analytics.issueCounts?.find((s) => s.status === "resolved")?.count || 0;
  const reported = analytics.issueCounts?.find((s) => s.status === "reported")?.count || 0;
  const assigned = analytics.issueCounts?.find((s) => s.status === "assigned")?.count || 0;
  const inspecting = analytics.issueCounts?.find((s) => s.status === "under_inspection")?.count || 0;
  const maint = analytics.issueCounts?.find((s) => s.status === "under_maintenance")?.count || 0;

  const operational = analytics.statusCounts?.find((s) => s.status === "operational")?.count || 0;
  const issueReported = analytics.statusCounts?.find((s) => s.status === "issue_reported")?.count || 0;
  const underInsp = analytics.statusCounts?.find((s) => s.status === "under_inspection")?.count || 0;
  const underMaint = analytics.statusCounts?.find((s) => s.status === "under_maintenance")?.count || 0;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Admin Dashboard</h1>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Assets" value={analytics.totalAssets} />
        <StatCard label="Open Issues" value={openIssues} color="text-amber-600" />
        <StatCard label="Critical" value={criticalIssues} color="text-red-600" />
        <StatCard label="Under Maintenance" value={underMaintenance} color="text-blue-600" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/dashboard/admin/assets/new" className="block rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50">
              + Register New Asset
            </Link>
            <Link href="/dashboard/admin/assets" className="block rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50">
              View All Assets
            </Link>
            <Link href="/dashboard/admin/issues" className="block rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50">
              Manage Issues
            </Link>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          {analytics.recentHistory?.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentHistory.map((h) => (
                <div key={h.id} className="border-l-2 border-zinc-200 pl-3">
                  <p className="text-sm font-medium text-zinc-800">{h.action.replace(/_/g, " ")}</p>
                  <p className="text-xs text-zinc-400">{h.description}</p>
                  <p className="text-xs text-zinc-300">{h.performed_by_name || "System"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">No recent activity.</p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Asset Status Distribution</h2>
          <div className="space-y-3">
            <RatioBar label="Operational" value={operational} total={total} color="bg-green-500" />
            <RatioBar label="Issue Reported" value={issueReported} total={total} color="bg-red-500" />
            <RatioBar label="Under Inspection" value={underInsp} total={total} color="bg-blue-500" />
            <RatioBar label="Under Maintenance" value={underMaint} total={total} color="bg-purple-500" />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Issue Status Breakdown</h2>
          <div className="space-y-3">
            <RatioBar label="Reported" value={reported} total={totalIssues} color="bg-red-500" />
            <RatioBar label="Assigned" value={assigned} total={totalIssues} color="bg-amber-500" />
            <RatioBar label="Under Inspection" value={inspecting} total={totalIssues} color="bg-blue-500" />
            <RatioBar label="Under Maintenance" value={maint} total={totalIssues} color="bg-purple-500" />
            <RatioBar label="Resolved" value={resolved} total={totalIssues} color="bg-green-500" />
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

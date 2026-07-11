"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assets")
      .then((r) => r.json())
      .then((data) => setAssets(data.assets))
      .finally(() => setLoading(false));
  }, []);

  const total = assets.length;
  const operational = assets.filter((a) => a.status === "operational").length;
  const issueReported = assets.filter((a) => a.status === "issue_reported").length;
  const underInsp = assets.filter((a) => a.status === "under_inspection").length;
  const underMaint = assets.filter((a) => a.status === "under_maintenance").length;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Assets</h1>
        <Link
          href="/dashboard/admin/assets/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          + New Asset
        </Link>
      </div>

      {total > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border bg-white px-4 py-3 text-center">
            <p className="text-xl font-bold text-zinc-900">{total}</p>
            <p className="text-xs text-zinc-400">Total</p>
          </div>
          <div className="rounded-lg border bg-white px-4 py-3 text-center">
            <p className="text-xl font-bold text-green-600">{operational}</p>
            <p className="text-xs text-zinc-400">Operational</p>
          </div>
          <div className="rounded-lg border bg-white px-4 py-3 text-center">
            <p className="text-xl font-bold text-red-600">{issueReported + underInsp}</p>
            <p className="text-xs text-zinc-400">With Issues</p>
          </div>
          <div className="rounded-lg border bg-white px-4 py-3 text-center">
            <p className="text-xl font-bold text-purple-600">{underMaint}</p>
            <p className="text-xs text-zinc-400">Maintenance</p>
          </div>
        </div>
      )}

      {total > 0 && (
        <div className="mb-6 rounded-xl border bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-zinc-700">Status Distribution</h3>
          <div className="space-y-2">
            <RatioBar label="Operational" value={operational} total={total} color="bg-green-500" />
            <RatioBar label="Issue Reported" value={issueReported} total={total} color="bg-red-500" />
            <RatioBar label="Under Inspection" value={underInsp} total={total} color="bg-blue-500" />
            <RatioBar label="Under Maintenance" value={underMaint} total={total} color="bg-purple-500" />
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-zinc-400">Loading...</p>
      ) : assets.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-zinc-400">No assets registered yet.</p>
          <Link href="/dashboard/admin/assets/new" className="mt-2 inline-block text-sm font-medium text-zinc-900 underline">
            Register your first asset
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-600">Code</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Name</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Category</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Location</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Issues</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{asset.asset_code}</td>
                  <td className="px-4 py-3 font-medium text-zinc-800">{asset.name}</td>
                  <td className="px-4 py-3 capitalize text-zinc-600">{asset.category || "-"}</td>
                  <td className="px-4 py-3 text-zinc-600">{asset.location || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      asset.status === "operational" ? "bg-green-100 text-green-700" :
                      asset.status === "issue_reported" ? "bg-red-100 text-red-700" :
                      asset.status === "under_inspection" ? "bg-blue-100 text-blue-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {asset.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{asset.open_issues || 0}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/admin/assets/${asset.id}`} className="text-sm font-medium text-zinc-900 underline">
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

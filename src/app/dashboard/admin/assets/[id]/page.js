"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "@/components/QRCode";

export default function AssetDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [asset, setAsset] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`/api/assets/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data.error) router.push("/dashboard/admin/assets"); else setAsset(data.asset); });

    fetch(`/api/history?asset_id=${id}`)
      .then((r) => r.json())
      .then((data) => setHistory(data.history || []));
  }, [id, router]);

  if (!asset) return <div className="p-8 text-sm text-zinc-400">Loading...</div>;

  return (
    <div className="p-8">
      <Link href="/dashboard/admin/assets" className="mb-4 inline-block text-sm text-zinc-500 hover:text-zinc-900">&larr; Back to Assets</Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">{asset.name}</h1>
                <p className="mt-1 font-mono text-sm text-zinc-400">{asset.asset_code}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                asset.status === "operational" ? "bg-green-100 text-green-700" :
                asset.status === "issue_reported" ? "bg-red-100 text-red-700" :
                asset.status === "under_inspection" ? "bg-blue-100 text-blue-700" :
                "bg-purple-100 text-purple-700"
              }`}>{asset.status.replace(/_/g, " ")}</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-zinc-400">Category:</span> <span className="ml-2 capitalize">{asset.category || "-"}</span></div>
              <div><span className="text-zinc-400">Location:</span> <span className="ml-2">{asset.location || "-"}</span></div>
              <div><span className="text-zinc-400">Created:</span> <span className="ml-2">{new Date(asset.created_at).toLocaleDateString()}</span></div>
              <div><span className="text-zinc-400">Next Service:</span> <span className="ml-2">{asset.next_service_date || "Not set"}</span></div>
            </div>

            {asset.description && (
              <p className="mt-4 text-sm text-zinc-600">{asset.description}</p>
            )}
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">QR Code</h2>
            <div className="flex flex-col items-center gap-4">
              <QRCode url={asset.qr_code_url} size={200} />
              <p className="text-sm text-zinc-500 break-all text-center">
                <a href={asset.qr_code_url} target="_blank" className="text-zinc-900 underline">{asset.qr_code_url}</a>
              </p>
              <p className="text-xs text-zinc-400 text-center">Scan this QR code to view asset info and report issues.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">History</h2>
            {history.length === 0 ? (
              <p className="text-sm text-zinc-400">No history yet.</p>
            ) : (
              <div className="space-y-3">
                {history.map((h) => (
                  <div key={h.id} className="border-l-2 border-zinc-200 pl-3">
                    <p className="text-sm font-medium text-zinc-800 capitalize">{h.action.replace(/_/g, " ")}</p>
                    <p className="text-xs text-zinc-400">{h.description}</p>
                    <p className="text-xs text-zinc-300">{new Date(h.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

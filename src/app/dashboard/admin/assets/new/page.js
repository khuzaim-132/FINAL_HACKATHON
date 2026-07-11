"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "@/components/QRCode";

export default function NewAssetPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", category: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setResult(data.asset);
    } catch {
      setError("Failed to create asset");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-lg rounded-xl border bg-white p-8 text-center">
          <span className="mb-4 inline-block text-4xl">✅</span>
          <h2 className="mb-2 text-xl font-bold text-zinc-900">Asset Created!</h2>
          <div className="my-6 flex flex-col items-center gap-4">
            <QRCode url={result.qr_code_url} size={180} />
            <div className="w-full rounded-lg bg-zinc-50 p-4 text-left font-mono text-sm">
              <p><span className="text-zinc-400">Code:</span> <strong>{result.asset_code}</strong></p>
              <p><span className="text-zinc-400">Name:</span> {result.name}</p>
              <p><span className="text-zinc-400">Category:</span> {result.category || "-"}</p>
              <p><span className="text-zinc-400">Location:</span> {result.location || "-"}</p>
              <p className="mt-2 break-all"><span className="text-zinc-400">QR URL:</span> {result.qr_code_url}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard/admin/assets")}
              className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              View All Assets
            </button>
            <button
              onClick={() => { setResult(null); setForm({ name: "", description: "", category: "", location: "" }); }}
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Register New Asset</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Name *</label>
          <input required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Description</label>
          <textarea rows={3} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Category</label>
          <input className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Electrical, Mechanical, IT" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Location</label>
          <input className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Building A, Floor 3" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">
          {loading ? "Creating..." : "Register Asset"}
        </button>
      </form>
    </div>
  );
}

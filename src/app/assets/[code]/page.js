"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicAssetPage() {
  const { code } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState({ name: "", title: "", description: "", category: "", priority: "medium" });
  const [aiResult, setAiResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/assets")
      .then((r) => r.json())
      .then((data) => {
        const found = data.assets?.find((a) => a.asset_code === code);
        if (found) setAsset(found);
        setLoading(false);
      });
  }, [code]);

  async function handleAiAnalysis() {
    if (!report.title) return;
    const res = await fetch("/api/ai/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: report.title, description: report.description }),
    });
    const data = await res.json();
    setAiResult(data);
    setReport((r) => ({ ...r, category: data.category, priority: data.priority }));
  }

  async function handleSubmitReport(e) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        asset_id: asset.id,
        reported_by_name: report.name || "Anonymous",
        title: report.title,
        description: report.description,
        category: report.category,
        priority: report.priority,
      }),
    });
    if (res.ok) setSubmitted(true);
    setSubmitting(false);
  }

  if (loading) return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center"><p className="text-sm text-zinc-400">Loading...</p></div>
      <Footer />
    </div>
  );

  if (!asset) return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <span className="mb-4 text-4xl">🔍</span>
        <h1 className="text-2xl font-bold text-zinc-900">Asset Not Found</h1>
        <p className="mt-2 text-zinc-500">No asset found with code <strong>{code}</strong></p>
        <Link href="/" className="mt-6 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">Go Home</Link>
      </div>
      <Footer />
    </div>
  );

  if (submitted) return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <span className="mb-4 text-4xl">✅</span>
        <h1 className="text-2xl font-bold text-zinc-900">Report Submitted</h1>
        <p className="mt-2 text-zinc-500">Thank you. The maintenance team will review your report.</p>
        <Link href={`/assets/${code}`} className="mt-6 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">Back to Asset</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-zinc-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border bg-white p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">{asset.name}</h1>
                <p className="mt-1 font-mono text-sm text-zinc-400">{asset.asset_code}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                asset.status === "operational" ? "bg-green-100 text-green-700" :
                "bg-amber-100 text-amber-700"
              }`}>{asset.status.replace(/_/g, " ")}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-zinc-400">Category:</span> <span className="ml-2 capitalize">{asset.category || "-"}</span></div>
              <div><span className="text-zinc-400">Location:</span> <span className="ml-2">{asset.location || "-"}</span></div>
              {asset.description && <div className="col-span-2"><span className="text-zinc-400">Description:</span> <p className="mt-1 text-zinc-600">{asset.description}</p></div>}
            </div>

            {!showReport ? (
              <button onClick={() => setShowReport(true)} className="mt-8 w-full rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800">
                Report Issue
              </button>
            ) : (
              <div className="mt-8 border-t pt-6">
                <h2 className="mb-4 text-lg font-semibold">Report an Issue</h2>
                <form onSubmit={handleSubmitReport} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">Your Name (optional)</label>
                    <input className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none" value={report.name} onChange={(e) => setReport({ ...report, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">Issue Title *</label>
                    <input required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none" value={report.title} onChange={(e) => setReport({ ...report, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">Description</label>
                    <textarea rows={3} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none" value={report.description} onChange={(e) => setReport({ ...report, description: e.target.value })} />
                  </div>

                  {!aiResult && report.title && (
                    <button type="button" onClick={handleAiAnalysis} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                      Analyze with AI
                    </button>
                  )}

                  {aiResult && (
                    <div className="rounded-lg bg-zinc-50 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">AI Suggestion</p>
                      <p className="text-sm font-medium text-zinc-800">{aiResult.professional_title}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs capitalize text-amber-700">{aiResult.category}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          aiResult.priority === "critical" ? "bg-red-100 text-red-700" :
                          aiResult.priority === "high" ? "bg-orange-100 text-orange-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{aiResult.priority}</span>
                      </div>
                      {aiResult.possible_causes?.length > 0 && (
                        <div className="mt-2"><p className="text-xs font-medium text-zinc-500">Possible causes:</p><p className="text-xs text-zinc-600">{aiResult.possible_causes.join(", ")}</p></div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">
                      {submitting ? "Submitting..." : "Submit Report"}
                    </button>
                    <button type="button" onClick={() => setShowReport(false)} className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-zinc-400">
            Asset Management System &middot; <Link href="/" className="underline">Home</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

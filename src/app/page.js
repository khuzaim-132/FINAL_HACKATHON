import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: "⊞",
    title: "Asset Tracking",
    desc: "Register, categorize, and monitor all your assets from a centralized dashboard with QR code access.",
  },
  {
    icon: "⚠",
    title: "Issue Management",
    desc: "Report problems instantly via QR scans. AI-powered triage suggests category, priority, and possible causes.",
  },
  {
    icon: "⟳",
    title: "Maintenance Workflow",
    desc: "Technicians can inspect, record findings, log parts and costs, and resolve issues with full history tracking.",
  },
  {
    icon: "▦",
    title: "Real-time Analytics",
    desc: "View open issues, critical items, maintenance status, and recent activity at a glance.",
  },
  {
    icon: "☰",
    title: "Role-based Access",
    desc: "Admins manage assets and assign work. Technicians focus on inspections and repairs.",
  },
  {
    icon: "⚡",
    title: "AI-powered Triage",
    desc: "Describe the issue and let AI categorize, prioritize, and suggest diagnostic steps.",
  },
];

const steps = [
  { step: "1", title: "Register Assets", desc: "Admins add assets with name, category, and location. Each asset gets a unique QR code." },
  { step: "2", title: "Scan & Report", desc: "Anyone scans the QR code to view asset info and report issues with AI-assisted triage." },
  { step: "3", title: "Assign & Inspect", desc: "Admins assign issues to technicians who inspect and begin maintenance." },
  { step: "4", title: "Resolve & Track", desc: "Technicians log findings, parts, and costs. Issues are resolved with full history preserved." },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100 px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-6 inline-flex items-center rounded-full bg-zinc-900/5 px-4 py-1.5 text-xs font-medium text-zinc-600">
              Asset Management & Maintenance System
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Manage your assets.
              <br />
              <span className="text-zinc-400">Resolve issues faster.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500">
              A complete system for registering assets, reporting issues via QR codes, AI-powered triage,
              and tracking maintenance from inspection to resolution.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-zinc-900 px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-zinc-300 bg-white px-8 py-3.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t bg-white px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Everything you need</h2>
              <p className="mt-2 text-zinc-500">A complete asset maintenance workflow from registration to resolution.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="rounded-xl border bg-zinc-50/50 p-6 transition-colors hover:bg-zinc-50">
                  <span className="text-2xl">{f.icon}</span>
                  <h3 className="mt-3 font-semibold text-zinc-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-zinc-50 px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">How it works</h2>
              <p className="mt-2 text-zinc-500">From asset registration to issue resolution in four steps.</p>
            </div>
            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={s.title} className="relative flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
                      {s.step}
                    </div>
                    {i < steps.length - 1 && <div className="mt-2 h-full w-px bg-zinc-200" />}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-lg font-semibold text-zinc-900">{s.title}</h3>
                    <p className="mt-1 text-sm text-zinc-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-white px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Ready to get started?</h2>
            <p className="mt-3 text-zinc-500">
              Create an account and start managing your assets today.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-zinc-900 px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-zinc-300 bg-white px-8 py-3.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

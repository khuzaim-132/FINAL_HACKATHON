import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: "⊞",
    title: "Asset Tracking",
    desc: "Register, categorize, and monitor all your assets from a centralized dashboard with QR code access.",
    href: "/dashboard/admin/assets",
    label: "View Assets",
    tag: "Admin",
  },
  {
    icon: "⚠",
    title: "Issue Management",
    desc: "Report problems instantly via QR scans. AI-powered triage suggests category, priority, and possible causes.",
    href: "/dashboard/admin/issues",
    label: "Manage Issues",
    tag: "Admin",
  },
  {
    icon: "⟳",
    title: "Maintenance Workflow",
    desc: "Technicians can inspect, record findings, log parts and costs, and resolve issues with full history tracking.",
    href: "/dashboard/technician/issues",
    label: "View Tasks",
    tag: "Technician",
  },
  {
    icon: "▦",
    title: "Real-time Analytics",
    desc: "View open issues, critical items, maintenance status, and recent activity at a glance with ratio breakdowns.",
    href: "/dashboard/admin",
    label: "Dashboard",
    tag: "Admin",
  },
  {
    icon: "☰",
    title: "Role-based Access",
    desc: "Admins manage assets and assign work. Technicians focus on inspections and repairs. Each role sees what matters.",
    href: "/signup",
    label: "Create Account",
    tag: "Auth",
  },
  {
    icon: "⚡",
    title: "AI-powered Triage",
    desc: "Describe the issue and let AI categorize, prioritize, and suggest diagnostic steps before reporting.",
    href: "/signup",
    label: "Try It",
    tag: "AI",
  },
  {
    icon: "⊟",
    title: "QR Code Generation",
    desc: "Every asset gets a unique QR code linking to its public page. Anyone can scan to view info and report issues.",
    href: "/dashboard/admin/assets",
    label: "See Assets",
    tag: "Admin",
  },
  {
    icon: "◷",
    title: "Maintenance History",
    desc: "Full audit trail of every action: issue reported, assigned, inspected, maintained, and resolved with timestamps.",
    href: "/dashboard/admin/assets",
    label: "View History",
    tag: "Both",
  },
  {
    icon: "⊡",
    title: "Status Ratios",
    desc: "Visual breakdown of asset and issue statuses with percentage bars and donut charts for quick insights.",
    href: "/dashboard/admin",
    label: "View Ratios",
    tag: "Both",
  },
];

const roleCompare = [
  { role: "Admin", color: "bg-zinc-900", capabilities: [
    "Register & manage assets",
    "View all issues",
    "Assign technicians",
    "Access analytics & ratios",
    "Generate QR codes",
    "Full system overview",
  ]},
  { role: "Technician", color: "bg-zinc-600", capabilities: [
    "View assigned tasks",
    "Inspect & diagnose issues",
    "Record findings & costs",
    "Log parts used",
    "Resolve & close issues",
    "Track personal stats",
  ]},
];

const steps = [
  { step: "1", title: "Register Assets", desc: "Admins add assets with name, category, and location. Each asset gets a unique QR code.", link: "/dashboard/admin/assets/new", linkLabel: "Register Now" },
  { step: "2", title: "Scan & Report", desc: "Anyone scans the QR code to view asset info and report issues with AI-assisted triage.", link: "/signup", linkLabel: "Get Started" },
  { step: "3", title: "Assign & Inspect", desc: "Admins assign issues to technicians who inspect and begin the maintenance workflow.", link: "/dashboard/admin/issues", linkLabel: "View Issues" },
  { step: "4", title: "Resolve & Track", desc: "Technicians log findings, parts, and costs. Issues are resolved with full history preserved.", link: "/dashboard/technician/issues", linkLabel: "View Tasks" },
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
              <p className="mt-2 text-zinc-500">Complete asset maintenance workflow from registration to resolution.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Link
                  key={f.title}
                  href={f.href}
                  className="group rounded-xl border bg-zinc-50/50 p-6 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{f.icon}</span>
                    <span className="rounded-full bg-zinc-200/50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500 transition-colors group-hover:bg-zinc-200">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold text-zinc-900 group-hover:text-zinc-700">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{f.desc}</p>
                  <span className="mt-3 inline-block text-xs font-medium text-zinc-700 underline-offset-2 group-hover:underline">
                    {f.label} &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-zinc-50 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Two roles, one system</h2>
              <p className="mt-2 text-zinc-500">Tailored dashboards for admins and technicians.</p>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              {roleCompare.map((r) => (
                <div key={r.role} className="rounded-xl border bg-white p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${r.color} text-sm font-bold text-white`}>
                      {r.role[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900">{r.role}</h3>
                      <p className="text-xs text-zinc-400 capitalize">{r.role} Dashboard</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {r.capabilities.map((c) => (
                      <li key={c} className="flex items-center gap-3 text-sm text-zinc-600">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-[10px] text-green-700">&#10003;</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-white px-4 py-20">
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
                  <div className="flex flex-1 items-start justify-between pb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900">{s.title}</h3>
                      <p className="mt-1 text-sm text-zinc-500">{s.desc}</p>
                    </div>
                    <Link
                      href={s.link}
                      className="ml-4 mt-1 shrink-0 rounded-lg border border-zinc-200 px-3.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                    >
                      {s.linkLabel}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-zinc-900 px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">Ready to get started?</h2>
            <p className="mt-3 text-zinc-400">
              Create an account and start managing your assets today. No credit card required.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-white px-8 py-3.5 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-zinc-700 px-8 py-3.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
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

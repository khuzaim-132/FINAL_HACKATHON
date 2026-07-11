"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const adminLinks = [
  { href: "/dashboard/admin", label: "Overview", icon: "▦" },
  { href: "/dashboard/admin/assets", label: "Assets", icon: "⊞" },
  { href: "/dashboard/admin/issues", label: "Issues", icon: "⚠" },
];

const technicianLinks = [
  { href: "/dashboard/technician", label: "Overview", icon: "▦" },
  { href: "/dashboard/technician/issues", label: "My Tasks", icon: "⚠" },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const links = user?.role === "admin" ? adminLinks : technicianLinks;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="flex w-60 flex-col border-r bg-white">
      <div className="flex items-center gap-2 border-b px-5 py-4">
        <span className="text-lg">⚙</span>
        <span className="text-sm font-bold tracking-tight text-zinc-800">Asset Manager</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-5 py-4">
        <p className="truncate text-sm font-medium text-zinc-800">{user?.name}</p>
        <p className="mb-3 text-xs text-zinc-400 capitalize">{user?.role}</p>
        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

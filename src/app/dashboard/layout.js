"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) router.push("/login");
        else setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/alerts")
      .then((r) => r.json())
      .then((data) => setAlerts(data.alerts || []))
      .catch(() => {});
  }, [user]);

  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.id));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar user={user} />
      <div className="flex flex-1 flex-col overflow-auto">
        {visibleAlerts.length > 0 && (
          <div className="space-y-1 px-4 pt-4">
            {visibleAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
                <span className="text-amber-600">&#9888;</span>
                <div className="flex-1">
                  <span className="font-medium text-amber-800">{alert.message}</span>
                  <span className="ml-2 text-xs text-amber-500">
                    Alert sent to <span className="font-mono underline">{alert.email}</span>
                  </span>
                </div>
                <button
                  onClick={() => setDismissed(new Set([...dismissed, alert.id]))}
                  className="text-amber-400 hover:text-amber-600"
                >
                  &#10005;
                </button>
              </div>
            ))}
          </div>
        )}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

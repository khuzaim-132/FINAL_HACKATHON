export default function StatCard({ label, value, color }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className={`text-3xl font-bold ${color || "text-zinc-900"}`}>{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{label}</p>
    </div>
  );
}

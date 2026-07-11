import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <span className="mb-4 text-6xl">🔍</span>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Page not found</h1>
        <p className="mt-3 text-zinc-500">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link
          href="/"
          className="mt-8 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Go Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}

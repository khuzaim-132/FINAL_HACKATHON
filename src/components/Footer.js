import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="text-base">⚙</span>
            <span className="font-medium text-zinc-700">Asset Manager</span>
            <span className="hidden sm:inline">&middot; Asset Management & Maintenance System</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <Link href="/" className="transition-colors hover:text-zinc-700">
              Home
            </Link>
            <Link href="/login" className="transition-colors hover:text-zinc-700">
              Sign In
            </Link>
            <Link href="/signup" className="transition-colors hover:text-zinc-700">
              Sign Up
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-zinc-300">
          &copy; {new Date().getFullYear()} Asset Manager. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

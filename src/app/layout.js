import "./globals.css";

export const metadata = {
  title: "Asset Manager",
  description: "Asset Management & Maintenance System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-zinc-50 font-sans text-zinc-900">{children}</body>
    </html>
  );
}

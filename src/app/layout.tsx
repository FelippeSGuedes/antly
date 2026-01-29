import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Antly",
  description: "Classificados minimalistas para freelancers de qualquer área."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}

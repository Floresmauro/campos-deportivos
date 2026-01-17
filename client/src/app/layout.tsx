import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as requested
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campos Deportivos",
  description: "Plataforma integral de gestión deportiva",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

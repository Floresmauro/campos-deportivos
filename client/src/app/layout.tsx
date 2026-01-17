import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledJsxRegistry from '@/lib/registry';
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campos Deportivos",
  description: "Gestión profesional de campos deportivos",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#003366",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <SettingsProvider>
            <StyledJsxRegistry>
              {children}
            </StyledJsxRegistry>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

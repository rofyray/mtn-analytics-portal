import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";

const mtnBrighterSans = localFont({
  src: [
    {
      path: "./fonts/MTNBrighterSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/MTNBrighterSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mtn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MTN Analytics Portal",
  description: "Smart Analytics for a Data-Driven World",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={mtnBrighterSans.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

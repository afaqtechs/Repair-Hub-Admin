import { Providers } from "./providers";
import "./globals.css"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import type { Metadata, Viewport } from 'next'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Addis Repair',
  description: 'Technician to technician repair service',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#000000',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
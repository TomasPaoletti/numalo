import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "@/components/shared/theme/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://numeraloapp.com",
  ),
  title: {
    default: "Numeralo — Plataforma de rifas online para Argentina",
    template: "%s | Numeralo",
  },
  description:
    "Creá y gestioná rifas online en minutos. Vendé números, cobrá por transferencia directa y sorteá de forma automática. La plataforma de rifas para Argentina.",
  keywords: [
    "rifas online",
    "automatizar rifas",
    "web para rifas",
    "plataforma de rifas",
    "rifas argentina",
    "crear rifas online",
    "organizar rifas",
    "sorteos online",
    "rifas por transferencia",
    "sorteos argentina",
    "rifas numeradas",
    "vender numeros rifa",
  ],
  authors: [{ name: "Numeralo", url: "https://numeraloapp.com" }],
  creator: "Numeralo",
  publisher: "Numeralo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Numeralo",
    title: "Numeralo — Plataforma de rifas online para Argentina",
    description:
      "Creá y gestioná rifas online en minutos. Vendé números, cobrá por transferencia y sorteá automáticamente.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Numeralo — Plataforma de rifas online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Numeralo — Plataforma de rifas online para Argentina",
    description:
      "Creá y gestioná rifas online en minutos. La plataforma de rifas para Argentina.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="top-center" />
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id="4842ccbc-1a75-421b-a181-15284310eecc"
            strategy="afterInteractive"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

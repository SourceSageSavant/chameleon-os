import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import "./globals.css";

// Font configurations for different themes
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Premium Creatine Gummies | NSF Certified for Sport",
    template: "%s | Chameleon Commerce",
  },
  description: "The only creatine gummy with 2.5g per serving. NSF Certified for Sport, made in USA. Get your full daily dose in just 2 delicious gummies.",
  keywords: ["creatine gummies", "creatine supplement", "NSF certified", "sports nutrition", "workout supplement"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Chameleon Commerce",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="organic_v1">
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}


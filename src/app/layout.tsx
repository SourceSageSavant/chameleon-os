import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { StoreProvider } from "@/providers/store-provider";
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

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const storeId = headersList.get("x-store-id");

  if (storeId) {
    const supabase = createServerClient();
    const { data: store } = await supabase
      .from("stores")
      .select("name, content, settings")
      .eq("id", storeId)
      .single();

    if (store) {
      return {
        title: {
          default: store.content?.seo_title || store.name,
          template: `%s | ${store.name}`,
        },
        description: store.content?.seo_description || `Welcome to ${store.name}`,
        keywords: store.settings?.seo?.keywords || [],
      };
    }
  }

  return {
    title: "Chameleon Commerce",
    description: "Premium E-commerce Platform",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get store ID from middleware headers
  const headersList = await headers();
  const storeId = headersList.get("x-store-id");

  let initialStore = null;

  if (storeId) {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("stores")
      .select("*")
      .eq("id", storeId)
      .single();
    initialStore = data;
  }

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} antialiased`}
      >
        <StoreProvider initialStore={initialStore}>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

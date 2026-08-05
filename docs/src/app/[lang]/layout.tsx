import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { i18n } from "@/lib/i18n";

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: "English",
    },
    zh: {
      displayName: "简体中文",
      search: "搜索文档",
    },
  },
});

const inter = Inter({
  subsets: ["latin"],
});

const siteTitle = "Theme Redefine Docs";
const defaultDescription =
  "Official documentation for the Hexo Theme Redefine.";
const zhDescription =
  "Hexo Theme Redefine 官方文档。Redefine 是一款简洁，快速，纯净的 Hexo 主题。简洁，但不简单。";
const metadataBase = new URL("https://redefine-docs.ohevan.com");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const description = lang === "zh" ? zhDescription : defaultDescription;

  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description,
    metadataBase,
    openGraph: {
      images:
        "https://assets.ohevan.com/img/11eb7c9cabf63d20c29e969111c6d4c5.png",
      siteName: siteTitle,
      type: "website",
    },
    twitter: {
      site: "@evnluo",
      card: "summary_large_image",
    },
    appleWebApp: {
      title: siteTitle,
    },
    other: {
      "msapplication-TileColor": "#fff",
    },
  };
}

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const lang = (await params).lang;

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider i18n={provider(lang)}>{children}</RootProvider>
      </body>
    </html>
  );
}

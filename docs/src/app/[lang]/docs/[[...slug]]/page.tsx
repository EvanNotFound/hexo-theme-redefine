import { getPageImage, source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate
} from "@/components/layout/docs/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { LLMCopyButton, ViewOptions } from "@/components/ai/page-actions";
import { PromoCard } from "@/components/promo-card";
import { ArrowRight } from "lucide-react";


export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { slug, lang } = await params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const gitConfig = {
    user: "EvanNotFound",
    repo: "redefine-docs-v2",
    branch: "main",
  };

  const lastModifiedTime = page.data.lastModified ? new Date(page.data.lastModified) : undefined;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} tableOfContent={
      {
        footer: <PromoCard />
      }
    }
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row items-center gap-2 border-b pb-6">
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      <div className="flex flex-row items-center gap-2 mt-4 justify-between">
        <div>
          {lastModifiedTime && <PageLastUpdate date={lastModifiedTime} />}
        </div>
        <a
          href={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
          rel="noreferrer noopener"
          target="_blank"
          className="w-fit flex flex-row items-center gap-1 text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground"
        >
          <span>Edit on GitHub</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all duration-300" />
        </a>
      </div>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { slug, lang } = await params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}

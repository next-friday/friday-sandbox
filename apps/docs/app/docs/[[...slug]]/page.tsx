import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/notebook/page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export interface PageProps {
  params: Promise<PageParamsProps>;
}

export interface PageParamsProps {
  slug?: string[];
}

const Page = async (props: Readonly<PageProps>) => {
  const { params } = props;
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{ style: "normal" }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
};

export default Page;

export const generateStaticParams = () => source.generateParams();

export const generateMetadata = async (
  props: Readonly<PageProps>,
): Promise<Metadata> => {
  const { params } = props;
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const metadata: Metadata = {
    title: page.data.title,
    description: page.data.description,
  };

  return metadata;
};

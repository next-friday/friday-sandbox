import { HomeLayout } from "fumadocs-ui/layouts/home";
import Link from "next/link";
import type { Metadata } from "next";

import { baseOptions } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Friday Sandbox",
  description:
    "Accessible React components built on react-aria-components and Tailwind CSS v4.",
};

const HomePage = () => (
  <HomeLayout {...baseOptions}>
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold sm:text-5xl">Friday Sandbox</h1>
      <p className="text-fd-muted-foreground max-w-xl text-lg">
        Accessible React components built on react-aria-components and Tailwind
        CSS v4.
      </p>
      <Link
        href="/docs"
        className="bg-fd-primary text-fd-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
      >
        Get started
      </Link>
    </main>
  </HomeLayout>
);

export default HomePage;

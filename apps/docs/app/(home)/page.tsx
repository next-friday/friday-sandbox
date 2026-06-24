import { HomeLayout } from "fumadocs-ui/layouts/home";
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
      <h1 className="text-3xl font-bold sm:text-5xl">Friday</h1>
    </main>
  </HomeLayout>
);

export default HomePage;

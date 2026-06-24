import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";

import { baseOptions } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Friday",
  description:
    "Accessible React components built on react-aria-components and Tailwind CSS v4.",
};

const HomePage = () => <HomeLayout {...baseOptions}></HomeLayout>;

export default HomePage;

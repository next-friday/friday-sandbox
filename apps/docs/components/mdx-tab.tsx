import { Tab as FumadocsTab } from "fumadocs-ui/components/tabs";
import type { ComponentProps } from "react";

export const Tab = (props: ComponentProps<typeof FumadocsTab>) => (
  <FumadocsTab
    {...props}
    className={props.value === "Preview" ? "not-prose" : props.className}
  />
);

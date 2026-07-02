import { Flex } from "@friday-sandbox/react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

const LINK_CLASS =
  "fri-button fri-button-primary fri-button-ghost fri-button-sm";

const rowStyle = { marginBlock: "1rem" } satisfies CSSProperties;
const linkStyle = { textDecoration: "none" } satisfies CSSProperties;
const reactAriaStyle = { color: "#6733ff" } satisfies CSSProperties;
const storybookStyle = { color: "#ff4785" } satisfies CSSProperties;

const svgBase = {
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": true,
} satisfies ComponentPropsWithoutRef<"svg">;

const GithubIcon = () => (
  <svg {...svgBase} viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
    />
  </svg>
);

const StorybookIcon = () => (
  <svg {...svgBase} viewBox="0 0 512 512" style={storybookStyle}>
    <path d="M356.5,5.2L353.9,63c-0.1,3.2,3.7,5.2,6.3,3.2l22.6-17.1L401.9,64c2.5,1.7,5.8,0,6-3l-2.2-58.8l28.4-2.2c14.7-1,27.3,10.8,27.3,25.6v460.8c0,14.7-12.3,26.3-26.9,25.6L91.1,496.6c-13.3-0.6-24.1-11.3-24.5-24.7l-16-422.3c-0.8-14.2,9.9-26.3,24.1-27.1L356.2,4.7L356.5,5.2z M291,198.4c0,10,67.4,5.1,76.6-1.7c0-68.2-36.7-104.3-103.6-104.3c-67.2,0-104.5,36.8-104.5,91.6c0,94.9,128,96.6,128,148.4c0,15-6.8,23.5-22.4,23.5c-20.5,0-28.8-10.4-27.7-46.1c0-7.7-77.8-10.3-80.4,0c-5.7,86,47.6,110.9,108.7,110.9c59.6,0,106.1-31.7,106.1-89.1c0-101.7-130.1-99-130.1-149.3c0-20.7,15.4-23.4,24.1-23.4c9.7,0,26.7,1.5,25.4,39.8L291,198.4z" />
  </svg>
);

const ReactAriaIcon = () => (
  <svg {...svgBase} viewBox="200 206 800 790" style={reactAriaStyle}>
    <path d="M720.67 205.995C867.583 205.995 986.679 325.091 986.68 472.003C986.68 590.753 908.865 691.325 801.446 725.521L979.312 948.055C994.438 966.98 980.963 995 956.736 995H795.612C778.743 995 762.715 987.629 751.734 974.823L697.365 911.421L493.126 653.39C457.134 607.918 489.518 540.979 547.511 540.977L720.67 540.971C758.758 540.971 789.635 510.091 789.635 472.003C789.634 433.915 758.758 403.038 720.67 403.038H429.939C404.955 403.038 388.623 391.886 373.994 373.623L277.349 252.966C262.194 234.045 275.664 205.996 299.905 205.995H720.67Z M396.605 720.706C407.798 705.406 430.443 704.843 442.381 719.568L503.816 797.018H502.786L535.569 838.934C548.074 854.358 549.943 877.191 538.047 893.09L476.638 972.545C465.692 986.707 448.803 995 430.903 995H242.276C218.18 995 204.665 967.248 219.523 948.278L337.992 797.018H337.923L396.605 720.706Z" />
  </svg>
);

const RadixIcon = () => (
  <svg {...svgBase} viewBox="4 0 17 25">
    <path d="M12 25a8 8 0 1 1 0-16v16zM12 0H4v8h8V0zM17 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  </svg>
);

const BaseUiIcon = () => (
  <svg {...svgBase} viewBox="0 0 17 24">
    <path d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z" />
    <path d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z" />
  </svg>
);

const headlessIcon = (href: string): ReactNode => {
  if (href.includes("radix-ui.com")) return <RadixIcon />;
  if (href.includes("base-ui.com")) return <BaseUiIcon />;
  return <ReactAriaIcon />;
};

type DocumentLinkProps = {
  href: string;
  icon: ReactNode;
  label: string;
};

const DocumentLink = ({ href, icon, label }: DocumentLinkProps) => (
  <a
    className={LINK_CLASS}
    href={href}
    target="_blank"
    rel="noreferrer"
    style={linkStyle}
  >
    {icon}
    {label}
  </a>
);

type SourceLinksProps = {
  source: string;
  style: string;
  headless?: string;
  storybook?: string;
};

export const SourceLinks = ({
  source,
  style,
  headless,
  storybook,
}: SourceLinksProps) => (
  <Flex align="center" wrap="wrap" gap="md" style={rowStyle}>
    <DocumentLink href={source} icon={<GithubIcon />} label="Source" />
    <DocumentLink href={style} icon={<GithubIcon />} label="Style" />
    {storybook ? (
      <DocumentLink
        href={storybook}
        icon={<StorybookIcon />}
        label="Storybook"
      />
    ) : undefined}
    {headless ? (
      <DocumentLink
        href={headless}
        icon={headlessIcon(headless)}
        label="Headless"
      />
    ) : undefined}
  </Flex>
);

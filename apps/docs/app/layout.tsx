import "./globals.css";

import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";

export interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = (props: Readonly<RootLayoutProps>) => {
  const { children } = props;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider
          theme={{
            attribute: ["class", "data-theme"],
            defaultTheme: "dark",
            enableSystem: false,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;

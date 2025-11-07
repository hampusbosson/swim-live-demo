"use client";

import { ThemeProvider } from "next-themes";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "@/lib/apollo";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ThemeProvider>
  );
}

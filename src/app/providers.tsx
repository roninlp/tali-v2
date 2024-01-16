import { TRPCReactProvider } from "@/trpc/react";
import { cookies } from "next/headers";
import { type ReactNode } from "react";
import { ThemeProvider } from "./_components/theme-provider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <TRPCReactProvider cookies={cookies().toString()}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </TRPCReactProvider>
  );
};

export default Providers;

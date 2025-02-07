"use client";
import { SessionProvider } from "next-auth/react";
import { OktoProvider } from "@okto_web3/react-sdk";
import type { Hash, Hex } from "@okto_web3/core-js-sdk/types";
import React from "react";
import { Session } from "next-auth";

interface AppProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

const config = {
  environment: "sandbox" as const,
  vendorPrivKey: (process.env.NEXT_PUBLIC_VENDOR_PRIVATE_KEY || '') as Hash,
  vendorSWA: (process.env.NEXT_PUBLIC_VENDOR_SWA || '') as Hex,
};

function AppProvider({ children, session }: AppProviderProps) {
  return (
    <SessionProvider session={session}>
      <OktoProvider config={config}>
        {children}
      </OktoProvider>
    </SessionProvider>
  );
}

export default AppProvider;
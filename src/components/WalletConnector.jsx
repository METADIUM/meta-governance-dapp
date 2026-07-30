// Reown AppKit (구 @web3modal) + wagmi 2
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { defineChain } from "viem";
import { WagmiProvider } from "wagmi";

import { CURRENT_SPEC, PROJECT_ID } from "../constants";

export const META = defineChain(CURRENT_SPEC);

const networks = [META];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: PROJECT_ID
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: PROJECT_ID,
  defaultNetwork: META,
  metadata: {
    name: "Metadium Governance",
    description: "Metadium Governance",
    url: window.location.origin,
    icons: [`${window.location.origin}/favicon.ico`]
  },
  themeVariables: { "--w3m-z-index": 101 }
});

const queryClient = new QueryClient();

const WalletConnector = ({ children }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletConnector;

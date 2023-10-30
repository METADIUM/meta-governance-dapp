import React from "react";
// WalletConnect
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { CURRENT_SPEC, PROJECT_ID } from "../constants";
// import { mainnet } from "wagmi/chains";

export const META = {
  ...CURRENT_SPEC,
};

const chains = [META];
const projectId = PROJECT_ID;

const { publicClient } = configureChains(chains, [
  w3mProvider({ projectId }),
  publicProvider(),
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 2, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const WalletConnector = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      {children}
      {/* Header z-index is 100 */}
      <Web3Modal
        defaultChain={META}
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeVariables={{ "--w3m-z-index": 101 }}
      />
    </WagmiConfig>
  );
};

export default WalletConnector;

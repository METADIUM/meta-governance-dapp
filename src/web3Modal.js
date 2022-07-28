import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { chainInfo } from "./web3";

let web3Modal;

const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      rpc: chainInfo.rpcUrls,
      appName: "Wemix Governance dApp", // Required
      // infuraId: "f76653c7c7c649f2971203b4ace1450b", // Required unless you provide a JSON RPC url; see `rpc` below3
    },
  },
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        [parseInt(chainInfo.chainId, 16)]: chainInfo.rpcUrls,
      },
      // infuraId: "f76653c7c7c649f2971203b4ace1450b", // required
    },
  },
};

const getWeb3Modal = () => {
  web3Modal = new Web3Modal({
    // cacheProvider: true, // optional
    providerOptions, // required
  });
};

export { getWeb3Modal, web3Modal };

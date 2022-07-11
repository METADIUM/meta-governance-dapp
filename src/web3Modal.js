import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";

const rpcUrls = process.env.REACT_APP_NETWORK_RPC_URLS;
let web3Modal;

const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      rpc: rpcUrls,
      appName: "Wemix Governance", // Required
      // infuraId: "f76653c7c7c649f2971203b4ace1450b", // Required unless you provide a JSON RPC url; see `rpc` below3
    },
  },
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        1112: rpcUrls,
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

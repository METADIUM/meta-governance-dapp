import React from "react";
import { Button } from "antd";
import { web3Instance } from "../web3";
import { web3Modal } from "../web3Modal";
import { walletTypes } from "../constants";

const WalletPage = ({ onLogin, setWalletModal }) => {
  const alertInstall = () => {
    alert("Metamask extension required");
  };

  const getProvider = async (walletType) => {
    let provider;

    switch (walletType) {
      case walletTypes.META_MASK:
        // check for installed extension
        if (window.ethereum) {
          // check if there are multiple extensions
          if (window.ethereum.providers) {
            // search metamask provider
            let noMetaMask = true;
            window.ethereum.providers.forEach((item) => {
              if (item.isMetaMask) {
                provider = item;
                noMetaMask = false;
              }
            });
            if (noMetaMask) alertInstall();
          } else {
            // There is only one extension
            // check if it is a metamask
            if (window.ethereum.isMetaMask) {
              provider = window.ethereum;
            } else {
              alertInstall();
            }
          }
        } else {
          alertInstall();
        }
        break;
      default:
        provider = await web3Modal.connectTo(walletType);
    }

    return provider;
  };

  const setProvider = async (walletType) => {
    const newProvider = await getProvider(walletType);

    web3Instance.web3.setProvider(newProvider);
    await onLogin(walletType);
    console.log("Set new Provider!", newProvider);
  };

  return (
    <div>
      <Button onClick={() => setProvider(walletTypes.META_MASK)}>
        MetaMask
      </Button>
      <Button onClick={() => setProvider(walletTypes.WALLET_CONNECT)}>
        WalletConnect
      </Button>
      <Button onClick={() => setProvider(walletTypes.COIN_BASE)}>
        Coinbase Wallet
      </Button>
      <Button onClick={() => setWalletModal()}>Close</Button>
    </div>
  );
};

export default WalletPage;

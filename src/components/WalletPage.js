import React, { useState } from "react";
import { Button } from "antd";
import { web3Instance } from "../web3";
import { web3Modal } from "../web3Modal";
import { walletTypes } from "../constants";
import { ErrModal } from "./Modal";

const WalletPage = ({ onLogin, setWalletModal }) => {
  const wallets = web3Modal.userOptions;

  const [errVisible, setErrVisible] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [errTitle, setErrTitle] = useState("Error");

  const closeErrModal = () => {
    setErrVisible(false);
    setErrMsg("");
  };

  const getProvider = async (walletType) => {
    let provider;

    switch (walletType) {
      case walletTypes.META_MASK:
        // check if there are multiple extensions
        if (window.ethereum.providers) {
          // search metamask provider
          window.ethereum.providers.forEach((item) => {
            if (item.isMetaMask) {
              provider = item;
            }
          });
        } else {
          // There is only one extension
          provider = window.ethereum;
        }
        break;
      default:
        provider = await web3Modal.connectTo(walletType);
    }

    return provider;
  };

  const setProvider = async (walletType) => {
    const newProvider = await getProvider(walletType);
    if (!newProvider) {
      console.log("Can't set a new Provider!");
      return;
    }

    newProvider.on("accountsChanged", function (accounts) {
      alert("A change", accounts);
    });
    newProvider.on("chainChanged", function (chainId) {
      alert("chain change", chainId);
    });
    newProvider.on("disconnect", function (code, reason) {
      alert("disconnect", code, reason);
    });

    web3Instance.web3.setProvider(newProvider);
    await onLogin(walletType);
    console.log("Set a new Provider!", newProvider);
  };

  const ConnectButton = ({ wallet, index, size = "30px" }) => {
    if (
      index === 0 &&
      wallet.name !== "MetaMask" &&
      wallet.name !== "WalletConnect"
    ) {
      return <></>;
    }

    return (
      <Button size={"large"} onClick={() => setProvider(wallet.id)}>
        <img
          src={wallet.logo}
          alt="wallet img"
          style={{ width: size, height: size, marginRight: "10px" }}
        />
        <p>{wallet.name}</p>
      </Button>
    );
  };

  return (
    <div>
      {wallets.map((wallet, index) => (
        <ConnectButton key={index} wallet={wallet} index={index} />
      ))}
      <Button onClick={() => setWalletModal()}>Close</Button>

      <ErrModal
        netName={web3Instance.netName}
        title={errTitle}
        err={errMsg}
        visible={errVisible}
        coloseErrModal={closeErrModal}
      />
    </div>
  );
};

export default WalletPage;

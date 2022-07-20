import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { chainInfo, web3Instance } from "../web3";
import { web3Modal } from "../web3Modal";
import { walletTypes } from "../constants";
import "./style/style.css";
import { ErrModal } from "./Modal";

const WalletPage = ({
  onLogin,
  onLogout,
  setWalletModal,
  updateAccountData,
  nowWalletType,
  provider,
  setProvider,
}) => {
  const wallets = web3Modal.userOptions;
  const {
    chainId,
    chainName,
    rpcUrls,
    blockExplorerUrls,
    name,
    decimals,
    symbol,
  } = chainInfo;

  const [errVisible, setErrVisible] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [errTitle, setErrTitle] = useState("Error");

  const openErrModal = (err) => {
    setErrVisible(true);
    setErrMsg(err);
  };

  const closeErrModal = () => {
    setErrVisible(false);
    setErrMsg("");
  };

  // Adding WEMIX network to wallet
  // Also includes network change when the current network is different
  const addWemixNetwork = async (provider) => {
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId,
          chainName,
          rpcUrls: [rpcUrls],
          blockExplorerUrls: [blockExplorerUrls],
          nativeCurrency: { name, decimals, symbol },
        },
      ],
    });
  };

  const getProvider = async (walletType) => {
    let provider_tmp;
    try {
      switch (walletType) {
        case walletTypes.META_MASK:
          // check if there are multiple extensions
          if (window.ethereum.providers) {
            // search metamask provider
            window.ethereum.providers.forEach((item) => {
              if (item.isMetaMask) {
                provider_tmp = item;
              }
            });
          } else {
            // There is only one extension
            provider_tmp = window.ethereum;
          }
          break;
        default:
          provider_tmp = await web3Modal.connectTo(walletType);
      }

      await addWemixNetwork(provider_tmp);
    } catch (err) {
      openErrModal(err.message);
      return;
    }

    return provider_tmp;
  };

  const changeProvider = async (walletType = nowWalletType) => {
    const newProvider = await getProvider(walletType);
    if (!newProvider) {
      console.log("Can't set a new Provider!");
      return;
    }

    web3Instance.web3.setProvider(newProvider);
    await onLogin(walletType);
    setProvider(newProvider);
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
      <div className="wallet-list" onClick={() => changeProvider(wallet.id)}>
        <img
          src={wallet.logo}
          alt="wallet img"
          style={{ width: size, height: size, marginRight: "10px" }}
        />
        <p>{wallet.name}</p>
      </div>
    );
  };

  const handleAccountsChanged = async (accounts) => {
    alert("change account");
    await updateAccountData(accounts[0]);
  };

  const handleChainChanged = async (chainId) => {
    alert("change chain");
    const nowChainId = web3Instance.web3.utils.hexToNumber(chainId);

    if (chainInfo.chainId == nowChainId) {
      await changeProvider();
    } else {
      openErrModal("Your wallet is not on the right network.");
      onLogout();
    }
  };

  const handleDisconnect = () => {
    alert("disconnect");
  };

  useEffect(() => {
    console.log(1, provider);
    if (provider && provider.on) {
      console.log(2, provider);
      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        console.log(3, provider);
        if (provider.removeListener) {
          console.log(4, provider);
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {wallets.map((wallet, index) => (
        <ConnectButton key={index} wallet={wallet} index={index} />
      ))}
      <div style={{ marginTop: "48px", marginBottom: "40px", width: "100%" }}>
        <h3>Connectable with WEMIX Wallet App</h3>
        <p>1. Select WalletConnect</p>
        <p>2. Use the QR scan fuction of the WEMIX Wallet App main.</p>
      </div>
      <Button
        className="walletlist-cancel-btn"
        onClick={() => setWalletModal()}
      >
        Cancel
      </Button>

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

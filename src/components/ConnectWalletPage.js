import React from "react";
import { Button } from "antd";
import { web3Modal } from "../web3Modal";

const ConnectWalletPage = ({ changeProvider, setWalletModal }) => {
  const wallets = web3Modal.userOptions;

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
    </div>
  );
};

export default ConnectWalletPage;

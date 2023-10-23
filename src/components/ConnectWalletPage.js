import React from "react";
import { Button } from "antd";
// import { web3Modal } from "../web3Modal";

// Not Use
const ConnectWalletPage = ({ changeProvider, setWalletModal }) => {
  const wallets = [];

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
      <div style={{ marginTop: "20px", marginBottom: "20px", width: "100%" }}>
        <h3>[MetaMask, CoinBase Wallet]</h3>
        <p>Metamask and Coinbase Wallet are accessible through extensions.</p>
        <br />
        <h3>[Wallet Connect]</h3>
        <p>
          Wallet Connect supports mobile wallets that support the WEMIX 3.0
          network.
        </p>
        <p>*Connectable with WEMIX Wallet App</p>
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

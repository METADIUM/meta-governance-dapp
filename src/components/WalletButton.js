import React from "react";
import { Button } from "antd";
import { web3Modal } from "../web3Modal";

export default ({ isLogin, onLogout, onMenuClick }) => {
  const disConnect = () => {
    web3Modal.clearCachedProvider();
    localStorage.clear();
    onLogout();
  };

  const connectWallet = async () => {
    onMenuClick({ key: "0" });
  };

  return (
    <>
      {!isLogin ? (
        <Button
          type="primary"
          style={{ marginLeft: "10px" }}
          onClick={connectWallet}
        >
          Connect Wallet
        </Button>
      ) : (
        <Button
          type="primary"
          style={{ marginLeft: "10px" }}
          onClick={disConnect}
        >
          Disconnect Wallet
        </Button>
      )}
    </>
  );
};

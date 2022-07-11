import React from "react";
import { Button } from "antd";
import { web3Modal } from "../web3Modal";

export default ({ isLogin, onLogout, connectWallet }) => {
  const disConnect = () => {
    web3Modal.clearCachedProvider();
    localStorage.clear();
    onLogout();
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

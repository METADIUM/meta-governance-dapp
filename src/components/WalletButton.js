import { Button } from "antd";
import React from "react";

// import { web3Modal } from "../web3Modal";
import "./style/style.css";
import { loginAcc } from "../util";
export default ({
  isLogin,
  setWalletModal,
  defaultAccount,
  nowWalletType,
  setDisConnectView
}) => {
  const wallets = [];

  const getWallet = wallets.find((v) => v.id === nowWalletType);

  return (
    <>
      {!isLogin ? (
        <Button type='primary' className='connect-btn' onClick={setWalletModal}>
          Wallet Connect
        </Button>
      ) : (
        <>
          <Button
            type='primary'
            style={{
              marginLeft: "12px",
              border: "#ffffff solid 2px",
              background: "#000000"
            }}
            onClick={() => setDisConnectView(true)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0"
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "8px",
                  padding: "0 12px"
                }}
              >
                <img
                  style={{
                    width: "20px",
                    height: "20px",
                    left: "0"
                  }}
                  src={getWallet.logo}
                  alt='logo'
                />
              </div>

              <span> {defaultAccount && loginAcc(defaultAccount)}</span>
            </div>
          </Button>
        </>
      )}
    </>
  );
};

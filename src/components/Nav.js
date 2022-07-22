import React, { useEffect, useState } from "react";
import { Button, Row, Menu, Input, Affix } from "antd";

import "./style/style.css";
import WalletButton from "./WalletButton";
import { ConnectWalletModal, DisConnectWalletModal, ErrModal } from "./Modal";
import { web3Modal } from "../web3Modal";
import { chainInfo, web3Instance } from "../web3";
import { walletTypes } from "../constants";
import ConnectWalletPage from "./ConnectWalletPage";

const TopNav = ({
  defaultAccount,
  nowWalletType,
  netName,
  nav,
  isMember,
  myBalance,
  myLockedBalance,
  onMenuClick = (f) => f,
  getStakingModal = (f) => f,
  isLogin,
  onLogin,
  onLogout,
  walletVisible,
  setWalletModal,
  updateAccountData,
  stakingWatch,
}) => {
  const [disConnectView, setDisConnectView] = useState(false);
  const [provider, setProvider] = useState(null);
  const [errVisible, setErrVisible] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const errTitle = "Error";

  const {
    chainId,
    chainName,
    rpcUrls,
    blockExplorerUrls,
    name,
    decimals,
    symbol,
  } = chainInfo;

  const openErrModal = (err) => {
    setErrVisible(true);
    setErrMsg(err);
  };

  const closeErrModal = () => {
    setErrVisible(false);
    setErrMsg("");
  };

  const onDisConnect = () => {
    web3Modal.clearCachedProvider();
    localStorage.clear();
    setDisConnectView(false);
    setProvider(null);
    onLogout();
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
      if (walletType === "walletconnect") {
        provider_tmp.close();
      }
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

  const handleAccountsChanged = async (accounts) => {
    await updateAccountData(accounts[0]);
  };

  const handleChainChanged = async (chainId) => {
    if (chainInfo.chainId === chainId) {
      await changeProvider();
    } else {
      openErrModal("Your wallet is not on the right network.");
      if (nowWalletType === "walletconnect") {
        provider.close();
      } else {
        onLogout();
      }
    }
  };

  const handleDisconnect = () => {
    if (isLogin) onLogout();
  };
  useEffect(() => {
    if (provider && provider.on) {
      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  return (
    <Row className="container flex">
      <div className="header-logo flex flex-center-horizontal">
        <img src={`/img/logo_header_${netName}.png`} alt="" />
      </div>
      <div className={"header-menu center-vertical " + netName}>
        <Menu
          className="flex flex-center-horizontal"
          onClick={onMenuClick}
          selectedKeys={[nav]}
          mode={"horizontal"}
        >
          <Menu.Item key="1" className={"text-large text-bold " + netName}>
            Authority
          </Menu.Item>
          <Menu.Item key="2" className={"text-large text-bold " + netName}>
            Voting
          </Menu.Item>
          {isMember && (
            <Menu.Item key="3" className={"text-large text-bold " + netName}>
              MyInfo
            </Menu.Item>
          )}
        </Menu>
      </div>
      <div className="header-staking flex flex-center-horizontal flex-end-vertical flex-full">
        {isLogin && (
          <>
            <div className="flex flex-full flex-column flex-center-vertical">
              <p className={"staked " + netName}>Staked {myBalance} WEMIX</p>
              <p className={"wemix " + netName}>
                (Locked {myLockedBalance} WEMIX)
              </p>
            </div>
            <Button
              className={"btn-grid-primary " + netName}
              type="primary"
              onClick={getStakingModal}
            >
              WEMIX Staking
            </Button>
          </>
        )}
        <WalletButton
          isLogin={isLogin}
          setWalletModal={setWalletModal}
          defaultAccount={defaultAccount}
          nowWalletType={nowWalletType}
          setDisConnectView={setDisConnectView}
        />
        <ConnectWalletModal
          visible={walletVisible}
          setWalletModal={setWalletModal}
        >
          <ConnectWalletPage
            changeProvider={changeProvider}
            setWalletModal={setWalletModal}
          />
        </ConnectWalletModal>
        <DisConnectWalletModal
          onDisConnect={onDisConnect}
          visible={disConnectView}
          setDisConnectView={setDisConnectView}
        />

        <ErrModal
          netName={web3Instance.netName}
          title={errTitle}
          err={errMsg}
          visible={errVisible}
          coloseErrModal={closeErrModal}
        />
      </div>
    </Row>
  );
};

// TODO Wemix apply form 생기면 아래 코드 수정 필요
const SubHeader = ({
  netName,
  placeholder,
  condition = true,
  btnText,
  selectedMenu,
  btnIcon = null,
  loading = false,
  searchFunction = (f) => f,
  btnFunction = (f) => f,
}) => (
  <div className="sub-header">
    <div className={"functionDiv flex container " + netName}>
      <Input.Search
        className="flex-full"
        placeholder={placeholder}
        onChange={searchFunction}
        enterButton
      />
      {selectedMenu !== "1" && (
        <Button
          className="apply_proposal_Btn flex flex-center-horizontal"
          disabled={!condition}
          onClick={(e) => btnFunction()}
          loading={loading}
        >
          <span>{btnIcon}</span>
          <span className="text_btn">{btnText}</span>
        </Button>
      )}
    </div>
  </div>
);

const SubNav = ({ position, onClickSubMenu = (f) => f }) => (
  <Affix>
    <div className="sub-menu flex flex-center-vertical">
      <Menu
        onClick={onClickSubMenu}
        selectedKeys={[position]}
        mode="horizontal"
      >
        <Menu.Item key="active">Active</Menu.Item>
        <Menu.Item key="proposal">Proposal</Menu.Item>
        <Menu.Item key="finalized">Finalized</Menu.Item>
      </Menu>
    </div>
  </Affix>
);

const FootNav = ({ netName, onClickFootIcon }) => (
  <Row className="container flex">
    <p>WEMIX PTE. LTD. © WEMIX PTE. LTD. All Rights Reserved.</p>
    <div className="flex flex-full">
      <Button className="btn-img" onClick={onClickFootIcon}>
        <img src="/img/wemix_footer.png" alt="wemix" key="wemix" />
      </Button>
      <Button className="btn-img" onClick={onClickFootIcon}>
        <img
          src={`/img/explorer_footer_${netName}.png`}
          alt="explorer"
          key="explorer"
        />
      </Button>
      <Button className="btn-img" onClick={onClickFootIcon}>
        <img src="/img/github_footer.png" alt="github" key="github" />
      </Button>
    </div>
  </Row>
);

export { TopNav, SubHeader, SubNav, FootNav };

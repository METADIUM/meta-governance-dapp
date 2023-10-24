import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "antd";
import { AccessFailedModal } from "./components";
import Loading from "./Loading";

import { GovInitCtx } from "./contexts/GovernanceInitContext";

import "./App.css";
import "./components/style/style.css";
import "./assets/scss/common.scss";

import i18n from "./i18n";

import OGHeader from "./components/OGHeader";
import { useAuth } from "./hooks/useAuth";
import { usePrevious } from "./hooks/usePrevious";
import { web3Instance } from "./web3";
import { ModalContext } from "./contexts/ModalContext";

const { Content } = Layout;

export const withLocation = (Component) => {
  return (props) => <Component {...props} location={useLocation()} />;
};

const App = ({ children }) => {
  const { getErrModal } = useContext(ModalContext);
  const { isWeb3Loaded, isContractReady, accessFailMsg } =
    useContext(GovInitCtx);
  const {
    isMember,
    isStaker,
    address,
    myBalance,
    lockedBalance,
    isLoggedIn,
    chain,
    onLogin,
    onLogout,
    updateAccountData,
    setStakingEventsWatch,
  } = useAuth();
  // console.log(isMember, myBalance, lockedBalance);
  const { pathname } = useLocation();
  const prev = usePrevious(chain);

  const _chainId = chain?.id;
  const _prevChainId = prev.current?.id;

  // 다국어 처리 새로고침 시에도 적용되게 수정
  useEffect(() => {
    const language = window.localStorage.getItem("language");
    i18n.changeLanguage(language);
  }, []);

  useEffect(() => {
    const isChanged = _chainId !== _prevChainId;
    if (!!_chainId && !!_prevChainId && isChanged) {
      onLogout();
    }
  }, [_chainId, _prevChainId]);

  useEffect(() => {
    if (address && web3Instance) {
      updateAccountData(address);
    }
  }, [address, web3Instance]);

  const checkPath =
    pathname === "/wait" ||
    pathname === "/governance" ||
    pathname === "/wait/" ||
    pathname === "/governance/" ||
    pathname === "/governance/detail" ||
    pathname === "/history" ||
    pathname === "/history/";

  return (
    <>
      <AccessFailedModal visible={!!accessFailMsg} message={accessFailMsg} />
      {(isContractReady && isWeb3Loaded) ||
      window.navigator.userAgent === "ReactSnap" ? (
        checkPath ? (
          <>
            {React.cloneElement(children, {
              getErrModal,
              isMember,
              isLoggedIn,
              address,
            })}
          </>
        ) : (
          <>
            {/* <div className='flex-column voting-wrap'> */}
            <OGHeader />
            <Content>
              {isWeb3Loaded ? (
                <div>
                  {React.cloneElement(children, {
                    getErrModal,
                    isMember,
                    isLoggedIn,
                    address,
                  })}
                </div>
              ) : (
                getErrModal(
                  "This is an unknown network. Please connect to WEMIX network",
                  "Connecting Error"
                )
              )}
            </Content>
          </>
        )
      ) : (
        <Loading />
      )}
    </>
  );
};

export default withLocation(App);

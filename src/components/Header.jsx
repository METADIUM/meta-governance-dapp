import React, { useState, useEffect, useCallback, useContext } from "react";
import cn from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { throttle } from "lodash";
import { addCommasToNumber } from "../util";
import { AuthCtx } from "../contexts/AuthContext";
import { GovInitCtx } from "../contexts/GovernanceInitContext";
import { DisConnectWalletModal, ErrModal } from "./Modal";
import { web3Instance } from "../web3";
import { StakingModal } from "./Modal";

import { ReactComponent as IconClose } from "../assets/images/ico_close.svg";
import { ReactComponent as IconMenu } from "../assets/images/ico_menu.svg";
import { loginAcc } from "../util";
import Button from "./voting/Button";
import { ModalContext } from "../contexts/ModalContext";
import HeaderLogo from "./HeaderLogo";
import HeaderMenu from "./HeaderMenu";
const Header = () => {
  const { isWeb3Loaded, isContractReady } = useContext(GovInitCtx);

  const navigate = useNavigate();
  const [offset, setOffset] = useState({
    width: 0,
    height: 0,
  });
  const resize = useCallback(() => {
    setOffset({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  const { getErrModal } = useContext(ModalContext);
  const {
    address,
    isMember,
    isStaker,
    lockedBalance,
    myBalance,
    isLoggedIn: isConnect,
    onLogin,
    onLogout,
    updateAccountData,
    setStakingEventsWatch,
  } = useContext(AuthCtx);
  const [isShowStakingModal, setIsShowStakingModal] = useState(false);

  // address, web3Instance가 있다면 ctx 업데이트
  useEffect(() => {
    if (address && web3Instance) {
      updateAccountData(address);
    }
  }, [address, updateAccountData]);
  // ---------- wallet modal state start ----------
  const [isGnbOpen, setIsGnbOpen] = useState(false);
  const [disConnectView, setDisConnectView] = useState(false);
  const [errVisible, setErrVisible] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  // ---------- wallet modal state end ----------

  function resizeVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  useEffect(() => {
    resize();
    window.addEventListener("resize", throttle(resize, 200));
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  const onClickToggle = () => setIsGnbOpen((prev) => !prev);
  // const onMenuClick = () => {};
  // ---------- wallet modal useEffect stsart ----------

  // check login data & auto login
  useEffect(() => {
    resizeVh();
    window.addEventListener("resize", resizeVh);
    return () => {
      window.removeEventListener("resize", resizeVh);
    };
  }, []);

  const onDisConnect = () => {
    setDisConnectView(false);
    onLogout();
  };

  const handleAccountsChanged = async (accounts) => {
    navigate(0);
    await updateAccountData(accounts[0], true);
  };

  const openErrModal = (err) => {
    setErrVisible(true);
    setErrMsg(err);
  };

  const closeErrModal = () => {
    setErrVisible(false);
    setErrMsg("");
  };

  // ---------- wallet modal method end ----------

  return (
    <header className={cn("header")}>
      {offset.width > 1023 ? (
        <>
          <div className="header-logo-wrap">
            <HeaderLogo />
            <HeaderMenu
              isConnect={isConnect}
              isMember={isMember}
              isStaker={isStaker}
              setIsGnbOpen={setIsGnbOpen}
            />
          </div>
          <div className={cn("header-utils")}>
            <div className={cn("header-my-info")}>
              {isConnect ? (
                <>
                  <dl>
                    <div>
                      <dt>Locked</dt>
                      <dd>{addCommasToNumber(lockedBalance)} META </dd>
                    </div>
                    <div>
                      <dt>Staked</dt>
                      <dd>{addCommasToNumber(myBalance)} META </dd>
                    </div>
                  </dl>
                  <div className="btns-wrap">
                    <Button
                      text="META Staking"
                      type="outline"
                      size="sm"
                      onClick={() => {
                        setIsShowStakingModal(true);
                      }}
                    />
                    <Button
                      type="outline"
                      size="sm"
                      text={address && loginAcc(address)}
                      onClick={() => setDisConnectView(true)}
                    />
                  </div>
                </>
              ) : (
                <Button
                  type="outline"
                  size="sm"
                  text="Connect Wallet"
                  onClick={onLogin}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        // mobile toggle open
        <>
          <div className="header-logo-wrap">
            <HeaderLogo />
            <div className={cn("mobile-gnb", isGnbOpen && "show")}>
              <div className={cn("gnb-inner")}>
                <button onClick={onClickToggle} className={cn("btn-close")}>
                  <IconClose />
                </button>
                <div className={cn("header-content")}>
                  {console.log("HeaderMenu", isMember, isStaker)}
                  <HeaderMenu
                    isConnect={isConnect}
                    isMember={isMember}
                    isStaker={isStaker}
                    setIsGnbOpen={setIsGnbOpen}
                  />
                  <div className={cn("header-my-info")}>
                    {isConnect && (
                      <dl>
                        <div>
                          <dt>Locked</dt>
                          <dd>{lockedBalance} META</dd>
                        </div>
                        <div>
                          <dt>Staked</dt>
                          <dd>{myBalance} META</dd>
                        </div>
                      </dl>
                    )}
                    {isConnect ? (
                      <div className="btns-wrap">
                        <Button
                          text="WEMIX Staking"
                          type="outline"
                          size="sm"
                          onClick={() => {
                            setIsShowStakingModal(true);
                          }}
                        />

                        <Button
                          type="outline"
                          size="sm"
                          text={address && loginAcc(address)}
                          onClick={() => setDisConnectView(true)}
                        />
                      </div>
                    ) : (
                      <Button
                        type="outline"
                        size="sm"
                        text="Connect Wallet"
                        onClick={onLogin}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="header-utils">
            <button onClick={onClickToggle}>
              <IconMenu />
            </button>
          </div>
        </>
      )}
      {isContractReady && isWeb3Loaded && (
        <>
          <DisConnectWalletModal
            onDisConnect={onDisConnect}
            visible={disConnectView}
            setDisConnectView={setDisConnectView}
          />
          <ErrModal
            netName={web3Instance.netName}
            title="Error"
            err={errMsg}
            visible={errVisible}
            coloseErrModal={closeErrModal}
          />
          <StakingModal
            defaultAccount={address}
            isMember={isMember}
            accountBalance={{
              balance: myBalance,
              lockedBalance: lockedBalance,
            }}
            stakingModalVisible={isShowStakingModal}
            scrollType={false}
            setStakingEventsWatch={setStakingEventsWatch}
            setStakingModalVisible={setIsShowStakingModal}
            getErrModal={getErrModal}
          />
        </>
      )}
    </header>
  );
};

export default Header;

import React, { useState, useEffect, useCallback, useRef } from "react";
import cn from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { useLocation } from "react-router-dom";
import { throttle } from "lodash";
import { addCommasToNumber } from "../util";

import { ReactComponent as IconSymbol } from "../assets/images/header-logo-white.svg";
import { DisConnectWalletModal, ErrModal } from "./Modal";
import { web3Instance } from "../web3";

import { ReactComponent as IconClose } from "../assets/images/ico_close.svg";
import { ReactComponent as IconMenu } from "../assets/images/ico_menu.svg";
import { loginAcc } from "../util";
import Button from "./voting/Button";

const HeaderCopy = ({
  isMember,
  isStaker,
  isConnect,
  myLockedBalance,
  myBalance,
  onLogin,
  onLogout,
  getStakingModal,
  updateAccountData,
  defaultAccount,
}) => {
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

  const navigate = useNavigate();
  // 확인 후 삭제 : Mira
  const [isVotingModal, setIsVotingModal] = useState(false);
  const filterData = ["Deposit Staking", "3days", "4days", "5days"];
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");

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

  const handleDisconnect = () => {
    // if (isLogin) onLogout();
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
            {/* <Menu
              className={cn("header-gnb", isConnect && isMember && "connect")}
            >
              {menuComponent}
            </Menu> */}
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
                      <dd>{addCommasToNumber(myLockedBalance)} META </dd>
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
                      onClick={getStakingModal}
                    />
                    <Button
                      type="outline"
                      size="sm"
                      text={defaultAccount && loginAcc(defaultAccount)}
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
                  {/* <Menu
                    className={cn(
                      "header-gnb",
                      isConnect && isMember && "connect",
                    )}
                  >
                    {menuComponent}
                  </Menu> */}
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
                          <dd>{myLockedBalance} WEMIX</dd>
                        </div>
                        <div>
                          <dt>Staked</dt>
                          <dd>{myBalance} WEMIX</dd>
                        </div>
                      </dl>
                    )}
                    {isConnect ? (
                      <div className="btns-wrap">
                        <Button
                          text="WEMIX Staking"
                          type="outline"
                          size="sm"
                          onClick={getStakingModal}
                        />

                        <Button
                          type="outline"
                          size="sm"
                          text={defaultAccount && loginAcc(defaultAccount)}
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
    </header>
  );
};

// TODO:  path는 상황에 맞게 넣어주세요. voting, myinfo 페이지에 layout 내용 넣을 때 props로 activate="menu-voting" or activate="menu-myinfo" 이런식으로 메뉴 키값에 맞게 넣어주세요.
const menuList = [
  {
    title: "Authority",
    path: "/",
    key: "menu-authority",
    onlyMember: false,
  },
  {
    title: "Voting",
    path: "/voting/list",
    key: "menu-voting",
    onlyMember: false,
  },
  {
    title: "My Info",
    path: "/my-info",
    key: "menu-myinfo",
    onlyMember: true,
  },
];

const HeaderMenu = ({ isConnect, isMember, isStaker, setIsGnbOpen }) => {
  const activeMenu = useRef("menu-authority");
  const location = useLocation();

  const onMenuClick = (key) => {
    activeMenu.current = key;
    // console.log(activeMenu.current);
    window.localStorage.removeItem("selectedTopic");
    setIsGnbOpen(false);
  };

  const menuComponent = menuList.map((menu) => {
    console.log(menu.onlyMember, 3);
    return menu.onlyMember ? (
      isMember && isStaker && (
        <Menu.Item
          key={menu.title}
          className={location.pathname === menu.path && "active"}
        >
          <Link to={menu.path} onClick={() => onMenuClick(menu.key)}>
            {menu.title}
          </Link>
        </Menu.Item>
      )
    ) : (
      <Menu.Item
        key={menu.title}
        className={location.pathname === menu.path && "active"}
      >
        <Link to={menu.path} onClick={() => onMenuClick(menu.key)}>
          {menu.title}
        </Link>
      </Menu.Item>
    );
  });

  return (
    <Menu className={cn("header-gnb", isConnect && isMember && "connect")}>
      {menuComponent}
    </Menu>
  );
};

export const HeaderLogo = () => {
  return (
    <h1 className={cn("header-logo")}>
      <Link to="/">
        <span className={cn("logo-symbol")}>
          <IconSymbol />
          <span className={cn("a11y")}>metadium governance</span>
        </span>
      </Link>
    </h1>
  );
};

export default HeaderCopy;

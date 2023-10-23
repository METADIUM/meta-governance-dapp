/* 23.05.30 수정: useRef 추가  */
import React, { useState, useEffect, useCallback, useRef } from "react";
import cn from "classnames/bind";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import { throttle } from "lodash";
import { Helmet } from "react-helmet";

/* 23.05.24 수정: 플렛폼 바로가기 메뉴 추가 */
import { CSSTransition } from "react-transition-group";
import BentoButton from "./bento-menu/BentoButton";
import BentoContents from "./bento-menu/BentoContents";

import { ReactComponent as IconFooterLogo } from "../assets/images/footer-logo-grey.svg";
import { ReactComponent as IconArrowBottom } from "../assets/images/ico_arrow_bottom.svg";
import { ReactComponent as IconLangEn } from "../assets/images/ico_lang_en.svg";
import { ReactComponent as IconLangKo } from "../assets/images/ico_lang_ko.svg";
import { ReactComponent as IconSymbol } from "../assets/images/logo_symbol_governance.svg";
import { ReactComponent as IconClose } from "../assets/images/ico_close.svg";
import { ReactComponent as IconMenu } from "../assets/images/ico_menu.svg";
import { ReactComponent as IconFamilyWemix } from "../assets/images/ico_family_wemix.svg";
import { ReactComponent as IconFamilyWemixPlay } from "../assets/images/ico_family_wemixPlay.svg";
import { ReactComponent as IconFamilyNile } from "../assets/images/ico_family_nile.svg";
import { ReactComponent as IconFamilyWemixFi } from "../assets/images/ico_family_wemixFi.svg";
import { ReactComponent as IconMedium } from "../assets/images/ic_medium.svg";
import { ReactComponent as IconTelegram } from "../assets/images/ic_telegram.svg";
import { ReactComponent as IconTwitter } from "../assets/images/ic_twitter.svg";
import { ReactComponent as IconYoutube } from "../assets/images/ico_youtube.svg";
import { ReactComponent as IconFacebook } from "../assets/images/ico_facebook.svg";
import { ReactComponent as IconFooterLangKo } from "../assets/images/ico_footer_lang_ko.svg";
import { ReactComponent as IconFooterLangEn } from "../assets/images/ico_footer_lang_en.svg";
import Header from "./Header";

const menuList = [
  {
    title: "40 WONDERS",
    path: "/",
    key: "menu-home",
  },
  {
    title: "WAIT Protocol",
    path: "/wait",
    key: "menu-wait",
  },
  {
    title: "WAIT Governance",
    path: "/governance",
    key: "menu-governance",
  },
];

export const familySites = [
  {
    name: "WEMIX",
    link: "https://www.wemix.com/",
    logo: <IconFamilyWemix />,
    descEN:
      "Welcome to the open-source programmable future of Web3 era. WEMIX3.0 is an experience-based, platform-driven and service-oriented decentralized blockchain protocol built as the foundation of a borderless mega-ecosystem.",
    descKR:
      "Web3 시대의 오픈 소스 프로그래밍 미래에 오신 걸 환영합니다. WEMIX3.0는 경계를 초월한 메가에코시스템을 기반으로 구축된 경험 기반, 플랫폼 중심 및 서비스 지향적인 탈중앙화된 블록체인 프로토콜입니다.",
  },
  {
    name: "WEMIX PLAY",
    link: "https://wemixplay.com/",
    logo: <IconFamilyWemixPlay />,
    descEN:
      "WEMIX PLAY is a mega blockchain gaming platform that supports the Web3 transformation of games.",
    descKR:
      "WEMIX PLAY는 게임의 Web3 트랜스포메이션을 지원하는 거대한 블록체인 게임 플랫폼입니다.",
  },
  {
    name: "NILE",
    link: "https://nile.io/",
    logo: <IconFamilyNile />,
    descEN:
      "NILE (NFT Is Life Evolution) is a DAO, NFT, and Life DApp platform that creates a new civilization based on blockchain.",
    descKR:
      "NILE(NFT Is Life Evolution)은 블록체인 기반의 새로운 문명을 만드는 DAO, NFT, Life Dapp 플랫폼입니다.",
  },
  {
    name: "WEMIX.FI",
    link: "https://wemix.fi/",
    logo: <IconFamilyWemixFi />,
    descEN:
      "WEMIX.Fi is the official Decentralized Finance (DeFi) platform of the WEMIX3.0 ecosystem providing exchange, deposit, asset management, and investment services.",
    descKR:
      "WEMIX.Fi는 WEMIX3.0 생태계에서의 가상자산의 교환, 예치, 관리 그리고 투자 서비스를 제공하는 공식 탈중앙화 금융 플랫폼입니다.",
  },
];

export const snsList = [
  {
    name: "Medium",
    link: "https://medium.com/wemix-communication",
    logo: <IconMedium />,
  },
  {
    name: "Telegram",
    link: "https://t.me/WEMIX_ANNouncement",
    logo: <IconTelegram />,
  },
  {
    name: "Twitter",
    link: "https://twitter.com/WemixNetwork",
    logo: <IconTwitter />,
  },
  {
    name: "Youtube",
    link: "https://www.youtube.com/channel/UCm7NfySSdy2ljrnh64cUJXA",
    logo: <IconYoutube />,
  },
  {
    name: "Facebook",
    link: "https://www.facebook.com/WEMIXBlockchain",
    logo: <IconFacebook />,
  },
];

const MenuComponent = () => {
  const location = useLocation();
  const pathName = `/${location.pathname.split("/")[1]}`;
  return menuList.map((menu) => (
    <li key={menu.title} className={cn(menu.path === pathName && "active")}>
      {/* 23.06.20 수정: 모바일 gnb 클릭 시 body lock 해제를 위한 클릭 이벤트 추가 */}
      <Link
        to={menu.path}
        onClick={() => {
          if (
            window.innerWidth < 1023 &&
            document.body.classList.contains("modal-open")
          ) {
            document.body.classList.remove("modal-open");
            document.body.removeAttribute("style");
          }
        }}
      >
        {menu.title}
      </Link>
    </li>
  ));
};

const LandingLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [isGnbOpen, setIsGnbOpen] = useState(false);
  const [familysiteVisible, setFamilysiteVisible] = useState(false);

  /* 23.05.30 수정: 모바일 GNB 관련 수정 코드 추가 */
  const [scrollTop, setScrollTop] = useState(0);
  const mobileGnbRef = useRef(null);

  const [offset, setOffset] = useState({
    width: 0,
    height: 0,
  });
  const resize = useCallback(() => {
    setOffset({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    /* 23.05.30 수정: 모바일 GNB 관련 수정 코드 추가 (리사이즈 시 스크롤 락 해지) */
    if (
      /* 23.06.20 수정: 모바일 메뉴바 노출에 따라 resize 이벤트 발생하여 동작 이상 발생하여 width 체크 구간 수정 */
      window.innerWidth > 1023 &&
      document.body.classList.contains("modal-open")
    ) {
      document.body.classList.remove("modal-open");
      document.body.removeAttribute("style");
    }
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", throttle(resize, 200));
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const changeLanguage = (lang) => {
    window.localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
    navigate(
      {
        pathname: window.location.pathname,
        search: `?lang=${lang}`,
      },
      { replace: true },
    );
  };

  // 다국어 처리 새로고침 시에도 적용되게 수정
  useEffect(() => {
    const language = window.localStorage.getItem("language");
    i18n.changeLanguage(language);
  }, []);

  useEffect(() => {
    // 현재 language가 ko일 경우는 제외 (렌더링 두번 됨)
    if (location.search === "?lang=ko" && i18n.language !== "ko") {
      changeLanguage("ko");
    }
  }, [location.search]);

  const handleLink = () => {
    navigate({
      pathname: "/voting/list",
    });
  };

  /* 23.05.30 수정: 모바일 GNB 오픈 시 스크롤 width 만큼 body padding 추가 */
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--vw",
      `${window.innerWidth - document.documentElement.clientWidth}px`,
    );
  }, []);

  return (
    <div className={cn("landing-wrap")}>
      <Helmet htmlAttributes={{ lang: i18n.language }} />
      <Header />
      {children}
      <footer className={cn("footer")}>
        <div className={cn("footer-inner")}>
          <div className={cn("footer-top")}>
            <div className={cn("footer-logo")}>
              <IconFooterLogo />
              <span className={cn("a11y")}>GOVERNANCE</span>
            </div>
            {offset.width > 1023 ? (
              <div className={cn("footer-familysite")}>
                <div className={cn("footer-familysite-title")}>
                  Family Sites
                </div>
                <ul className={cn("footer-familysite-list")}>
                  {familySites.map((familySite) => {
                    return (
                      <li key={familySite.name}>
                        {/* 2022.10.23 수정: fi 오픈에 따른 조건문 삭제 */}
                        <a
                          href={familySite.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={
                            i18n.language === "en"
                              ? "Open new window"
                              : "새창 열기"
                          }
                        >
                          {familySite.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className={cn("footer-familysite-mo")}>
                <Dropdown
                  overlayClassName="familysite-list-wrap"
                  overlay={
                    <ul className={cn("familysite-list")}>
                      {familySites.map((familySite) => {
                        return (
                          <li key={familySite.name}>
                            {/* 2022.10.23 수정: fi 오픈에 따른 조건문 삭제 */}
                            <a
                              href={familySite.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={
                                i18n.language === "en"
                                  ? "Open new window"
                                  : "새창 열기"
                              }
                            >
                              {familySite.name}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  }
                  trigger={["click"]}
                  visible={familysiteVisible}
                  onVisibleChange={setFamilysiteVisible}
                  placement="topRight"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  <button
                    type="button"
                    className={cn(
                      "familysite-title",
                      familysiteVisible && "active",
                    )}
                  >
                    <span>Family Sites</span>
                    <i>
                      <IconArrowBottom />
                    </i>
                  </button>
                </Dropdown>
              </div>
            )}
          </div>
          <div className={cn("footer-bottom")}>
            <div className={cn("footer-contact")}>
              <ul>
                <li>
                  <a
                    href="/policy/terms"
                    target="_self"
                    rel="noopener noreferrer"
                    title={
                      i18n.language === "en" ? "Open new window" : "새창 열기"
                    }
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/policy/privacy"
                    target="_self"
                    rel="noopener noreferrer"
                    title={
                      i18n.language === "en" ? "Open new window" : "새창 열기"
                    }
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/policy/cookie-policy"
                    target="_self"
                    rel="noopener noreferrer"
                    title={
                      i18n.language === "ko" ? "새창 열기" : "Open new window"
                    }
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/policy/california-privacy"
                    target="_self"
                    rel="noopener noreferrer"
                    title={
                      i18n.language === "ko" ? "새창 열기" : "Open new window"
                    }
                  >
                    California Privacy Statement
                  </a>
                </li>
                <li>
                  <a href="mailto:hi_there@wemix.com">Contact</a>
                </li>
                <li>
                  <div className={cn("lang-wrap")}>
                    {/* 22.11.15 수정 start: 언어 설정 UI 변경 */}
                    {/* 23.04.11 수정: 대체 텍스트 추가 */}
                    <button
                      type="button"
                      className={cn("btn-lang-change")}
                      onClick={() =>
                        changeLanguage(i18n.language === "ko" ? "en" : "ko")
                      }
                    >
                      {i18n.language === "en" ? (
                        <>
                          <span className={cn("a11y")}>Korean</span>
                          <IconFooterLangEn />
                        </>
                      ) : (
                        <>
                          <span className={cn("a11y")}>영문사이트</span>
                          <IconFooterLangKo />
                        </>
                      )}
                    </button>
                  </div>
                </li>
              </ul>
              <p className={cn("footer-copy")}>
                © WEMIX PTE. LTD. All rights reserved.
              </p>
            </div>
            <div className={cn("footer-link-wrap")}>
              <ul className={cn("footer-sns")}>
                {snsList.map((sns) => (
                  <li key={sns.name}>
                    <a
                      href={sns.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={
                        i18n.language === "en" ? "Open new window" : "새창 열기"
                      }
                      className={cn("sns-item", sns.name)}
                    >
                      {sns.logo}
                      <span className={cn("a11y")}>{sns.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;

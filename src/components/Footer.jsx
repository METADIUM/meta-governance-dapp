import cn from "classnames/bind";
import { throttle } from "lodash";
import React, { useState, useEffect, useCallback } from "react";

import { ReactComponent as IconFooterLogo } from "../assets/images/footer-logo-grey.svg";
import { ReactComponent as IconDiscord } from "../assets/images/ic_discord.svg";
import { ReactComponent as IconMedium } from "../assets/images/ic_medium.svg";
import { ReactComponent as IconTelegram } from "../assets/images/ic_telegram.svg";
import { ReactComponent as IconTwitter } from "../assets/images/ic_twitter.svg";

const Footer = () => {
  const [offset, setOffset] = useState({
    width: 0,
    height: 0
  });
  const resize = useCallback(() => {
    setOffset({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  const snsList = [
    {
      title: "Twitter",
      link: "https://twitter.com/MetadiumK",
      logo: <IconTwitter />
    },
    {
      title: "Telegram",
      link: "https://t.me/Metadiumofficialkor",
      logo: <IconTelegram />
    },
    {
      title: "Medium",
      link: "https://medium.com/metadium",
      logo: <IconMedium />
    },
    {
      title: "Discord",
      link: "https://discord.com/invite/ZnaCfYbXw2",
      logo: <IconDiscord />
    }
  ];

  useEffect(() => {
    resize();
    window.addEventListener("resize", throttle(resize, 200));
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  return (
    <footer className={cn("footer-wrap")}>
      <div className={cn("footer-inner")}>
        <div className={cn("footer-logo")}>
          <IconFooterLogo /> &copy;Metadium Technology Inc. All Rights Reserved.
        </div>
        <div className={cn("footer-link-wrap")}>
          <ul className={cn("footer-sns")}>
            {snsList.map((sns) => (
              <li key={sns.title}>
                <a
                  href={sns.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={"Open new window"}
                  className={cn("sns-item", sns.title)}
                >
                  {sns.logo}
                  <span className={cn("a11y")}>{sns.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import LandingLayout from "../../components/LandingLayout";

const Terms = () => {
  const { i18n } = useTranslation();
  const termsIframe = useRef(0);

  const eventListener = (e) => {
    const message = e.data;
    if (message.height) {
      termsIframe.current.height = message.height + "px";
      termsIframe.current.color = "white";
    }
  };

  useEffect(() => {
    window.removeEventListener("message", eventListener);
    window.addEventListener("message", eventListener);

    termsIframe.current.setAttribute(
      "src",
      `https://www.wemix.com/iframe/terms.html?lang=${
        i18n.language === "ko" ? "ko" : "en"
      }`,
    );
  }, [i18n.language, window.location.search]);

  return (
    <LandingLayout>
      <div class="policy-wrap">
        <iframe width="100%" scrolling="no" ref={termsIframe} loading="lazy" />
      </div>
    </LandingLayout>
  );
};

export default Terms;

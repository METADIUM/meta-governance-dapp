import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import LandingLayout from "../../components/LandingLayout";

const Privacy = () => {
  const { i18n } = useTranslation();
  const privacyIframe = useRef(0);

  const eventListener = (e) => {
    const message = e.data;
    if (message.height) {
      privacyIframe.current.height = message.height + "px";
      privacyIframe.current.color = "white";
    }
  };

  useEffect(() => {
    window.removeEventListener("message", eventListener);
    window.addEventListener("message", eventListener);

    privacyIframe.current.setAttribute(
      "src",
      `https://www.wemix.com/iframe/privacy.html?lang=${
        i18n.language === "ko" ? "ko" : "en"
      }`,
    );
  }, [i18n.language, window.location.search]);

  return (
    <LandingLayout>
      <div class="policy-wrap">
        <iframe
          width="100%"
          scrolling="no"
          ref={privacyIframe}
          loading="lazy"
        />
      </div>
    </LandingLayout>
  );
};

export default Privacy;

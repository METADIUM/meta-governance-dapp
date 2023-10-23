import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import LandingLayout from "../../components/LandingLayout";

const CaliforniaPrivacy = () => {
  const { i18n } = useTranslation();
  const californiaPrivacyIframe = useRef(0);

  const eventListener = (e) => {
    const message = e.data;
    if (message.height) {
      californiaPrivacyIframe.current.height = message.height + "px";
      californiaPrivacyIframe.current.color = "white";
    }
  };

  useEffect(() => {
    window.removeEventListener("message", eventListener);
    window.addEventListener("message", eventListener);

    californiaPrivacyIframe.current.setAttribute(
      "src",
      "https://www.wemix.com/iframe/californiaprivacy.html",
    );
  }, [i18n.language, window.location.search]);

  return (
    <LandingLayout>
      <div class="policy-wrap">
        <iframe
          width="100%"
          scrolling="no"
          ref={californiaPrivacyIframe}
          loading="lazy"
        />
      </div>
    </LandingLayout>
  );
};

export default CaliforniaPrivacy;

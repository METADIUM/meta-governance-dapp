import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import LandingLayout from "../../components/LandingLayout";

const CookiePolicy = () => {
  const { i18n } = useTranslation();
  const cookiePolicyIframe = useRef(0);

  const eventListener = (e) => {
    const message = e.data;
    if (message.height) {
      cookiePolicyIframe.current.height = message.height + "px";
      cookiePolicyIframe.current.color = "white";
    }
  };

  useEffect(() => {
    window.removeEventListener("message", eventListener);
    window.addEventListener("message", eventListener);

    cookiePolicyIframe.current.setAttribute(
      "src",
      "https://www.wemix.com/iframe/cookiepolicy.html",
    );
  }, [i18n.language, window.location.search]);

  return (
    <LandingLayout>
      <div class="policy-wrap">
        <iframe
          width="100%"
          scrolling="no"
          ref={cookiePolicyIframe}
          loading="lazy"
        />
      </div>
    </LandingLayout>
  );
};

export default CookiePolicy;

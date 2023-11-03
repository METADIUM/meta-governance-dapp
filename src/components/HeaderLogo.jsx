import cn from "classnames/bind";
import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as IconSymbol } from "../assets/images/header-logo-white.svg";

const HeaderLogo = () => {
  return (
    <h1 className={cn("header-logo")}>
      <Link to='/'>
        <span className={cn("logo-symbol")}>
          <IconSymbol />
          <span className={cn("a11y")}>metadium governance</span>
        </span>
      </Link>
    </h1>
  );
};

export default HeaderLogo;

import cn from "classnames/bind";
import React from "react";

import { ReactComponent as IconWallet } from "../../assets/images/ico_wallet.svg";

const Button = ({
  onClick,
  text,
  type,
  href,
  size = "md",
  disabled = false,
  prefix = false,
  icon = false
}) => {
  return (
    <>
      {href !== undefined ? (
        <a
          href={href}
          className={cn("button-wrap", type, size, prefix && "prefix")}
        >
          {text}
        </a>
      ) : (
        <button
          className={cn("button-wrap", type, size, prefix && "prefix")}
          onClick={onClick}
          disabled={disabled}
        >
          {icon && <IconWallet />} {text}
        </button>
      )}
    </>
  );
};

export default Button;

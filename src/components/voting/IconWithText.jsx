import cn from "classnames/bind";
import React, { useCallback } from "react";

import { ReactComponent as IconTime } from "../../assets/images/ic-clock.svg";
import { ReactComponent as IconPerson } from "../../assets/images/ic-member.svg";

/**
 * 
 * props data 형태: 배열 받을 수 있게 작업 되어 있음
  [
    {
      icon: 'time' | 'person'
      text: string
      children: ReactNode
    }
  ]
 */

/* 23.04.20 수정: 테마 추가 props data 에 children 추가 */
const IconWithText = ({ data }) => {
  const svgIcon = useCallback((icon) => {
    // if (theme === "light") {
      switch (icon) {
        case "time":
          return <IconTime />;
        case "person":
          return <IconPerson />;
        default:
          return false;
      }
  }, []);
  return (
    <div className={cn("icon-with-text-wrap")}>
      {data.map((el, index) => {
        return (
          <div className={cn("icon-with-text")} key={`${el.text}-${index}`}>
            {svgIcon(el.icon)}
            <span>{el.text}</span>
            {el.children && el.children}
          </div>
        );
      })}
    </div>
  );
};

export default IconWithText;

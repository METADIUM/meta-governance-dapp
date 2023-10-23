import React, { useCallback } from "react";
import cn from "classnames/bind";
import { ReactComponent as IconTime } from "../../assets/images/ico_time.svg";
import { ReactComponent as IconPerson } from "../../assets/images/ico_person.svg";
import { ReactComponent as IconTimeDark } from "../../assets/images/ico_time_dark.svg";
import { ReactComponent as IconPersonDark } from "../../assets/images/ico_person_dark.svg";

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
const IconWithText = ({ data, theme = "light" }) => {
  const svgIcon = useCallback((icon) => {
    if (theme === "light") {
      switch (icon) {
        case "time":
          return <IconTime />;
        case "person":
          return <IconPerson />;
        default:
          return false;
      }
    } else {
      switch (icon) {
        case "time":
          return <IconTimeDark />;
        case "person":
          return <IconPersonDark />;
        default:
          return false;
      }
    }
  }, []);
  return (
    <div className={cn("icon-with-text-wrap", `${theme}`)}>
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

import React from "react";
import cn from "classnames/bind";
import { ReactComponent as IconActive } from "../../assets/images/ico_active.svg";
import { ReactComponent as IconApproved } from "../../assets/images/ico_accepted.svg";
import { ReactComponent as IconRejected } from "../../assets/images/ico_rejected.svg";
// 23.03.02 수정: ready 상태 코드 추가
import { ReactComponent as IconReady } from "../../assets/images/ico_ready.svg";
import { constants } from "../../constants";

const Status = ({ status }) => {
  let s = constants.ballotStateArr[status].toLowerCase();
  if (s === "inprogress") s = "active";

  const statusIcon = () => {
    switch (s) {
      case "active":
        return <IconActive />;
      case "approved":
        return <IconApproved />;
      case "rejected":
        return <IconRejected />;
      // 23.03.02 수정: ready 상태 코드 추가
      case "ready":
        return <IconReady />;
      default:
        return false;
    }
  };
  return (
    <div className={cn("voting-status", s)}>
      {statusIcon()}
      <span>{s}</span>
    </div>
  );
};

export default Status;

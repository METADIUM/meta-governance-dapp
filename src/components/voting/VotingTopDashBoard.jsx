import React from "react";
import cn from "classnames/bind";
const VotingTopDashBoard = ({ value, text, status = "default" }) => {
  return (
    <div className={cn("dashboard-block")}>
      <strong>{value}</strong>
      <span className={cn(status)}>{text}</span>
    </div>
  );
};

export default VotingTopDashBoard;

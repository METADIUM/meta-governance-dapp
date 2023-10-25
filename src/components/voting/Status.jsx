import React from "react";
import cn from "classnames/bind";
import { constants } from "../../constants";

const Status = ({ status }) => {
  let s = constants.ballotStateArr[status].toLowerCase();
  if (s === "inprogress") s = "active";

  s = s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className={cn("voting-status", s)}>
      {s}
    </div>
  );
};

export default Status;

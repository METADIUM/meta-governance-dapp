import React from "react";
import cn from "classnames/bind";
import Button from "./Button.jsx";
import VotingTopDashBoard from "./VotingTopDashBoard.jsx";
import { Link } from "react-router-dom";

const VotingTopList = ({
  isMember,
  totalCount,
  activeCount,
  readyCount,
  approvedCount,
  rejectedCount,
  btnFunction = (f) => f,
}) => {
  return (
    <div className="section-head">
      <div className="wrap">
        <div className="title">
          <span>Voting</span>
        </div>
        <div className="boxs">
          <VotingTopDashBoard
            value={totalCount}
            text="Total Votes"
          />
          <VotingTopDashBoard
            value={activeCount}
            text="Active"
            status="active"
          />
          <VotingTopDashBoard
            value={readyCount}
            text="Ready"
            status="ready"
          />
          <VotingTopDashBoard
            value={approvedCount}
            text="Approved"
            status="approved"
          />
          <VotingTopDashBoard
            value={rejectedCount}
            text="Rejected"
            status="rejected"
          />
        </div>
      </div>
    </div>
  );
};

export default VotingTopList;

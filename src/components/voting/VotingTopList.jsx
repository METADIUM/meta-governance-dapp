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
    <div className={cn("voting-top-wrap")}>
      <div className={cn("inner")}>
        <div className={cn("voting-title")}>
          <h2 className={cn("title")}>Voting</h2>
          {/* {isMember && (
            <Link to="/voting/proposal">
              <Button
                type={"bg"}
                text="New Proposal"
                prefix={true}
                onClick={() => {
                  btnFunction();
                  window.localStorage.removeItem("selectedTopic");
                }}
              />
            </Link>
          )} */}
        </div>
        <div className={cn("dashboard-wrap")}>
          <div style={{ boxShadow: "0px 20px 40px 4px #ececfe" }}>
            <VotingTopDashBoard value={totalCount} text="Total Votes" />
          </div>

          <div className={cn("dashboard-module")}>
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
    </div>
  );
};

export default VotingTopList;

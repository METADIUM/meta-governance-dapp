import React, { useState } from "react";

import { ReactComponent as IconPopupClose } from "../../assets/images/ico_popup_close.svg";
import { ReactComponent as IconSearch } from "../../assets/images/ico_search.svg";
import cn from "classnames/bind";

export default function VotingSearch({
  setIsFilter,
  searchBallot,
  onClose,
  onSelect,
}) {
  const [isNonACtive, setIsNonACtive] = useState("active");
  const [searchValue, setSearchValue] = useState("");
  // console.log("onClose", onClose);
  return (
    <div className={cn("voting-search")}>
      <div className={cn("search-text-area")}>
        <input
          name="authMemSkAmountMax"
          placeholder="Search by Type, Proposal, Keywords"
          className={cn("search-input")}
          onChange={(e) => {
            searchBallot(e);
            setSearchValue(e.target.value);
          }}
          value={searchValue}
        ></input>

        <button
          type="button"
          className={cn("search-close-btn")}
          onClick={() => {
            setIsFilter(false);
            setIsNonACtive("");
            setSearchValue("");
            onClose();
            // votingSelect 보여주기
            onSelect();
          }}
        >
          <IconPopupClose />
        </button>
      </div>

      <button type="button" className={cn("voting-search-btn")}></button>
    </div>
  );
}

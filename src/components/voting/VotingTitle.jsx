import React, { useState, useEffect, useCallback } from "react";
import cn from "classnames/bind";
import VotingSearch from "../../components/voting/VotingSearch";
import VotingSelectCopy from "./VotingSelectCopy";
import VotingSelect from "./VotingSelect";
import { useNavigate } from "react-router-dom";

const VotingTitle = ({
  type = "md",
  title,
  count,
  searchName,
  searchBallot,
  filterData,
  handleSelect,
  onClose,
  exp,
  isMember,
  btnFunction,
}) => {
  const [isFilter, setIsFilter] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState();
  // 필터 보이기 상태변수
  const [isViewFilter, setIsViewFilter] = useState(false);
  const [checkedData, setCheckedData] = useState("All");
  // console.log(checkedData);
  let isMobileType = true;
  const navigate = useNavigate();

  const handleWindowSizeChange = useCallback(() => {
    setWidth(window.innerWidth);
    isMobileType = window.innerWidth < 1024 ? true : false;

    isMobileType ? setIsMobile(true) : setIsMobile(false);
  }, []);

  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  function newProposalBtnClickHandler(event) {
    event.preventDefault();
    btnFunction && btnFunction();
    window.localStorage.removeItem("selectedTopic");
    navigate("/voting/proposal");
  }
  return (
    <>
      <div className={cn("voting-title-wrap", type)}>
        {isFilter && isMobile ? (
          false
        ) : (
          <>
            <strong>{title}</strong>
            {count !== undefined && <span>{count}</span>}
          </>
        )}

        {searchName && (
          <div
            className={cn(
              "detail-search-area",
              isFilter && isMobile ? "active" : "",
            )}
          >
            {isViewFilter && (
              <VotingSelectCopy
                filterData={filterData}
                handleSelect={handleSelect}
                defaultCheckedData={{
                  data: checkedData,
                  setData: setCheckedData,
                }}
                isMember={isMember}
                onSelect={() => {
                  setIsViewFilter(!isViewFilter);
                }}
              />
            )}
            {/* 예전코드 */}
            {/* <VotingSelect
              filterData={filterData}
              className={searchName}
              dropdownClassName={searchName}
              handleSelect={handleSelect}
            /> */}

            <VotingSearch
              setIsFilter={setIsFilter}
              searchBallot={searchBallot}
              onClose={onClose}
              onSelect={() => {
                setIsViewFilter(!isViewFilter);
              }}
            />
            {console.log(isMember)}
            {isMember && (
              <button
                className="voting-button-new-proposal"
                onClick={newProposalBtnClickHandler}
              >
                New Proposal
              </button>
            )}
          </div>
        )}
      </div>
      {exp && <div className="voting-title-exp">{exp}</div>}
    </>
  );
};

export default VotingTitle;

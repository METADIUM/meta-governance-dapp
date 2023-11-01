import cn from 'classnames/bind';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import VotingSelect from './VotingSelect';
import VotingSearch from '../../components/voting/VotingSearch';



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
  isConnect,
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
  }, [handleWindowSizeChange]);

  function newProposalBtnClickHandler(event) {
    event.preventDefault();
    btnFunction && btnFunction();
    window.localStorage.removeItem("selectedTopic");
    navigate("/voting/proposal");
  }

  return (
    <div className={cn("voting-title-wrap", type)}>
      {title && (
        <>
          <strong className="subject">{title}</strong>
          {count !== undefined && <span className="subject">{count}</span>}
        </>
      )}
      {searchName && ( // "search-type"
        <div className={cn("voting-title-wrap", type)}>
          <div
            className={cn(
              "detail-search-area",
              isFilter && isMobile ? "active" : ""
            )}
          >
            <VotingSelect
              filterData={filterData}
              className={searchName}
              dropdownClassName={searchName}
              handleSelect={handleSelect}
            />
            <VotingSearch
              setIsFilter={setIsFilter}
              searchBallot={searchBallot}
              onClose={onClose}
              onSelect={() => {
                setIsViewFilter(!isViewFilter);
              }}
            />
            {isConnect && isMember && (
              <button
                className="default-btn"
                onClick={newProposalBtnClickHandler}
              >
                + New Proposal
              </button>
            )}
          </div>
        </div>
      )}
      {exp && <div className="voting-title-exp">{exp}</div>}
    </div>
  );
};

export default VotingTitle;

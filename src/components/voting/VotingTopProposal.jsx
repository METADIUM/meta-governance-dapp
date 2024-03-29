import { Select } from "antd";
import cn from "classnames/bind";
import React from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as IconPrev } from "../../assets/images/ic-prev.svg";
import { ReactComponent as IconArrowDown } from "../../assets/images/ic-select-arrow.svg";

const VotingTopProposal = ({
  loading,
  options,
  showProposal,
  selectedTopic,
  handleSelectTopicChange
}) => {
  const navitage = useNavigate();

  return (
    <div className={"proposal-top-wrap"}>
      <div className='proposal-top-btn-wrap'>
        {!showProposal && (
          <button
            className={cn("btn-prev")}
            onClick={() => {
              navitage("/voting/list");
            }}
          >
            <IconPrev />
          </button>
        )}
        <h2>{showProposal ? "My Info" : "New Proposal"}</h2>
      </div>

      <div className={"proposal-select-wrap"}>
        <span className={"select-label"}>
          {showProposal ? "Replace List" : "Topic for voting"}
        </span>
        <Select
          value={selectedTopic}
          filterOption={false}
          onChange={handleSelectTopicChange}
          disabled={loading}
          className={"select-proposal"}
          suffixIcon={<IconArrowDown />}
          dropDownClassName='proposal'
        >
          {options.map((item, i) => {
            return (
              <Select.Option value={item.value} key={i}>
                {item.id}
              </Select.Option>
            );
          })}
        </Select>
      </div>
    </div>
  );
};

export default VotingTopProposal;

import React from "react";
import cn from "classnames/bind";
import VotingSelect from "../../components/voting/VotingSelect";
import { ReactComponent as IconPrev } from "../../assets/images/ico_prev.svg";
import { Select } from "antd";
import { ReactComponent as IconArrowDown } from "../../assets/images/ic-select-arrow.svg";
import { useNavigate } from "react-router-dom";

const VotingTopProposal = ({
  loading,
  options,
  showProposal,
  selectedTopic,
  handleSelectTopicChange,
  isWhiteList,
}) => {
  const navitage = useNavigate();

  return (
    <div className={cn("voting-top-wrap")}>
      <div className={cn("inner")}>
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
        <div className={cn("voting-title")}>
          <h2 className={cn("title")}>
            {showProposal ? "My Info" : "New Proposal"}
          </h2>
        </div>

        <div className={cn("voting-proposal-select")}>
          <span className={cn("select-label")}>
            {showProposal ? "Replace List" : "Topic for voting"}
          </span>
          <Select
            value={selectedTopic}
            filterOption={false}
            onChange={handleSelectTopicChange}
            disabled={loading}
            className={cn("voting-filter", "proposal")}
            suffixIcon={<IconArrowDown />}
            dropDownClassName="proposal"
          >
            {options.map((item, i) => {
              // wait 안건 올리는 건 whitelist에 등록된 멤버만 가능
              if (item.value === "AddWaitProposal" && !isWhiteList) return;
              return (
                <Select.Option value={item.value} key={i}>
                  {item.id}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default VotingTopProposal;

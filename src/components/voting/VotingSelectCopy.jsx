import React, { useState } from "react";

const VotingSelectCopy = ({
  filterData,
  handleSelect,
  onSelect,
  defaultCheckedData,
  isMember,
}) => {
  // console.log(filterData, handleSelect, defaultCheckedData);

  function radioBtnClickHandler(event) {
    if (event.target.value) {
      // console.log(event.target.value);
      handleSelect(event.target.value);
      // 컴포넌트 초기화 시 부모 컴포넌트에 저장된 마지막 셀렉트 값을 세팅함
      defaultCheckedData.setData(event.target.value);
      onSelect();
    }
  }
  console.log(isMember);
  return (
    <div className="voting-select-wrapper">
      <div className="voting-select">
        <div className="voting-select-title">Proposal Status</div>
        <div className="voting-select-radio-box">
          {filterData.map((value, index) => {
            // console.log(value, defaultCheckedData.data);
            return (
              <div onClick={radioBtnClickHandler} key={`radio-${index}`}>
                <input
                  type="radio"
                  id={`voting-select-${value}`}
                  name="voting-select-radio"
                  value={`${value}`}
                  defaultChecked={defaultCheckedData.data === value}
                />
                <label htmlFor={`voting-select-${value}`}>{value}</label>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="voting-select-same-place"
        style={{ display: !isMember && "none" }}
      ></div>
    </div>
  );
};

export default VotingSelectCopy;

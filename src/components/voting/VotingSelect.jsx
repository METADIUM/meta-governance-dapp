import React from "react";
import { Select } from "antd";
import cn from "classnames/bind";
import { ReactComponent as IconArrowDown } from "../../assets/images/ico_select_arrow_drop_down.svg";

export default function VotingSelect({
  filterData,
  className,
  dropdownClassName = "voting",
  handleSelect,
}) {
  const Option = Select.Option;
  console.log(filterData, className, dropdownClassName, handleSelect);
  return (
    <Select
      defaultValue={filterData[0]}
      className={cn("voting-filter", className)}
      dropdownClassName={dropdownClassName}
      suffixIcon={<IconArrowDown />}
      onChange={(e) => handleSelect(e)}
    >
      {filterData.map((data, index) => (
        <Option value={data} key={index}>
          {data}
        </Option>
      ))}
    </Select>
  );
}

import { Select } from "antd"
import cn from "classnames/bind"
import React from "react"

import { ReactComponent as IconArrowDown } from "../../assets/images/ic-select-arrow.svg"

export default function VotingSelect ({
  filterData,
  className,
  dropdownClassName = "voting",
  handleSelect
}) {
  const Option = Select.Option
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
  )
}

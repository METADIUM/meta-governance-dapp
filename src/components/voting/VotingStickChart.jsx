import React from "react";
import cn from "classnames/bind";

export default function VotingStickChart({
  title,
  count,
  percent,
  type = "yes-type",
  noUnit = false,
  /* 23.04.21 수정: 테마 추가 */
  theme = "light",
}) {
  return (
    <div className={cn("stick-chart", `${theme}`)}>
      {!noUnit && (
        <p className={cn("legend-area")}>
          <span className={cn("legend-title")}>{title}</span>
          {/* 23.04.21 수정: type class 추가 */}
          <span className={cn("legend-unit", type)}>
            {count}
            <em className={cn("sub-unit")}> ({percent}%)</em>
          </span>
        </p>
      )}

      <div className={cn("voting-stick-chart", type)}>
        <span style={{ width: `${percent}%` }} className={cn("rate")}></span>
      </div>
    </div>
  );
}

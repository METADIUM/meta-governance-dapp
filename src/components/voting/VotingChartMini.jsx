import cn from "classnames/bind";
import React from "react";
/**
 *
 * props data 형태
    {
      yes: number
      no: number
    }
 */
/* 23.04.20 수정: dark 버전으로 props 추가 (기본 값 light) */
const VotingChartMini = ({ data, theme = "light" }) => {
  return (
    <div className={cn("voting-chart-mini", `${theme}`)}>
      <span
        className={cn("graph-positive")}
        style={{ width: `${data.yes}%` }}
      />
      <span
        className={cn("graph-critical")}
        style={{ width: `${data.no}%` }}
      />
    </div>
  );
};

export default VotingChartMini;

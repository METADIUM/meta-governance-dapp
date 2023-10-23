import React from "react";
import cn from "classnames";

const Loading = ({ txLoading = false }) => {
  return (
    <div className={cn("loading-wrapper", { "tx-loading": txLoading })}>
      <div className={cn("loading-img")}></div>
      <div className="loading-dot-wrapper">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>
    </div>
  );
};

export default Loading;

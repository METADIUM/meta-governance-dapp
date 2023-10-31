import cn from "classnames";
import React from "react";

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

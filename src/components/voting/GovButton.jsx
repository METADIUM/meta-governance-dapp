import React from "react";

const GovButton = ({ onClick, text, disabled, loading, type }) => {
  return (
    <div className={`gov_btn_wrapper ${type}`}>
      <button
        disabled={disabled || loading}
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
      >
        {text}
      </button>
    </div>
  );
};

export default GovButton;

import React from "react";

const GovButton = ({ onClick, text, disabled, loading, type }) => {
  console.log(disabled || loading);
  console.log(text);
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

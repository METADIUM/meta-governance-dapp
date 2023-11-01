import React from 'react'

const GovButton = ({ onClick, text, disabled, loading, type }) => {
  return (
    <button
      className={`gov_btn ${type}`}
      disabled={disabled || loading}
      onClick={() => {
        if (onClick) {
          onClick()
        }
      }}>
      {text}
    </button>
  )
}

export default GovButton

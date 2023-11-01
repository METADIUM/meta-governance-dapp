import cn from 'classnames/bind'
import React from 'react'
const VotingTopDashBoard = ({ value, text, status = 'default' }) => {
  return (
    <div className={cn('dashboard-block')}>
      <span className={cn(status)}>{text}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default VotingTopDashBoard

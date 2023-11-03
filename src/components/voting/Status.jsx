import cn from "classnames/bind"
import React from "react"

import { constants } from "../../constants"

const Status = ({ status }) => {
  let state
  let s = constants.ballotStateArr[status].toLowerCase()
  if (s === "inprogress") s = "active"

  state = s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <div className={cn("voting-status", s)}>
      {state}
    </div>
  )
}

export default Status

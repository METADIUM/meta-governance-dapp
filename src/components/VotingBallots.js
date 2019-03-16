import React from 'react'
import { constants } from '../ethereum/constants'
import { Button, Progress } from 'antd'
import './style/style.css'

const VotingBallots = ({item, ballotDetails, authorityName, newMemberAddress, oldMemberAddress, setTopic=f=>f, onClickDetail=f=>f, onClickVote=f=>f, setDescription=f=>f, onClickUpdateProposal=f=>f}) =>
  <div className={'ballotDiv ' + constants.ballotTypesArr[parseInt(item.ballotType)]}
    id={item.id}
    ref={ref => ballotDetails.set(item.id, ref)}>
    <div className='ballotInfoDiv flex'>
      <div className='infoLeft flex-full'>
        <p className='topic text-exlarge text-bold'>{setTopic(item.ballotType, newMemberAddress, oldMemberAddress)}</p>
        <p className='company text-small'>{authorityName}</p>
        <p className='addr text-small'>Proposal Address: {item.creator}</p>
      </div>
      <div className='infoRight flex-column'>
        {item.state === constants.ballotState.Ready || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected
          ? <Button className='btn-img text-exlarge' type='primary' id='ballotDetailBtn' onClick={e => onClickDetail(item.id)} icon='down' /> : null}
        <p className='status text-small'>Status : {constants.ballotStateArr[parseInt(item.state)]}</p>
      </div>
    </div>
    <div className='ballotContentDiv'>
      <div className='voteDiv'>
        <div className='imageContent flex'>
          <Button
            disabled={item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected}
            className="text-large" id='yesVotingBtn' onClick={() => onClickVote('Y', item.id, item.endTime, this.state)} >Yes</Button>
          <div className='chart flex'>
            <div className='number'>
              <span>{item.powerOfAccepts === 0 ? '0' : item.powerOfAccepts}%</span>
              <span>{item.powerOfRejects === 0 ? '0' : item.powerOfRejects}%</span>
            </div>
            <Progress percent={item.powerOfAccepts} status='active' showInfo={false} />
          </div>
          <Button
            disabled={item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected}
            className="text-large" id='noVotingBtn' onClick={() => onClickVote('N', item.id, item.endTime, this.state)} >No</Button>
        </div>
        <div className='textContent'>
          {setDescription(item.ballotType, newMemberAddress, oldMemberAddress, item.id)}
          <div className='duration'>
            { item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected || item.state === constants.ballotState.InProgress
              ? <div>
                <div><span>Start : </span><span>{item.startTime}</span></div>
                <div><span>End : </span><span>{item.endTimeConverted}</span></div>
              </div> : null }
            { item.state === constants.ballotState.Ready
              ? <div>
                <div><span>duration</span><span className="days">{item.duration === 0? 1 : item.duration}days</span></div>
                <Button type='primary' onClick={() => onClickUpdateProposal('change', item.id, item.duration, newMemberAddress, oldMemberAddress)}>Change</Button>
              </div> : null }
          </div>
        </div>
      </div>
      <div className='memoDiv'>
        <p>MEMO</p>
        <p className="text-container">{item.memo}</p>
      </div>
      { item.state === '1'
        ? <div className='revokeDiv'>
          <Button onClick={() => onClickUpdateProposal('revoke', item.id, item.duration, newMemberAddress, oldMemberAddress)}>Revoke</Button>
        </div> : null }
    </div>
  </div>

export { VotingBallots }
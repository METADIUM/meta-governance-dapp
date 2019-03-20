import React from 'react'
import { Button, Progress } from 'antd'
import { constants } from '../ethereum/constants'
import './style/style.css'

const VotingBallots = ({
  item,
  ballotDetails,
  authorityName,
  newMemberAddress,
  oldMemberAddress,
  setTopic = f => f,
  onClickDetail = f => f,
  onClickVote = f => f,
  setDescription = f => f,
  onClickUpdateProposal = f => f
}) =>
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
          ? <Button className='btn-img text-exlarge' type='primary' id='ballotDetailBtn' onClick={e => onClickDetail(e, item.id)} icon='down' /> : null}
        <p className='status text-small'>Status : {constants.ballotStateArr[parseInt(item.state)]}</p>
      </div>
    </div>
    <div className='ballotContentDiv'>
      <div className='voteDiv'>
        <div className='imageContent flex'>
          <Button
            disabled={item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected}
            className='text-large' id='yesVotingBtn' onClick={() => onClickVote('Y', item.id, item.endTime, this.state)} >Yes</Button>
          <div className='chart flex-column flex-full'>
            <div className='number flex'>
              <span className='text-bold'>{item.powerOfAccepts === 0 ? '0' : item.powerOfAccepts}%</span>
              <span className='text-bold'>{item.powerOfRejects === 0 ? '0' : item.powerOfRejects}%</span>
            </div>
            <Progress percent={item.powerOfAccepts} status='active' showInfo={false} />
          </div>
          <Button
            disabled={item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected}
            className='text-large' id='noVotingBtn' onClick={() => onClickVote('N', item.id, item.endTime, this.state)} >No</Button>
        </div>
        <div className='textContent flex'>
          {setDescription(item.ballotType, newMemberAddress, oldMemberAddress, item.id)}
          <div className='duration'>
            { item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected || item.state === constants.ballotState.InProgress
              ? <div>
                <div className='flex'><span>Start : </span><span>{item.startTime}</span></div>
                <div className='flex'><span>End : </span><span>{item.endTimeConverted}</span></div>
              </div> : null }
            { item.state === constants.ballotState.Ready
              ? <div>
                <div className='flex'><span>duration</span><span className='days'>{item.duration === 0 ? 1 : item.duration}days</span></div>
                <Button className='btn-fill-gray' type='primary' onClick={() => onClickUpdateProposal('change', item.id, item.duration, newMemberAddress, oldMemberAddress)}>Change</Button>
              </div> : null }
          </div>
        </div>
      </div>
      <div className='memoDiv'>
        <p className='text-bold'>MEMO</p>
        <p className='text-container'>{item.memo}</p>
      </div>
      { item.state === '1'
        ? <div className='revokeDiv flex'>
          <Button className='btn-fill-gray' onClick={() => onClickUpdateProposal('revoke', item.id, item.duration, newMemberAddress, oldMemberAddress)}>Revoke</Button>
        </div> : null }
    </div>
  </div>

const ShowBallots = ({
  titles,
  visibleActiveItems,
  visibleProposalItems,
  visibleFinalizedItems,
  netName,
  onClickReadMore = f => f
}) =>
  <div className='contentDiv container'>
    <p className='stateTitle text-heavy' ref={ref => { titles.activeTitle = ref }}>Active</p>
    {visibleActiveItems}
    <p className='stateTitle text-heavy' ref={ref => { titles.proposalTitle = ref }}>Proposals</p>
    {visibleProposalItems}
    {visibleProposalItems.length > 0
      ? <div className='moreDiv flex flex-center-vertical'>
        <Button value='large' onClick={(e) => onClickReadMore('proposal')}>
          <span>+</span>
          <span className='text_btn'>Read More</span>
        </Button>
      </div> : null}
    <p className='stateTitle text-heavy' ref={ref => { titles.finalizedTitle = ref }}>Finalized</p>
    {visibleFinalizedItems}
    {visibleFinalizedItems.length > 0
      ? <div className='moreDiv flex flex-center-vertical'>
        <Button className={'btn-fill-white flex ' + netName} value='large' onClick={(e) => onClickReadMore('finalized')}>
          <span>+</span>
          <span className='text_btn'>Read More</span>
        </Button>
      </div> : null}
  </div>

export { VotingBallots, ShowBallots }

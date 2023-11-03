import { Button, Progress } from "antd"
import React from "react"

import { constants } from "../constants"
import { shouldPass } from "../util"

import "./style/style.css"

const bs = constants.ballotState
const btArr = constants.ballotStateArr

const VotingBallots = ({
  item,
  ballotMemberOriginData,
  ballotDetails,
  authorityName,
  setTopic = shouldPass(),
  onClickDetail = shouldPass(),
  onClickVote = shouldPass(),
  setDescription = shouldPass(),
  onClickUpdateProposal = shouldPass()
}) => {
  const {
    newStakerAddress,
    oldStakerAddress,
    newVoterAddress,
    newRewardAddress
  } = ballotMemberOriginData
  return (
    <div
      className={`ballotDiv ${
        item.ballotType === "3" &&
        item.state === "3" &&
        oldStakerAddress === newStakerAddress
          ? "Changed"
          : btArr[parseInt(item.state)]
      }`}
      id={item.id}
      ref={(ref) => ballotDetails.set(item.id, ref)}
    >
      <div className='ballotInfoDiv flex'>
        <div className='infoLeft flex-full'>
          <p className='topic text-exlarge text-bold'>
            {setTopic(
              item.creator,
              item.ballotType,
              ballotMemberOriginData.envVariableName,
              newStakerAddress,
              oldStakerAddress,
              newVoterAddress,
              newRewardAddress
            )}
          </p>
          <p className='company text-small'>{authorityName}</p>
          <p className='addr text-small'>Proposal Address: {item.creator}</p>
        </div>
        <div className='infoRight flex-column'>
          {bs.InProgress !== item.state && (
            <Button
              className='btn-img text-exlarge'
              type='primary'
              id='ballotDetailBtn'
              onClick={(e) => onClickDetail(e, item.id)}
              icon='down'
            />
          )}
          <p className='status text-small'>
            Status :
            {item.ballotType === "3" &&
            item.state === "3" &&
            oldStakerAddress === newStakerAddress ? (
                "Changed"
              ) : (
              <>{btArr[parseInt(item.state)]} </>
              )}
          </p>
        </div>
      </div>
      <div className='ballotContentDiv'>
        <div className='voteDiv'>
          {item.ballotType === "3" &&
          oldStakerAddress === newStakerAddress ? null : (
            <div className='imageContent flex'>
                <Button
                disabled={![bs.Ready, bs.InProgress].includes(item.state)}
                className='text-large'
                id='yesVotingBtn'
                onClick={() => onClickVote("Y", item)}
                >
                Yes
              </Button>
                <div className='chart flex-column flex-full'>
                <div className='number flex'>
                    <span className='text-bold'>
                    {item.powerOfAccepts === 0 ? "0" : item.powerOfAccepts}%
                  </span>
                    <span className='text-bold'>
                    {item.powerOfRejects === 0 ? "0" : item.powerOfRejects}%
                  </span>
                  </div>
                <Progress
                    percent={item.powerOfAccepts}
                    status='active'
                    showInfo={false}
                  />
              </div>
                <Button
                disabled={![bs.Ready, bs.InProgress].includes(item.state)}
                className='text-large'
                id='noVotingBtn'
                onClick={() => onClickVote("N", item)}
                >
                No
              </Button>
              </div>
            )}
          <div className='textContent flex'>
            {setDescription(item.ballotType, item.id)}
            <div className='duration'>
              {item.state !== bs.Ready && (
                <div>
                  <div className='flex'>
                    <span>Start : </span>
                    <span>{item.startTimeConverted}</span>
                  </div>
                  <div className='flex'>
                    <span>End : </span>
                    <span>{item.endTimeConverted}</span>
                  </div>
                </div>
              )}
              {item.state === bs.Ready && (
                <div>
                  <div className='flex'>
                    <span>duration</span>
                    <span className='days'>
                      {item.duration === 0 ? 1 : item.duration} days
                    </span>
                  </div>
                  <Button
                    className='btn-fill-gray'
                    type='primary'
                    onClick={() => onClickUpdateProposal("change", item)}
                  >
                    Change
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='memoDiv'>
          <p className='text-bold'>MEMO</p>
          <p className='text-container'>{item.memo}</p>
        </div>
        {item.state === "1" && (
          <div className='revokeDiv flex'>
            <Button
              className='btn-fill-gray'
              onClick={() => onClickUpdateProposal("revoke", item)}
            >
              Revoke
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const ShowBallots = ({
  titles,
  visibleActiveItems,
  visibleProposalItems,
  totalProposalItemLength,
  visibleFinalizedItems,
  totalFinalizedItemLength,
  netName,
  onClickReadMore = shouldPass()
}) => (
  <div className='contentDiv container'>
    <p
      className='stateTitle text-heavy'
      ref={(ref) => {
        titles.activeTitle = ref
      }}
    >
      Active
    </p>
    {visibleActiveItems}
    <div className='vote-sectionline' />
    <p
      className='stateTitle text-heavy'
      ref={(ref) => {
        titles.proposalTitle = ref
      }}
    >
      Proposals
    </p>
    {visibleProposalItems}
    {visibleProposalItems.length > 0 &&
      visibleProposalItems.length < totalProposalItemLength && (
      <div className='moreDiv flex flex-center-vertical'>
        <Button
          className={"btn-fill-white flex flex-center-horizontal " + netName}
          onClick={(e) => onClickReadMore("proposal")}
        >
          <span>+</span>
          <span className='text_btn'>Read More</span>
        </Button>
      </div>
    )}
    <div className='vote-sectionline' />
    <p
      className='stateTitle text-heavy'
      ref={(ref) => {
        titles.finalizedTitle = ref
      }}
    >
      Finalized
    </p>
    {visibleFinalizedItems}
    {visibleFinalizedItems.length > 0 &&
      visibleFinalizedItems.length < totalFinalizedItemLength && (
      <div className='moreDiv flex flex-center-vertical'>
        <Button
          className={"btn-fill-white flex flex-center-horizontal " + netName}
          onClick={(e) => onClickReadMore("finalized")}
        >
          <span>+</span>
          <span className='text_btn'>Read More</span>
        </Button>
      </div>
    )}
  </div>
)

export { VotingBallots, ShowBallots }

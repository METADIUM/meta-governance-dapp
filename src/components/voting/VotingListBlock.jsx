import React, { useEffect, useState, useCallback } from "react"; // 23.04.20 수정: useCallback 추가
import cn from "classnames/bind";
import Status from "./Status.jsx";
import IconWithText from "./IconWithText.jsx";
import VotingChartMini from "./VotingChartMini.jsx";
import { loginAcc, shouldPass } from "../../util.js";
import { Link } from "react-router-dom";
import RevokeButton from "./Button";
import MoreButton from "./GovButton.jsx";

// case 확인을 위한 props
const VotingListBlock = ({
  item,
  authorityName,
  ballotMemberOriginData,
  setTopic,
  onClick,
  isMember,
  style,
}) => {
  const {
    envVariableName,
    newStakerAddress,
    oldStakerAddress,
    newVoterAddress,
    newRewardAddress,
    companyName, // wait protocol
    description, // wait protocol
    isWait, // wait protocol
    txHashes, // wait protocol
  } = ballotMemberOriginData;

  const {
    id,
    creator,
    ballotType,
    state,
    isFinalized,
    powerOfAccepts,
    powerOfRejects,
    totalVoters,
    endTimeConverted,
    memo,
    powers, // 0: 투표 안한 사람, 1: 찬성 투표율, 2: 반대 투표율, 3: 기권율
  } = item;

  const title = setTopic({
    creator,
    ballotType,
    envVariableName,
    oldStakerAddress,
    newStakerAddress,
    newVoterAddress,
    newRewardAddress,
    companyName,
  });

  // 투자 진행 상태 (state가 active거나 가결됐을 때 필요)
  const txState =
    (state === "2" || state === "3") && txHashes
      ? txHashes.length > 0
        ? "tx-complete"
        : "tx-before"
      : "";

  const exFinalizedCode = () => {
    if (state === "1") return "Proposal Ready";
    return endTimeConverted;
  };

  const chartData = {
    yes: isWait ? powers[1] : powerOfAccepts, // wait protocol
    // 투표가 끝난 경우 rejects 값을 채워줘야 하는데, myInfo 에서 변경한 경우는 안 채워지도록
    no:
      // wait protocol
      (state === "3" || state === "4") &&
      ((isWait && powers[1] && powers[2]) || (powerOfAccepts && powerOfRejects))
        ? 100 - `${isWait ? powers[1] : powerOfAccepts}`
        : isWait
        ? powers[2]
        : powerOfRejects,
  };

  /* 23.04.20 수정: wait protocol 케이스 추가 */
  const investmentStateAction = useCallback(() => {
    /**
     * investmentState state 값 정의
     * tx 등록 전(투자 진행 전): tx-before
     * tx 1건 등록 후(투자 진행 완료): tx-complete
     */
    switch (txState) {
      case "tx-before":
        return "Investment queued";
      case "tx-complete":
        return "Investment executed";
      default:
        return false;
    }
  }, [txState]);

  return (
    <>
      <div className="proposal-box" style={style}>
        <Link
          to={`/voting/detail?id=${id}${isWait ? "&wait=1" : ""}`}
          className={cn(
            "voting-list-block-wrap",
            state === "4" && isFinalized === "" && "revoke"
          )}
        >
          <div className={cn("wallet-info")}>
            <span>{authorityName}</span>
            <span>{loginAcc(creator)}</span>
          </div>
          <div className={cn("list-title-wrap")}>
            <Status status={state} />
            <strong className={cn("title")}>
              {/* wait protocol 분기 처리 */}
              {isWait ? companyName : title}
            </strong>
          </div>
          <div className={cn("list-desc-wrap")}>
            {/* wait protocol 분기 처리 */}
            {isWait ? description : memo}
          </div>
          <div className={cn("list-bottom-info")}>
            <IconWithText
              data={[
                {
                  icon: "time",
                  // 완료된 케이스는 완료 날짜 표시 예시를 위한 코드
                  text: exFinalizedCode(),
                },
              ]}
            />
            <div>
              <IconWithText
                data={[
                  {
                    icon: "person",
                    // 투표 0건인 케이스 (썸네일 그래프 없음) 예시를 위한 코드
                    text: `${totalVoters} Addresses`,
                  },
                ]}
              />
              <VotingChartMini data={chartData} />
            </div>
            {/* 23.04.20 수정: wait protocol 케이스 추가 */}
            {isWait && (
              <div className={cn("tx-state", `${txState}`)}>
                {investmentStateAction()}
              </div>
            )}
          </div>
        </Link>
        {isMember &&
          (state === "4" || (isWait && (state === "0" || state === "1"))) &&
          isFinalized === "" && (
            <RevokeButton text="Revoke" onClick={() => onClick(id)} />
          )}
      </div>
    </>
  );
};

export default VotingListBlock;

import React, { useEffect, useState, useContext } from "react";
import VotingTopDetail from "../../components/voting/VotingTopDetail.jsx";
import VotingTitle from "../../components/voting/VotingTitle.jsx";
import VotingStickChart from "../../components/voting/VotingStickChart";
import cn from "classnames/bind";

import { message, Table } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  callContractMethod,
  encodeABIValueInMethod,
  onlyCallContractMethod,
  web3Instance,
} from "../../web3.js";
import { checkUndefined, timeConverter } from "../../util.js";
import { constants } from "../../constants.js";
import Loading from "../../Loading";
import { VotingModal } from "../../components/Modal.js";
import {
  DEVMETANET_WHITE_LIST,
  MAINNET_WHITE_LIST,
  TESTNET_WHITE_LIST,
} from "../../whitelist.js";
import { GovInitCtx } from "../../contexts/GovernanceInitContext.jsx";
import { useModal } from "../../hooks/useModal.jsx";
import { useSendTransaction } from "wagmi";
import { AuthCtx } from "../../contexts/AuthContext.js";

const VotingDetail = () => {
  const { data } = useContext(GovInitCtx);
  const {
    ballotMemberOriginData,
    ballotBasicOriginData,
    waitBallotMemberOriginData,
    waitBallotBasicOriginData,
    authorityNames,
    votingDurationMax,
    votingDurationMin,
  } = data;
  const { sendTransactionAsync } = useSendTransaction();
  const { getErrModal } = useModal();
  const { address, isLoggedIn: isLogin, isMember } = useContext(AuthCtx);
  // -------------------- state
  const [ballotMemberData, setBallotMemberData] = useState({});
  const [ballotBasicData, setsBallotBasicData] = useState({});
  // 투표 선택 상태
  const [currentVote, setCurrentVote] = useState("");

  const [loading, setLoading] = useState(false);
  const [errModal, setErrModal] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [isWait, setIsWait] = useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();

  const { id, state, creator, endTime } = ballotBasicData;

  // -------------------- useEffect
  useEffect(() => {
    // 유효한 투표인지 확인
    const id = new URLSearchParams(search).get("id");
    const wait = new URLSearchParams(search).get("wait");

    const regex = /^[^0]\d*$/;
    if (id === null || !regex.test(id)) {
      openToast("Invalid Voting ID.");
      navigate("/voting/list");
      return;
    } // wait 구분 잘못된 경우 튕겨내기
    if (wait !== null && parseInt(wait) !== 1) {
      openToast("Invalid WAIT Proposal Voting ID.");
      navigate("/voting/list");
      return;
    }
    window.scrollTo(0, 0);

    getVotingData(id, wait);
  }, []);

  // -------------------- function
  const openToast = (content) => {
    message.destroy();
    message.open({
      type: "warning",
      content,
      className: "voting-toast",
    });
  };

  const getVotingData = (id, wait = "0") => {
    const basicData = parseInt(wait)
      ? waitBallotBasicOriginData
      : ballotBasicOriginData;
    const ballotBasic = Object.values(basicData, "id").filter(
      (item) => item.id.toString() === id
    )[0];
    // wait protocol인 경우 basic id 순서대로 저장되어 있음
    const ballotMember = parseInt(wait)
      ? ballotBasic
        ? waitBallotMemberOriginData[ballotBasic.id]
        : null
      : Object.values(ballotMemberOriginData).filter(
          (item) => item.id.toString() === id
        )[0];
    // 투표 정보가 없을 경우 리스트로 보내기
    if (!ballotMember || !ballotBasic) {
      openToast("No Information about this Voting ID.");
      navigate("/voting/list");
      return;
    }
    // 투표 정보를 가져올 수 없거나 투표가 캔슬된 경우 리스트로 보내기
    if (!ballotBasic.state || ballotBasic.state === "5") {
      navigate("/voting/list");
      return;
    }
    // console.log("ballotMember", ballotMember, ", ballotBasic", ballotBasic);
    setBallotMemberData(ballotMember);
    setsBallotBasicData(ballotBasic);
    setIsWait(wait === "1");
  };

  const setVoteStatus = () => {
    const {
      powerOfAccepts,
      powerOfRejects,
      acceptVoters,
      rejectVoters,
      powers,
      totalVoters,
    } = ballotBasicData;
    // 그 당시 총 멤버 수
    const previousMemberCount = Math.floor(
      (100 * parseInt(totalVoters)) / parseInt(powerOfAccepts + powerOfRejects)
    );
    // count (wait 안건은 다르게 표기)
    const countAccepts = isWait
      ? acceptVoters.length
      : state === "1"
      ? 0
      : Math.round(previousMemberCount * powerOfAccepts * 0.01); // 백분율 표기 * 0.01
    const countRejects = isWait
      ? rejectVoters.length
      : state === "1"
      ? 0
      : Math.round(previousMemberCount * powerOfRejects * 0.01);

    return (
      <>
        <VotingTitle type="sm" title="Vote status" />
        <div className={cn("chart-area")}>
          <VotingStickChart
            title="Yes"
            count={countAccepts}
            percent={isWait ? powers[1] : powerOfAccepts} // wait protocol
          />
          <VotingStickChart
            title="No"
            count={countRejects}
            // Ready 상태일 경우 0으로, 그 외의 상태일 경우
            percent={isWait ? powers[2] : powerOfRejects} // wait protocol
            type="no-type"
          />
        </div>
      </>
    );
  };

  const setVotingDate = () => {
    const { startTime, endTime, state } = ballotBasicData;
    const percent = () => {
      switch (state) {
        case "2": {
          const now = new Date().getTime() / 1000;
          // ((현재 시간 - 시작 시간)/(끝 시간 - 시작 시간)) * 100
          const deadline =
            ((parseInt(now) - startTime) / (endTime - startTime)) * 100;
          return `${deadline > 100 ? 100 : deadline}`;
        }
        case "3": // 투표 종료 시
        case "4":
          return "100";
        case "0": // 투표가 시작되지 않았 거나 기타 등등 케이스
        case "1":
        case "5":
        default:
          return "0";
      }
    };

    return (
      <div className={cn("detail-date-cont")}>
        <p className={cn("unit-date")}>
          <span>Start Date</span>
          <span>End Date </span>
        </p>
        <p className={cn("date-value")}>
          {/* 투표가 시작되지 않은 경우 텍스트로 출력 */}
          <span>
            {state === "1"
              ? "To be determined"
              : timeConverter(startTime, true)}
          </span>
          <span>
            {state === "1" ? "To be determined" : timeConverter(endTime, true)}
          </span>
        </p>
        <VotingStickChart percent={percent()} noUnit={true} type="date-type" />
      </div>
    );
  };

  const vote = async () => {
    // 투표 항목을 선택했는지 확인
    if (currentVote === "") {
      openToast("Please select a vote.");
      return;
    }
    // web3 있는지 확인
    if (!web3Instance.web3) {
      openToast("web3 is not exist");
      return;
    }
    // 로그인 됐는지 확인
    if (!isLogin) {
      openToast("Please connect your wallet.");
      return;
    }
    const network = process.env.REACT_APP_NETWORK_TYPE;
    const whiteList =
      network === "mainnet"
        ? MAINNET_WHITE_LIST
        : network === "testnet"
        ? TESTNET_WHITE_LIST
        : network === "devnet"
        ? DEVMETANET_WHITE_LIST
        : DEVMETANET_WHITE_LIST;
    // 멤버거나 화이트리스트에 추가되어 있는지 확인
    if (!(isMember || whiteList.includes(address))) {
      openToast("You are not member.");
      return;
    }

    // 이미 투표했는지 확인
    const isVoted = async () => {
      if (isWait) {
        // 찬성, 반대 투표 리스트에 있는지 확인
        const approveVote = ballotBasicData.acceptVoters.filter(
          (voter) => voter === address
        );
        const rejectVote = ballotBasicData.rejectVoters.filter(
          (voter) => voter === address
        );
        return approveVote.length || rejectVote.length;
      } else {
        return await callContractMethod(
          web3Instance,
          "ballotStorage",
          "hasAlreadyVoted",
          {
            id,
            voter: address,
          }
        );
      }
    };
    if (await isVoted()) {
      openToast("You've already voted.");
      return;
    }
    // 현재 투표 중인 항목이 있는지 확인
    const isInVoting = await onlyCallContractMethod(
      web3Instance,
      "GovImp",
      "getBallotInVoting"
    );
    if (!isWait && !(isInVoting === "0" || isInVoting === id.toString())) {
      // wait 일 경우 투표 중인 항목이 있어도 다른 투표할 수 있음
      openToast(
        "Active has an offer. Proposals in Active must be completed before voting in Proposals can proceed."
      );
      return;
    }
    // 투표 시간 확인
    if (
      state === constants.ballotState.InProgress &&
      new Date(endTime * 1000) < Date.now()
    ) {
      openToast("This Ballot is timeouted");
      this.reloadVoting(false);
      return;
    }

    const trx = encodeABIValueInMethod(
      web3Instance,
      isWait ? "WaitGovernance" : "GovImp", // wait protocol 분기 처리
      "vote",
      id,
      isWait ? currentVote : currentVote === "Yes" // wait protocol 분기 처리
    );
    sendTransaction(trx);
  };

  const sendTransaction = async (trx) => {
    setLoading(true);
    setCurrentVote("");

    trx.from = address;
    trx.gasPrice = 101000000000;
    trx.value = "0x0";
    try {
      await sendTransactionAsync(trx)
        .then(({ hash }) => {
          waitForReceipt(hash, (receipt) => {
            if (receipt.status) navigate(0);
            else {
              getErrModal(
                "The transaction could not be sent normally.",
                "Proposal Submit Error",
                receipt.transactionHash
              );
            }
          });
        })
        .catch((e) => openErrModal(e));

      // web3Instance.web3.eth.sendTransaction(trx, (e, hash) => {
      //   if (e) openErrModal(e);
      //   // receipt
      //   waitForReceipt(hash, (receipt) => {
      //     // 새로고침
      //     if (receipt.status) navigate(0);
      //     else openErrModal(e);
      //   });
      // });
    } catch (e) {
      console.error(`detail:sendTransaction: ${e}`);
      setLoading(false);
    }
  };

  // 트랜잭션 전송이 완료 됐는지 확인하는 메소드
  const waitForReceipt = (hash, cb) => {
    web3Instance.web3.eth.getTransactionReceipt(hash, (e, receipt) => {
      if (e) throw e;
      // 아직 receipt을 받지 못헀다면 다시 확인
      if (checkUndefined(receipt) || receipt === null) {
        setTimeout(() => {
          waitForReceipt(hash, cb);
        }, 1000);
      } else {
        // receipt을 받았다면 callback 함수 실행
        if (cb) cb(receipt);
      }
    });
  };

  const openErrModal = (e) => {
    const defaultMsg = e?.details || "Unknown Error";
    setLoading(false);
    setErrMessage(defaultMsg);
    setErrModal(true);
  };

  const columnsData = [
    {
      dataIndex: "voter",
      key: "voter",
      align: "left",
      render: (_, { voter }) => {
        const prefix = voter.slice(0, 6);
        const suffix = voter.slice(voter.length - 4, voter.length);
        const middle = voter.slice(6, voter.length - 4);
        return (
          <span className={cn("unit")}>
            <b>{prefix}</b>
            {middle}
            <b>{suffix}</b>
          </span>
        );
      },
    },
    {
      dataIndex: "decision",
      key: "decision",
      align: "center",
      render: (_, { decision }) => {
        return <span className={cn("vote-decision")}>{decision}</span>;
      },
    },
  ];

  return loading ? (
    <Loading txLoading={true} />
  ) : (
    <>
      <VotingTopDetail
        isWait={isWait}
        ballotMemberData={ballotMemberData}
        ballotBasicData={ballotBasicData}
        votingDurationMax={votingDurationMax}
        votingDurationMin={votingDurationMin}
        defaultAccount={address}
        authorityName={authorityNames.get(creator) || "-"}
        setTrx={(trx) => sendTransaction(trx)}
        waitBallotMemberOriginData={waitBallotMemberOriginData}
      />
      <main>
        <div className={cn("inner")}>
          {/* status content */}
          <div className={cn("detail-vote-cont")}>
            <div className={cn("status-content")}>{setVoteStatus()}</div>
            {/* cast content */}
            <div className={cn("cast-content")}>
              <VotingTitle type="sm" title="Cast your vote" />
              <div className={cn("vote-btn-area")}>
                <div className={cn("btn-wrap")}>
                  <div className={cn("voting-check-wrap")}>
                    <input
                      id={"voting-check-yes"}
                      name={"radio"}
                      type="radio"
                      onClick={() => setCurrentVote(isWait ? 1 : "Yes")}
                      disabled={state !== "1" && state !== "2"}
                    />
                    <label htmlFor={"voting-check-yes"}>Yes</label>
                  </div>
                  <div className={cn("voting-check-wrap")}>
                    <input
                      id={"voting-check-no"}
                      name={"radio"}
                      type="radio"
                      onClick={() => setCurrentVote(isWait ? 2 : "No")}
                      disabled={state !== "1" && state !== "2"}
                    />
                    <label htmlFor={"voting-check-no"}>No</label>
                  </div>
                </div>
                <button
                  className={cn("text-banner")}
                  onClick={() => vote()}
                  disabled={state !== "1" && state !== "2"}
                >
                  Vote
                </button>
              </div>
            </div>
            {/* date content */}
          </div>
          {setVotingDate()}
          {/* description */}
          <div className={cn("detail-date-cont")}>
            <p className={cn("unit-date")}>
              <span>Description</span>
            </p>
            <p className={cn("description-value")}>
              <span>
                {isWait ? ballotMemberData.description : ballotBasicData.memo}
              </span>
            </p>
          </div>
          {/* vote list */}
          {isWait && (state === "3" || state === "4") && ballotBasicData && (
            <div className={cn("detail-date-cont")}>
              <p className={cn("vote-list")}>
                <span>
                  Votes
                  <span className={cn("vote-count")}>
                    {" " +
                      `${
                        ballotBasicData.acceptVoters.length +
                        ballotBasicData.rejectVoters.length
                      }`}
                  </span>
                </span>
              </p>
              <Table
                pagination={true}
                columns={columnsData}
                dataSource={ballotBasicData.votingList}
                showHeader={false}
              />
            </div>
          )}
        </div>

        {/* error modal */}
        <VotingModal
          visible={errModal}
          isVotingModal={setErrModal}
          btn={{ btnName: "Okay", cancel: false }}
          scrollType={false}
          title="Unknown Error"
          onOk={() => {
            setErrMessage("");
            setErrModal(false);
          }}
        >
          <div className={cn("unknown-wrap")}>
            <span className={cn("error-detail")}>{errMessage}</span>
          </div>
        </VotingModal>
      </main>
    </>
  );
};

export default VotingDetail;

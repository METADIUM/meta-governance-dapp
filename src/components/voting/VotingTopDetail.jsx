import React, { useState, useCallback, useEffect } from "react";
import cn from "classnames/bind";
import Button from "./Button.jsx";
import Status from "./Status.jsx";
import { ReactComponent as IconPrev } from "../../assets/images/ic-prev.svg";

/* 23.04.20 수정: TxHashAddModal, VotingInputArea 추가 */
import { VotingModal, TxHashAddModal } from "../../components/Modal.js";
import VotingInputArea from "../voting/VotingInputArea";

import { throttle } from "lodash";
import { Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import * as util from "../../util";
import { constants, ENV_PARAMETER_COUNT } from "../../constants.js";
import { encodeABIValueInMethod, web3Instance } from "../../web3.js";

/* 23.04.20 수정: IconDelete 추가 */
import { ReactComponent as IconDelete } from "../../assets/images/ico_popup_close.svg";
import {
  DEVMETANET_WHITE_LIST,
  MAINNET_WHITE_LIST,
  TESTNET_WHITE_LIST,
} from "../../whitelist.js";

const VotingTopDetail = ({
  isWait,
  ballotMemberData,
  ballotBasicData,
  votingDurationMax,
  votingDurationMin,
  defaultAccount,
  authorityName,
  setTrx,
  waitBallotMemberOriginData,
}) => {
  const { id, creator, ballotType, state, memo } = ballotBasicData;
  const {
    lockAmount,
    envVariableName,
    envVariableValue,
    newMemberAddress,
    oldMemberAddress,
    oldStakerAddress,
    newVotingAddress,
    newRewardAddress,
    newStakerAddress,
    newVoterAddress,
    oldGovernanceAddress,
    newGovernanceAddress,
    companyName,
    companyAddress,
    description,
    link,
    txHashes,
  } = ballotMemberData;
  // -------------------- state
  const [options, setOptions] = useState([]);
  // 투표 기간 변경 시 사용
  const [selectedDuration, setSelectedDuration] = useState(0);

  const [isVotingUnknownModal, setIsVotingUnknownModal] = useState(false);
  const [isVotingDurationModal, setIsVotingDurationModal] = useState(false);

  /* 2023.04.20 수정: TxHashAddModal 팝업 추가  */
  const [isTxHashAddModal, setIsTxHashAddModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txHashArr, setTxHashArr] = useState([]);
  const [txInputErr, setTxInputErr] = useState(true);
  const [errText, setErrText] = useState("");

  const [offset, setOffset] = useState({
    width: 0,
    height: 0,
  });
  const navigate = useNavigate();

  const network = process.env.REACT_APP_NETWORK_TYPE;
  const whiteList =
    network === "mainnet"
      ? MAINNET_WHITE_LIST
      : network === "testnet"
      ? TESTNET_WHITE_LIST
      : network === "devnet"
      ? DEVMETANET_WHITE_LIST
      : DEVMETANET_WHITE_LIST;


  const resize = useCallback(() => {
    setOffset({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);
  useEffect(() => {
    resize();
    window.addEventListener("resize", throttle(resize, 200));
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  // txHashes 값이 있을 경우 채워줌
  useEffect(() => {
    if (txHashes && txHashes.length) setTxHashArr(txHashes);
  }, [txHashes]);

  // -------------------- function
  // 투표 기간 설정
  const setVotingDuration = useCallback(() => {
    const max = util.convertSecondsToDay(votingDurationMax);
    const min = util.convertSecondsToDay(votingDurationMin);

    for (let i = min; i <= max; i++) {
      const duration = {
        label: `${i} day`,
        value: i,
      };
      setOptions((prev) => [...prev, duration]);
    }
  }, [votingDurationMax, votingDurationMin]);

    useEffect(() => {
      setVotingDuration();
    }, [setVotingDuration]);

  // 투표 기간 변경 or 투표 삭제 처리
  const updateProposal = async (topic) => {
    let trx;
    try {
      if (topic === "duration") {
        // encodeABI 데이터 만들기
        trx = await encodeABIValueInMethod(
          web3Instance,
          "BallotStorage",
          "updateBallotDuration",
          id,
          util.convertDayToSeconds(selectedDuration),
        );
      } else {
        trx = await encodeABIValueInMethod(
          web3Instance,
          "BallotStorage",
          "cancelBallot",
          id,
        );
      }
      // 트랜잭션을 날리기 위해 부모 컴포넌트로 데이터를 보내줌
      setTrx(trx);
    } catch (e) {
      console.error(`votingTopDetail: updateProposal, ${e}`);
    }
  };

  // 투표 항목의 타이틀을 리턴
  const setTopic = () => {
    // MyInfo에서 변경한 항목의 타이틀 세팅
    // if (
    //   creator &&
    //   oldStakerAddress &&
    //   newStakerAddress &&
    //   newVoterAddress &&
    //   newRewardAddress
    // ) {
    //   if (
    //     ballotType === constants.ballotTypes.ReplaceAuthorityMember &&
    //     creator === oldStakerAddress
    //   ) {
    //     if (oldStakerAddress !== newVoterAddress) {
    //       return "Replace Voting Address";
    //     } else if (oldStakerAddress !== newRewardAddress) {
    //       return "Replace Reward Address";
    //     }
    //   }
    // }
    if (ballotType === constants.ballotTypes.ChangedEnv) return envVariableName;
    else if (parseInt(ballotType) > 0)
      return constants.ballotTypesArr[parseInt(ballotType)];
    // wait protocol 항목 검색 가능하도록 추가
    return companyName || "-";
  };

  // 투표 항목의 상세 표기란을 리턴
  const setDescription = () => {
    const locked =
      typeof lockAmount === "undefined"
        ? 0
        : util.convertWeiToEther(lockAmount, "ether");
    let contents = [];
    switch (ballotType) {
      // Add Authority Member
      case constants.ballotTypes.AddAuthorityMember:
        contents.push(
          {
            title: "New Authority Address",
            value: newStakerAddress,
          },
          {
            title: "WEMIX to be locked",
            class: "text-bold",
            value: `${util.addCommasToNumber(locked)} META`,
          }
        );
        break;
      // Replace Authority Member
      case constants.ballotTypes.ReplaceAuthorityMember:
        if (oldStakerAddress === newStakerAddress) {
          if (newStakerAddress !== newVoterAddress) {
            contents.push({
              title: "New Voting Address",
              value: newVoterAddress,
            });
          } else if (newStakerAddress !== newRewardAddress) {
            contents.push({
              title: "New Reward Address",
              value: newRewardAddress,
            });
          } else {
            contents.push(
              {
                title: "Old Authority Address",
                value: oldStakerAddress,
              },
              {
                title: "New Authority Address",
                value: newStakerAddress,
              },
            );
          }
        } else {
          contents.push(
            {
              title: "Old Authority Address",
              value: oldStakerAddress,
            },
            { title: "New Authority Address", value: newStakerAddress },
            {
              title: "WEMIX to be locked",
              class: "text-bold",
              value: `${util.addCommasToNumber(locked)} META`,
            }
          );
        }
        break;
      case constants.ballotTypes.RemoveAuthorityMember:
        contents.push(
          {
            title: "Remove Address",
            value: oldStakerAddress,
          },
          {
            title: "META to be locked",
            class: "text-bold",
            value: `${util.addCommasToNumber(locked)} META`,
          }
        );
        break;
      //  Governance Contract Address
      case constants.ballotTypes.GovernanceContractAddress:
        contents.push({
          title: "New Governance Address",
          value: newGovernanceAddress,
        });
        break;
      // Env Variables
      case constants.ballotTypes.ChangedEnv: {
        // 파람스의 개수
        let paramsArr = [];
        let paramsCnt = ENV_PARAMETER_COUNT[envVariableName];
        for (let i = 1; i <= paramsCnt; i++) {
          paramsArr.push("uint256");
        }

        const decodeValue = util.decodeParameters(paramsArr, envVariableValue);

        // 상세 부분에 들어갈 내용 정리
        if (envVariableName === "Voting Duration Setting") {
          contents.push({
            value: `${util.convertSecondsToDay(
              decodeValue[0],
            )}-${util.convertSecondsToDay(decodeValue[1])} day`,
          });
        } else if (envVariableName === "Authority Member Staking Amount") {
          contents.push({
            value: `${util.convertWeiToEther(
              decodeValue[0],
            )}-${util.convertWeiToEther(decodeValue[1])} WEMIX`,
          });
        } else if (envVariableName === "Block Creation Time") {
          contents.push({ value: `${decodeValue[0] / 1000} s` });
        } else if (envVariableName === "Block Reward Amount") {
          contents.push({
            value: `${util.convertWeiToEther(decodeValue[0])} WEMIX/Block`,
          });
        } else if (envVariableName === "Block Reward Distribution Method") {
          contents.push({
            value: `Distribution Rate: ${
              decodeValue[0] / 100
            }%, Staking Reward: ${decodeValue[1] / 100}%, Ecosystem: ${
              decodeValue[2] / 100
            }%, Maintenance: ${decodeValue[3] / 100}%`,
          });
        } else if (envVariableName === "MaxPriorityFeePerGas") {
          contents.push({
            value: `${util.convertWeiToGWei(decodeValue[0])} GWei`,
          });
        } else if (envVariableName === "Gas Limit & baseFee") {
          contents.push({
            value: `Gas Limit: ${util.convertWeiToGWei(
              decodeValue[0],
            )} GWei\nMax baseFee: ${
              decodeValue[1]
            } GWei\nBaseFee Max Change Rate: ${
              decodeValue[2]
            }\nGas Target Percentage: ${decodeValue[3]}`,
          });
        } else {
          contents.push({ value: "Wrong Proposal (This label is only test)" });
        }
        break;
      }
      // wait protorol 관련 코드 추가
      default: {
        if (isWait) {
          // link
          const httpsIdx = link.slice(0, 10);
          const modifiedLink = httpsIdx.includes("https://" || "http://")
            ? link
            : `https://${link}`;

          contents.push({
            title: "Company Name",
            class: "text-bold",
            value: companyName,
          });
          contents.push({
            title: "Company Wallet Address",
            class: "text-bold",
            value: companyAddress,
          });
          contents.push({
            title: "Link",
            class: "text-bold",
            value: modifiedLink,
            originValue: link,
          });
        } else {
          contents.push({
            title: "META to be locked",
            class: "text-bold",
            value: `${util.addCommasToNumber(locked)} META`,
          });
        }
        break;
      }
    }

    return (
      <div className={cn("detail-list-item")}>
        <dt>Proposal Content</dt>
        <dd>
          {contents.map((item, i) => {
            return (
              <p className={cn("item-notice")} key={i}>
                {item.title && (
                  <span className={cn("item-title")}>{item.title}</span>
                )}
                <strong
                  style={{ marginLeft: !item.title && "0px" }}
                  className={`${
                    item.class
                      ? cn(item.class)
                      : cn("pocket-address", "new-type")
                  }`}
                >
                  {/* 링크일 경우 클릭 시 이동하도록 수정 */}
                  {item.title === "Link" ? (
                    <a
                      href={item.value}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.originValue}
                    </a>
                  ) : (
                    item.value
                  )}
                </strong>
              </p>
            );
          })}
        </dd>
      </div>
    );
  };

  // txHash 입력 값 형태가 맞는지 확인
  const handleTxHashChange = (e) => {
    setTxHash(e.target.value);

    if (errText.length) setErrText("");
    setTxInputErr(!util.checkTxHash(e.target.value));
  };
  // txHashArr에 입력한 값 추가
  const handleTxHashAdd = async () => {
    try {
      const tx = await web3Instance.web3.eth.getTransaction(txHash);
      // 실제 존재하는 트랜잭션인지 확인
      if (tx === null) {
        setErrText("Transactions that do not exists.");
        return;
      }
      // 현재 안건에 이미 등록된 트랜잭션인지 확인
      const checkDuplicated = txHashArr.filter((hash) => hash === txHash);
      if (!checkDuplicated) {
        setErrText(
          "This transaction has already been included in another proposal.",
        );
        return;
      }
      // 기존 다른 안건에 등록된 트랜잭션인지 확인
      const dpList = Object.values(waitBallotMemberOriginData).map((data) => {
        const { txHashes } = data;
        if (txHashes) {
          const duplicated = txHashes.find((hash) => hash === txHash);
          return duplicated;
        }
      });
      const isDuplicated = dpList.find((hash) => hash !== undefined);
      if (isDuplicated) {
        setErrText(
          "This transaction has already been included in another proposal.",
        );
        return;
      }
      // 트랜잭션의 to address가 현재 안건에 등록된 address와 동일한지 확인
      if (tx.to !== companyAddress) {
        setErrText(
          "Please check this is the transaction sent to the company wallet address.",
        );
        return;
      }
      // 트랜잭션의 value가 0인지 확인
      if (!parseInt(tx.value)) {
        setErrText(
          "The transaction cannot be entered if the investment execution amount is 0 WEMIX.",
        );
        return;
      }
      setTxHashArr([...txHashArr, txHash]);
    } catch (err) {
      console.log(err);
    } finally {
      setTxHash("");
      setTxInputErr(true);
    }
  };
  // txHashArr에서 선택한 값 삭제
  const handleTxHashDelete = (index) => {
    setTxHashArr((arr) => arr.filter((hash, i) => i !== index));
    setTxHash("");
  };
  // txHasrArr 등록 트랜잭션을 날리기 위한 encodeABI 코드 묶기
  const handleTxHashApply = async () => {
    const trx = await encodeABIValueInMethod(
      web3Instance,
      "WaitGovernance",
      "setTransactionHashes",
      {
        id,
        txHashArr,
      },
    );
    setTrx(trx);
  };

  return (
    <>
      <div className={cn("voting-top-wrap")}>
        <div className="box">
          {/* <div className={cn("inner")}> */}
          <button
            className={cn("btn-prev")}
            onClick={() => {
              navigate("/voting/list");
            }}
          >
            <IconPrev />
          </button>
          <div className={cn("top-status-wrap")}>
            {state && <Status status={state} />}
            {/* TO CHECK: wait에서만 사용되는 지 확인 */}
            {/* {defaultAccount &&
              whiteList.includes(defaultAccount) &&
              offset.width > 1023 &&
              isWait &&
              state === "3" && ( // wait 안건이고 가결됐을 때만 tx 추가 가능
                // 23.04.20 수정: Add Tx Hash 버튼 추가
                <div className={cn("btn-wrap")}>
                  <Button
                    onClick={() => {
                      setIsTxHashAddModal(true);
                      setErrText("");
                    }}
                    type={"bg-white"}
                    text={`${txHashes.length ? "Change" : "Add"} Tx Hash (${
                      txHashes.length
                    })`}
                  />
                </div>
              )} */}
          </div>
          {/* title */}
          <div className={cn("voting-title")}>{setTopic()}</div>
          {state === "1" &&
            creator === defaultAccount && (
              <div className={cn("btn-wrap")}>
                <button
                  onClick={() => {
                    setIsVotingDurationModal(true);
                  }}
                >Change</button>
                <button
                  onClick={() => updateProposal("revoke")}
                >Revoke</button>
              </div>
            )}
        </div>

        {/*  모바일 popover 메뉴 */}
        {/* {state === "1" && creator === defaultAccount && (
          <div className={cn("detail-top-menu")}>
            <Dropdown
              overlayClassName="familysite-list-wrap"
              placement="bottomLeft"
              overlay={
                <div className={cn("detail-menu-list")}>
                  <Button
                    onClick={() => {
                      setIsVotingDurationModal(true);
                    }}
                    text="Change"
                  />
                  <Button
                    onClick={() => updateProposal("revoke")}
                    text="Revoke"
                  />
                </div>
              }
              trigger={["click"]}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <button type="button">
                <span className={cn("more-text")}>···</span>
              </button>
            </Dropdown>
          </div>
        )} */}
        {defaultAccount &&
          whiteList.includes(defaultAccount) &&
          isWait &&
          state === "3" && (
            <div className={cn("detail-top-menu")}>
              <Dropdown
                overlayClassName="familysite-list-wrap"
                placement="bottomLeft"
                overlay={
                  <div className={cn("detail-menu-list")}>
                    {/* 23.04.20 수정: Add Tx Hash 버튼 추가 */}
                    <Button
                      onClick={() => setIsTxHashAddModal(true)}
                      text={`${txHashes.length ? "Change" : "Add"} Tx Hash (${
                        txHashes.length
                      })`}
                    />
                  </div>
                }
                trigger={["click"]}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <button type="button">
                  <span className={cn("more-text")}>···</span>
                </button>
              </Dropdown>
            </div>
          )}
        {/* 설명 부분 */}
        <div className={cn("detail-top-content")}>
          <dl className={cn("detail-top-list")}>
            <div className={cn("detail-list-item")}>
              <dt>Proposer</dt>
              <dd>
                <p className={cn("item-notice", "proposer")}>
                  <strong className={cn("item-title")}>{authorityName}</strong>
                  <span className={cn("pocket-address")}>{creator}</span>
                </p>
              </dd>
            </div>
            {setDescription()}
          </dl>
        </div>
        {/* </div> */}
      </div>

      {/* duration modal */}
      <VotingModal
        visible={isVotingDurationModal}
        isVotingModal={setIsVotingDurationModal}
        btn={{ btnName: "Ok", cancel: true }}
        onOk={() => updateProposal("duration")}
        scrollType={true}
        title="Voting Duration Change"
      >
        <div className={"day-select-wrap"}>
          <ul className={cn("label-list")}>
            {options.map((t, i) => (
              <li className={cn("label-option")} key={`${t}-${i}`}>
                <input
                  id={`dayCheck${i}`}
                  name={"radio"}
                  type="radio"
                  value={t.value}
                  onChange={() => setSelectedDuration(t.value)}
                />
                <label htmlFor={`dayCheck${i}`}>{t.label}</label>
              </li>
            ))}
          </ul>
        </div>
      </VotingModal>

      {/* error modal */}
      <VotingModal
        visible={isVotingUnknownModal}
        isVotingModal={setIsVotingUnknownModal}
        btn={{ btnName: "Okay", cancel: false }}
        scrollType={false}
        title="Unknown Error"
      >
        <div className={cn("unknown-wrap")}>
          <span className={cn("error-detail")}>
            MetaMask Tx Signature: User denied transaction signature
          </span>
        </div>
      </VotingModal>

      {/* 23.04.20 수정 start: TxHashAddModal 추가 */}
      <TxHashAddModal
        visible={isTxHashAddModal}
        isTxHashAddModal={setIsTxHashAddModal}
        onApply={() => handleTxHashApply()}
        disabled={!txHashArr.length} // 입력된 hash 값이 없으면 disabled 처리
        scrollType={true}
        onCancel={() => {
          setIsTxHashAddModal(false);
          setTxInputErr(true);
          setTxHash("");
          setTxHashArr(txHashes.length ? txHashes : []);
        }}
      >
        <div className={cn("tx-hash-add-content-wrap")}>
          <div className={"hash-add-wrap"}>
            <VotingInputArea
              name="AddTxHash"
              inputType={"default"}
              placeholder={"Add Tx Hash"}
              value={txHash}
              onChange={(e) => handleTxHashChange(e)}
              errType={errText}
              errText={errText}
            />
            <Button
              type="bg"
              text="Add"
              size="sm"
              disabled={txInputErr}
              onClick={() => handleTxHashAdd()}
            />
          </div>
          <ul className={cn("hash-add-list")}>
            {txHashArr.map((hash, i) => {
              return (
                <li className={cn("tx-hash")} key={i}>
                  <span className={cn("hash-number")}>
                    {offset.width > 1023 ? hash : util.loginAcc(hash)}
                  </span>
                  <button type="button" onClick={() => handleTxHashDelete(i)}>
                    <IconDelete />
                    <span className={cn("a11y")}>delete</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </TxHashAddModal>
      {/* 23.04.20 수정 end: TxHashAddModal 추가 */}
    </>
  );
};

export default VotingTopDetail;

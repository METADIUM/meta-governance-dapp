import cn from "classnames/bind";
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef
} from "react";
import { useNavigate } from "react-router-dom";
import { useSendTransaction } from "wagmi";

// import { ReactComponent as IconEmpty } from "../../assets/images/ico_empty.svg";

import MoreButton from "../../components/voting/GovButton.jsx";
import VotingListBlock from "../../components/voting/VotingListBlock.jsx";
import VotingTitle from "../../components/voting/VotingTitle.jsx";
import VotingTopList from "../../components/voting/VotingTopList.jsx";
import {
  constants,
  DEVMETANET_CONTRACTS,
  MAINNET_CONTRACTS,
  TESTNET_CONTRACTS
} from "../../constants.js";
import { AuthCtx } from "../../contexts/AuthContext.js";
import { GovInitCtx } from "../../contexts/GovernanceInitContext.jsx";
import { ModalContext } from "../../contexts/ModalContext.jsx";
import { checkUndefined } from "../../util.js";
import { web3Instance } from "../../web3.js";

// 화면에  뿌릴 갯수
const viewingCount = 5;

const VotingList = () => {
  const { address, isMember, isLoggedIn } = useContext(AuthCtx);
  const { getErrModal } = useContext(ModalContext);
  const { data } = useContext(GovInitCtx);
  const {
    // authorityOriginData,
    ballotMemberOriginData,
    ballotBasicOriginData,
    authorityNames,
    waitBallotBasicOriginData
  } = data;
  const { sendTransactionAsync } = useSendTransaction();
  // -------------------- state
  const [ballotBasicOriginItems, setBallotBasicOriginItems] = useState([]);
  // 리스트에 출력할 항목
  const [activeItems, setActiveItems] = useState([]);
  const [proposalItems, setProposalItems] = useState([]);
  const [finalizedItems, setFinalizedItems] = useState([]);
  const [revokeItems, setRevokeItems] = useState([]);
  // 상태 별 항목의 개수
  const [itemCount, setItemCount] = useState({});
  // filtering
  const [currentSelect, setCurrentSelect] = useState("All");
  const [visibleActiveItems, setVisibleActiveItems] = useState([]);
  const [visibleFinalizedItems, setVisibleFinalizedItems] = useState([]);
  const [renderSelectedItems, setRenderSelectedItems] = useState(<></>);

  const [loading, setLoading] = useState(false);
  const [errModal, setErrModal] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const navigate = useNavigate();

  // select 옵션
  const filterData = ["All", "Active & Proposal", "Finalized"];

  // finalized에서 보여질 아이템의갯수
  const viewingActiveItems = useRef(viewingCount);
  const viewingFinalizedItems = useRef(viewingCount);

  // -------------------- useEffect
  useEffect(() => {
    getBallotOriginItem();
  }, [
    ballotBasicOriginData,
    waitBallotBasicOriginData,
    isMember,
    viewingFinalizedItems,
    getBallotOriginItem
  ]);

  useEffect(() => {
    // 리스트 생성 후 상세 내용 가져옴
    if (ballotBasicOriginItems.length > 0) {
      getBallotDetailInfo();
    }
  }, [ballotBasicOriginItems, getBallotDetailInfo]);

  useEffect(() => {
    // 리스트를 가져온 후 화면에 뿌리기 위한 용도
    if (Object.keys(itemCount)) {
      handleSelect();
    }
  }, [handleSelect, itemCount]);

  // 검색 후 리스트 업데이트
  useEffect(() => {
    handleSelect(currentSelect);
  }, [visibleActiveItems, visibleFinalizedItems, handleSelect, currentSelect]);

  const openErrModal = (e) => {
    const _msg = e?.details || "Unknown Error";
    setLoading(false);
    setErrMessage(_msg);
    setErrModal(true);
  };

  // 현재 진행 중인 투표를 다 close
  const sendTransaction = async (id = "") => {
    if (!isMember) return;
    setLoading(true);
    const trx = id.length
      ? await web3Instance.web3Contracts.WaitGovernance.methods
          .finalizeEndedVote(id)
          .encodeABI()
      : await web3Instance.web3Contracts.GovImp.methods
          .finalizeEndedVote()
          .encodeABI();

    // 각 네트워크에 맞는 GovImp address (또는 WaitGovernance address) 가져오기
    const network = process.env.REACT_APP_NETWORK_TYPE;
    const contracts =
      network === "mainnet"
        ? MAINNET_CONTRACTS
        : network === "testnet"
        ? TESTNET_CONTRACTS
        : DEVMETANET_CONTRACTS;
    const to = contracts.filter(
      (item) => item.name === `${id.length ? "WaitGovernance" : "GovImp"}`
    )[0].address;
    try {
      /*
        from, to, data, gasPrice, value 중 어느값이 없으면 데이터를 화면에 그리지 못합니다.
      **/
      await sendTransactionAsync({
        from: address,
        to,
        data: trx,
        gasPrice: 110000000000,
        value: "0x0"
      })
        .then(({ hash }) => {
          waitForReceipt(hash, async (receipt) => {
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
      // web3Instance.web3.eth.sendTransaction(
      //   {
      //     from: address,
      //     to,
      //     data: trx,
      //     gasPrice: 101000000000,
      //   },
      //   (e, hash) => {
      //     if (e) openErrModal(e);
      //     // receipt
      //     waitForReceipt(hash, (receipt) => {
      //       // 새로고침
      //       if (receipt.status) navigate(0);
      //       else {
      //         getErrModal(
      //           "The transaction could not be sent normally.",
      //           "Proposal Submit Error",
      //           receipt.transactionHash,
      //         );
      //       }
      //     });
      //   },
      // );
    } catch (e) {
      getErrModal(
        "The transaction could not be sent normally.",
        "Proposal Submit Error",
        e
      );
      setLoading(false);
    }
  };

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

  // -------------------- function
  // 화면에 뿌릴 리스트를 만들어 줌
  const getBallotOriginItem = () => {
    if (!ballotBasicOriginData || !ballotMemberOriginData) return;
    let list = [];
    // 일반 proposal

    Object.values(ballotBasicOriginData).forEach((item, index) => {
      list.push(
        <VotingListBlock
          key={index}
          item={item}
          authorityName={authorityNames.get(item.creator) || "-"}
          ballotMemberOriginData={ballotMemberOriginData[item.id]}
          setTopic={(item) => setTopic(item)}
          onClick={sendTransaction}
          isMember={isMember}
        />
      );
    });
    setBallotBasicOriginItems(list.reverse());
  };

  // 각 항목 별 상세 정보를 가져옴
  const getBallotDetailInfo = useCallback(() => {
    let activeList = [];
    let proposalList = [];
    let finalizedList = [];
    let revokeList = [];

    let active = 0;
    let proposal = 0;
    let approved = 0;
    let rejected = 0;

    // 상태 별로 나누어 저장
    ballotBasicOriginItems.forEach((item) => {
      switch (item.props.item.state) {
        case constants.ballotState.InProgress:
          activeList.push(item);
          active++;
          break;
        case constants.ballotState.Ready:
          proposalList.push(item);
          proposal++;
          break;
        case constants.ballotState.Approved:
          finalizedList.push(item);
          approved++;
          break;
        case constants.ballotState.Rejected:
          // 투표 기간이 지나 자동으로 rejected된 proposal
          if (item.props.item.isFinalized === "") {
            revokeList.push(item);
          } else {
            finalizedList.push(item);
          }
          rejected++;
          break;
        case constants.ballotState.Invalid:
        default:
          break;
      }
    });

    // finalized 투표 종료된 순으로 출력
    const sortFinalizedList = finalizedList.sort(
      (s, l) => l.props.item.endTime - s.props.item.endTime
    );

    setActiveItems(activeList);
    setProposalItems(proposalList);
    setFinalizedItems(sortFinalizedList);
    setRevokeItems(revokeList);

    setVisibleActiveItems(
      [...activeList, ...proposalList].slice(0, viewingCount)
    );
    setVisibleFinalizedItems(sortFinalizedList.slice(0, viewingCount));

    setItemCount({
      ...itemCount,
      total: active + proposal + approved + rejected,
      active,
      proposal,
      approved,
      rejected
    });
  });

  // 투표 항목의 타이틀을 리턴
  const setTopic = ({
    creator,
    ballotType,
    envVariableName,
    oldStakerAddress,
    newStakerAddress,
    newVoterAddress,
    newRewardAddress,
    companyName
  }) => {
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
    else if (parseInt(ballotType) > 0) {
      return constants.ballotTypesArr[parseInt(ballotType)];
    }
    // wait protocol 항목 검색 가능하도록 추가
    return companyName || "-";
  };

  const searchBallot = (e) => {
    // 입력한 값이 투표 제목이나 투표 생성자에 포함되는지 확인
    const filteringBallot = (ballots, str) => {
      return ballots.filter((value) => {
        const { creator, ballotType } = value.props.item;
        const {
          envVariableName,
          oldStakerAddress,
          newStakerAddress,
          newVoterAddress,
          newRewardAddress,
          companyName
        } = value.props.ballotMemberOriginData;
        let topic = setTopic({
          creator,
          ballotType,
          envVariableName,
          oldStakerAddress,
          newStakerAddress,
          newVoterAddress,
          newRewardAddress,
          companyName
        });
        return [topic, value.props.item.creator].some((elem) => {
          return elem.toLowerCase().indexOf(str) !== -1;
        });
      });
    };

    const str = e.target.value.toLowerCase();
    // 입력한 값이 없다면 전체 리스트를 보여줌
    if (str === "") {
      getBallotDetailInfo();
      return;
    }

    setVisibleActiveItems([
      ...filteringBallot(activeItems, str),
      ...filteringBallot(proposalItems, str)
    ]);
    setVisibleFinalizedItems(filteringBallot(finalizedItems, str));
  };

  // select 옵션 변경에 따른 항목 렌더링
  const handleSelect = useCallback((e = filterData[0]) => {
    const props = [];
    // 옵션에 따른 props 값 적용
    if (e === filterData[0] || e === filterData[1]) {
      props.push({
        title: filterData[1],
        count: `${activeItems.length + proposalItems.length}`,
        items: visibleActiveItems
      });
    }
    if (e === filterData[0] || e === filterData[2]) {
      props.push({
        title: filterData[2],
        count: `${finalizedItems.length}`,
        items: visibleFinalizedItems
      });
    }

    const render = props.map((prop) => {
      return (
        <div className={cn("voting-list-section")} key={prop.title}>
          <VotingTitle
            type="md"
            title={prop.title}
            count={prop.count}
            isMember={isMember}
          />
          {prop.items.length ? (
            <>
              <div className={cn("section-inner")}>{prop.items}</div>
              {prop.title === "Finalized" &&
                finalizedItems.length >= 1 &&
                finalizedItems.length > visibleFinalizedItems.length && (
                  <MoreButton
                    text={"More"}
                    type={"more-btn"}
                    onClick={() => {
                      viewingFinalizedItems.current += viewingCount;
                      setVisibleFinalizedItems([
                        ...finalizedItems.slice(
                          0,
                          viewingFinalizedItems.current
                        )
                      ]);
                    }}
                  />
                )}
              {prop.title !== "Finalized" &&
                activeItems.length + proposalItems.length >= 1 &&
                activeItems.length + proposalItems.length >
                  visibleActiveItems.length && (
                  <MoreButton
                    text={"More"}
                    type={"more-btn"}
                    onClick={() => {
                      viewingActiveItems.current += viewingCount;
                      setVisibleActiveItems([
                        ...[...activeItems, ...proposalItems].slice(
                          0,
                          viewingActiveItems.current
                        )
                      ]);
                    }}
                  />
                )}
            </>
          ) : (
            <div className="section-inner empty">
              <div className={cn("empty-area")}>
                <div className={cn("empty-notice")}>
                  {/* 23.04.11 수정: 아이콘 삭제 */}
                  {/* <IconEmpty /> */}
                  <strong className={cn("empty-title")}>No result</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
    setCurrentSelect(e);
    setRenderSelectedItems(render);
  });
  return (
    <>
      <VotingTopList
        isMember={isMember}
        totalCount={itemCount.total || 0}
        activeCount={itemCount.active || 0}
        readyCount={itemCount.proposal || 0}
        approvedCount={itemCount.approved || 0}
        rejectedCount={itemCount.rejected || 0}
      />
      <div className="section-body">
        <div className="wrap">
          <div className={cn("content-filter-wrap")}>
            <VotingTitle
              type="sm"
              title=""
              count={""}
              searchName="search-type"
              searchBallot={(e) => searchBallot(e)}
              filterData={filterData}
              handleSelect={(e) => handleSelect(e)}
              onClose={() => getBallotDetailInfo()}
              isMember={isMember}
              isConnect={isLoggedIn}
            />
            <div className={cn("filter-wrap")} />
            {/* filter-wrap?? */}
          </div>
          {/* voting time over - filter와 상관없이 고정 */}
          {revokeItems.length > 0 && (
            <div className={cn("voting-list-section", "revoke-item")}>
              <VotingTitle
                type="md"
                title={"Voting Time Over"}
                count={revokeItems.length}
                exp={
                  <>
                    The proposed vote was rejected because more than 50% of the
                    votes were not carried out.
                    <strong>
                      Please cancel the proposal to proceed with another vote.
                    </strong>
                  </>
                }
              />
              <div className={cn("section-inner")}>{revokeItems}</div>
            </div>
          )}
          {renderSelectedItems}
        </div>
      </div>
    </>
  );
};

export default VotingList;

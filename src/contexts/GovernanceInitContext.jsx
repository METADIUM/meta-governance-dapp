import React, { createContext, useEffect, useContext } from "react";

import { useState, useRef } from "react";
import getWeb3Instance, {
  callBatchMethod,
  callContractMethod,
  onlyCallBatchMethod,
  onlyCallContractMethod,
  web3Instance,
} from "../web3";
import * as util from "../util";
import { constants, ENV_VOTING_PROPOSAL_LIST } from "../constants";
import AuthorityList from "../static/AuthorityList.json";
import { ModalContext } from "../contexts/ModalContext";

const initData = {
  ballotTypeData: [],
  stakingMax: null,
  stakingMin: null,
  votingDurationMin: null,
  votingDurationMax: null,
  memberLength: 0,
  voteLength: 0,
  authorityOriginData: [],
  authorityNames: new Map(),
  ballotMemberOriginData: {},
  ballotBasicOriginData: {},
  waitBallotLength: 0,
  waitBallotMemberOriginData: {},
  waitBallotBasicOriginData: {},
};

const GovInitCtx = createContext();

const GovInitProvider = ({ children }) => {
  const { getErrModal } = useContext(ModalContext);
  const { current: data } = useRef(initData);

  // const [web3Ins, setWeb3Ins] = useState();
  const [isContractReady, setIsContractReady] = useState(false);
  const [isWeb3Loaded, setIsWeb3Loaded] = useState(false);
  const [web3, setWeb3Instance] = useState();
  const [accessFailMsg, setAccessFailMsg] = useState("");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await getWeb3Instance().then(
      async (data) => {
        // get governance variables
        await getGovernanceVariables();
        // get authority list and ballot data
        await getContractAuthorityBallots();
        // get WAIT Protocol ballot data
        // await getWaitBallots();
        console.log("debugMode: ", constants.debugMode);
        setIsWeb3Loaded(true);
        setWeb3Instance(data);
      },
      async (error) => {
        console.log("getWeb3 error: ", error);
        setIsWeb3Loaded(false);
        setAccessFailMsg(error.message);
      }
    );
  };

  const asyncExecuteBatch = async (batch) => {
    return new Promise((resolve, reject) => {
      let requests = batch.requests;

      batch.requestManager.sendBatch(requests, (err, results) => {
        results = results || [];
        let response = requests
          .map((request, index) => {
            return results[index] || {};
          })
          .map((result, index) => {
            return requests[index].format
              ? requests[index].format(result.result)
              : result.result;
          });

        resolve(response);
      });
    });
  };

  const getGovernanceVariables = async () => {
    const br = new web3Instance.web3.BatchRequest();
    // related staking (get the minimum and maximum values that can be staked)
    br.add(onlyCallBatchMethod(web3Instance, "EnvStorageImp", "getStakingMin"));
    br.add(onlyCallBatchMethod(web3Instance, "EnvStorageImp", "getStakingMax"));
    // related voting duration (get voting duration minium and maximum values)
    br.add(
      onlyCallBatchMethod(
        web3Instance,
        "EnvStorageImp",
        "getBallotDurationMinMax"
      )
    );
    // related member length
    br.add(onlyCallBatchMethod(web3Instance, "GovImp", "getMemberLength"));
    // voting length (여태까지 투표된 숫자)
    br.add(onlyCallBatchMethod(web3Instance, "GovImp", "voteLength"));

    try {
      const [stakingMin, stakingMax, duration, memberLength, voteLength] =
        await asyncExecuteBatch(br);

      data.stakingMin = util.convertWeiToEther(stakingMin);
      data.stakingMax = util.convertWeiToEther(stakingMax);
      data.votingDurationMin = duration[0];
      data.votingDurationMax = duration[1];
      data.memberLength = memberLength;
      data.voteLength = voteLength;
    } catch (err) {
      getErrModal(err.message, err.name);
    }
    setIsContractReady(true);
  };

  const getContractAuthorityBallots = async () => {
    await initAuthorityData();
    await initBallotData();
    util.setUpdatedTimeToLocal(new Date());
  };

  // get a static list for network status from github repository
  const initAuthorityData = async () => {
    const authorityList = AuthorityList[process.env.REACT_APP_MODE] || [];
    data.authorityOriginData = await refineAuthority(authorityList);
    util.setAuthorityToLocal(data.authorityOriginData);

    // 멤버의 address와 name으로 Map을 만들어 줌
    Object.values(data.authorityOriginData).forEach((item) =>
      data.authorityNames.set(item.addr, item.title)
    );
  };

  // to make sure that the authority is included
  const refineAuthority = async (authorityList) => {
    let memberAuthority = {};
    let index = 0;

    // ??
    for (let i = 0; i < Object.keys(authorityList).length; i++) {
      if (
        await callContractMethod(
          web3Instance,
          "GovImp",
          "isMember",
          authorityList[i].addr
        )
      ) {
        memberAuthority[index] = authorityList[i];
        memberAuthority[index].addr = web3Instance.web3.utils.toChecksumAddress(
          memberAuthority[index].addr
        );
        index++;
      }
    }
    return memberAuthority;
  };

  // get the ballot list stored in localStorage
  // or initalize new ballot list
  const initBallotData = async () => {
    let ballotBasicFinalizedData = {};
    let ballotMemberFinalizedData = {};
    let localDataUpdated = false;

    const brBallotBasic = new web3Instance.web3.BatchRequest();
    const brBallotMember = new web3Instance.web3.BatchRequest();

    const ballotCnt = await onlyCallContractMethod(
      web3Instance,
      "GovImp",
      "ballotLength"
    );
    if (!ballotCnt) return;
    // proposal 데이터 batch 세팅
    for (let i = 1; i <= ballotCnt; i++) {
      brBallotBasic.add(
        callBatchMethod(web3Instance, "BallotStorage", "getBallotBasic", i)
      );
    }
    try {
      // batch call
      const ballotBasic = await asyncExecuteBatch(brBallotBasic);
      ballotBasic.map((ret, i) => {
        i++;
        // proposal 데이터 가공
        getBallotBasicOriginDataNew(ret, i, ballotBasicFinalizedData);
        // proposal 형태에 따른 투표 내용 batch 세팅
        switch (ret.ballotType) {
          case "4":
            brBallotMember.add(
              callBatchMethod(
                web3Instance,
                "BallotStorage",
                "getBallotAddress",
                i
              )
            );
            break;
          case "5":
            brBallotMember.add(
              callBatchMethod(
                web3Instance,
                "BallotStorage",
                "getBallotVariable",
                i
              )
            );
            break;
          case "1":
          default:
            brBallotMember.add(
              callBatchMethod(
                web3Instance,
                "BallotStorage",
                "getBallotMember",
                i
              )
            );
            break;
        }
      });
    } catch (err) {
      console.log("E", err);
      getErrModal(err.message, err.name);
    }
    try {
      // proposal 투표 내용 batch call
      const ballotMember = await asyncExecuteBatch(brBallotMember);
      ballotMember.map((result, i) => {
        i++;
        const isUpdatd = ballotBasicFinalizedData[i] !== undefined; // 투표 상태가 approved 이거나 rejected 인 경우
        // proposal 투표 내용 가공
        getBallotMemberOriginDataNew(
          result,
          i,
          isUpdatd,
          ballotMemberFinalizedData
        );
      });
    } catch (err) {
      getErrModal(err.message, err.name);
    }
    if (localDataUpdated) {
      util.setBallotBasicToLocal(ballotBasicFinalizedData);
      util.setBallotMemberToLocal(ballotMemberFinalizedData);
    }
  };

  // proposal 내용 세팅
  const getBallotBasicOriginDataNew = (
    ret,
    i,
    ballotBasicFinalizedData = {}
  ) => {
    // MyInfo 변경 내용은 화면 출력 X (조건: finalized, ballotType: 3, Accepts: 0)
    if (
      ret.isFinalized &&
      ret.ballotType === "3" &&
      ret.powerOfAccepts === "0"
    ) {
      return;
    }
    data.ballotTypeData[i] = ret.ballotType; // for sorting ballot data
    ret.id = i; // add ballot id

    util.refineBallotBasic(ret);
    data.ballotBasicOriginData[i] = ret;

    // 투표가 끝난 경우 finalized 리스트에 저장
    if (
      ret.state === constants.ballotState.Approved ||
      ret.state === constants.ballotState.Rejected
    ) {
      ballotBasicFinalizedData[i] = ret;
    }
  };

  // proposal 투표 상세 내용 세팅
  const getBallotMemberOriginDataNew = (
    result,
    i,
    isUpdated = false,
    ballotMemberFinalizedData = {}
  ) => {
    const type = data.ballotTypeData[i];
    // changeEnv의 경우 envVariableName을 세팅해줌
    if (type === "5") {
      const type = ENV_VOTING_PROPOSAL_LIST.filter((key) => {
        return key.sha3Name === result.envVariableName;
      })[0] || { id: "Wrong Proposal (This label is only test)" };
      result.envVariableName = type.id;
    }

    // change governance address 의 경우
    if (typeof result !== "object") {
      result = { newGovernanceAddress: result };
    }
    // delete duplicate key values that web3 returns
    for (let key in result) {
      if (!isNaN(key)) delete result[key];
    }

    result.id = i; // add ballot id
    data.ballotMemberOriginData[i] = result;
    if (isUpdated) ballotMemberFinalizedData[i] = result;
  };

  return (
    <GovInitCtx.Provider
      value={{
        isWeb3Loaded,
        isContractReady,
        data,
        accessFailMsg,
      }}>
      {children}
    </GovInitCtx.Provider>
  );
};

export { GovInitProvider, GovInitCtx };

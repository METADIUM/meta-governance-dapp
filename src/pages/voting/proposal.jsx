import cn from "classnames/bind";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSendTransaction } from "wagmi";

import * as PComponent from "../../components/Forms";
import * as MComponent from "../../components/MyForm";
import VotingTopProposal from "../../components/voting/VotingTopProposal.jsx";
import "../../assets/scss/proposal.scss";

import {
  constants,
  ENV_MY_INFO_PROPOSAL_LIST,
  ENV_NAMES,
  ENV_VOTING_PROPOSAL_LIST,
} from "../../constants";
import { AuthCtx } from "../../contexts/AuthContext.js";
import { GovInitCtx } from "../../contexts/GovernanceInitContext.jsx";
import { ModalContext } from "../../contexts/ModalContext.jsx";
import { removeCommasFromNumber, addCommasToNumber } from "../../util";
import * as util from "../../util";
import * as abis from "../../abis/index";
import AuthorityList from "../../static/AuthorityList.json";

import {
  callContractMethod,
  encodeABIValueInMethod,
  web3Instance,
} from "../../web3";
import {
  DEVMETANET_WHITE_LIST,
  MAINNET_WHITE_LIST,
  TESTNET_WHITE_LIST,
} from "../../whitelist.js";

const Proposal = () => {
  const { getErrModal } = useContext(ModalContext);
  const { address } = useContext(AuthCtx);
  const { pathname } = useLocation();
  const { data } = useContext(GovInitCtx);
  const {
    stakingMax,
    stakingMin,
    votingDurationMax,
    votingDurationMin,
    ballotMemberOriginData,
    ballotBasicOriginData,
    memberLength,
  } = data;

  const { sendTransactionAsync } = useSendTransaction();
  const waitBallotLength = parseInt(data.waitBallotLength || 0) + 1;
  const [formData, setFormData] = useState({
    votDuration: 1,
    newLockAmount: stakingMin,
    oldLockAmount: stakingMin,
    staker: "",
    name: "",
    enode: "",
    ip: "",
    port: "",
    lockAmount: 0,
    oldStaker: "",
  });
  const [errState, setErrState] = useState({});

  const [selectedTopic, setSelectedTopic] = useState("");
  const [onLoading, setOnLoading] = useState(false);

  const [newMemberaddr, setNewMemberAddr] = useState([]);
  const [oldMemberaddr, setOldMemberAddr] = useState([]);

  // replace, remove authority memebr
  const [existBallotNewMember, setExistBallotNewMember] = useState([]);
  const [existBallotOldMember, setExistBallotOldMember] = useState([]);

  const [oldVotingAddr, setOldVotingAddr] = useState();
  const [oldRewardAddr, setOldRewardAddr] = useState();
  const [memberIdx, setMemberIdx] = useState();
  const [showProposal, setShowProposal] = useState(false);
  const [selectedMenu, setIsSelectedMenu] = useState("menu-voting");

  useEffect(() => {
    if (pathname === "/my-info") {
      setShowProposal(true);
      setIsSelectedMenu("menu-myinfo");
    } else {
      setShowProposal(false);
      setIsSelectedMenu("menu-voting");
    }
  }, [pathname]);

  // get information for send transaction (Myinfo)
  const getMyAddress = async (address, memberLength) => {
    try {
      let memberIdx = 1;
      for (memberIdx; memberIdx <= memberLength; memberIdx++) {
        const staker = await callContractMethod(
          web3Instance,
          "GovImp",
          "getMember",
          memberIdx
        );
        if (staker === address) {
          break;
        }
      }
      // get member info
      const oldVotingAddr = await callContractMethod(
        web3Instance,
        "GovImp",
        "getVoter",
        memberIdx
      );
      const oldRewardAddr = await callContractMethod(
        web3Instance,
        "GovImp",
        "getReward",
        memberIdx
      );

      setOldVotingAddr(oldVotingAddr);
      setOldRewardAddr(oldRewardAddr);
      setMemberIdx(memberIdx);
    } catch (err) {
      console.log(err);
      this.getErrModal(err.message, err.name);
    }
  };

  useEffect(() => {
    getMyAddress(address, memberLength);
  }, [address, memberLength]);

  // Block Reward Distribution Method 초기값
  const [tempRates, setTempRates] = useState({
    blockRates: {
      blockRate1: 0,
      blockRate2: 0,
      blockRate3: 0,
      blockRate4: 0,
    },
    blockRateTotal: 0,
    blockRewardDisMthErr: false,
  });

  // 새로고침 시 selecTedtopic 유지되도록 저장
  const currentTopic = window.localStorage.getItem("selectedTopic");

  useEffect(() => {
    if (currentTopic) {
      setSelectedTopic(currentTopic);
    } else {
      if (showProposal) {
        setSelectedTopic("VotingAddress");
      } else setSelectedTopic("AddAuthorityMember");
    }
    getMemberList();
  }, [currentTopic, getMemberList, showProposal]);

  useEffect(() => {
    if (selectedMenu === "menu-myinfo") {
      if (currentTopic === "RewardAddress") {
        setSelectedTopic("RewardAddress");
      } else setSelectedTopic("VotingAddress");
    }
  }, [currentTopic, selectedMenu]);

  useEffect(() => {
    // submit 하기 위한 디폴트 값 formData에 세팅
    if (memberIdx) {
      getMyInfo();
    }
  }, [getMyInfo, memberIdx]);

  // replace, remove authority member
  const getMemberList = () => {
    if (!ballotMemberOriginData || !ballotMemberOriginData) return;
    Object.values(ballotBasicOriginData).forEach((item, i) => {
      const { newStakerAddress, oldStakerAddress } =
        ballotMemberOriginData[item.id];

      if (
        item.state === constants.ballotState.Ready ||
        item.state === constants.ballotState.InProgress
      ) {
        existBallotNewMember.push(newStakerAddress);
        existBallotOldMember.push(oldStakerAddress);
      }
    });
  };

  const getLockAmount = async (addr) => {
    if (!util.checkAddress(addr)) {
      getErrModal("Staking Address is Invalids.", "Proposal Submit Error");
      setFormData({
        ...formData,
        showLockAmount: "",
      });
      // setShowLockAmount("");
      return;
    } else if (!web3Instance.web3.utils.checkAddressChecksum(addr)) {
      addr = web3Instance.web3.utils.toChecksumAddress(addr);
    }
    if (!(await callContractMethod(web3Instance, "GovImp", "isMember", addr))) {
      getErrModal("Non-existing Member Address.", "Proposal Submit Error");
      setFormData({
        ...formData,
        showLockAmount: "",
      });
      // setShowLockAmount("");
      return;
    }

    try {
      let lockedBalance = await callContractMethod(
        web3Instance,
        "Staking",
        "lockedBalanceOf",
        addr
      );
      setFormData({
        ...formData,
        showLockAmount: util.convertWeiToEther(lockedBalance),
      });
      // setShowLockAmount();
    } catch (err) {
      console.log(err);
      getErrModal(err.message, err.name);
      setOnLoading(false);
      setFormData({
        ...formData,
        showLockAmount: "",
      });
      // setShowLockAmount("");
    }

    setErrState({
      ...errState,
      showLockAmountErr: false,
    });
  };

  const resetForm = () => {
    setFormData({
      votDuration: 1,
      newLockAmount: stakingMin,
      oldLockAmount: stakingMin,
      staker: "",
      name: "",
      enode: "",
      ip: "",
      port: "",
      lockAmount: 0,
      oldStaker: "",
    });
    // setShowLockAmount("");
    // block distribution
    setTempRates({
      blockRates: {
        blockRate1: 0,
        blockRate2: 0,
        blockRate3: 0,
        blockRate4: 0,
      },
      blockRateTotal: 0,
      blockRewardDisMthErr: false,
    });
    // clear errstate
    setErrState({});
    // }
  };

  // only, when the topic has changed
  const handleSelectTopicChange = async (topic) => {
    const isMyInfo = ENV_MY_INFO_PROPOSAL_LIST.filter(
      (item) => item.value === topic
    )[0];

    setSelectedTopic(topic);
    window.localStorage.setItem("selectedTopic", topic);

    resetForm();

    // getmyInfo가 필요한 topic
    if (
      topic === "AddAuthorityMember" ||
      topic === "ReplaceAuthorityMember" ||
      isMyInfo
    ) {
      getMyInfo();
    }
  };

  // when the select option has changed
  const handleSelectChange = (e) => {
    let [name, value] = e.split("_");
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChange = (e) => {
    // if selected value is topic
    if (typeof e === "string") {
      return handleSelectChange(e);
    }

    const regex = /gas|Gas|Fee|fee|Amount|amount/;
    let targetValue = e.target.value;
    if (regex.test(e.target.name)) {
      // console.log(
      //   "gas|Gas|Fee|fee|Amount|amount 가 e.target.name에 포함되어 있습니다.",
      // );
      // amount들은 숫자에 콤마를 찍어놨기 때문에 초기화
      targetValue = removeCommasFromNumber(targetValue);
    }
    const originStr = { ...formData, [e.target.name]: "" };

    setFormData({
      ...formData,
      [e.target.name]: targetValue,
    });
    switch (e.target.name) {
      // Add Authority Member
      case "newAddr":
        setErrState({
          ...errState,
          newAddrErr: !util.checkAddress(targetValue),
        });
        break;
      case "newName":
        setErrState({
          ...errState,
          newNameErr: !util.checkName(targetValue),
        });
        break;
      case "newLockAmount":
        if (!/^([0-9]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            newLockAmountErr: !checkLockAmount(targetValue),
          });
        }
        break;
      case "newNode":
        setErrState({
          ...errState,
          newNodeErr: !util.checkNode(targetValue),
        });
        break;
      case "stakingAddr":
        setErrState({
          ...errState,
          stakingAddrErr: !util.checkAddress(targetValue),
        });
        break;
      case "oldLockAmount":
        if (!/^([0-9]*)$/.test(targetValue)) setFormData(originStr);
        // formData[e.target.name] = originStr;
        else {
          setErrState({
            ...errState,
            oldLockAmountErr: !checkLockAmount(targetValue),
          });
        }
        break;
      // Governance Contract Address
      case "newGovAddr":
        setErrState({
          ...errState,
          newGovAddrErr: !util.checkAddress(targetValue),
        });
        break;
      // Voting Duration Setting
      case "votDurationMin":
        if (!/^([0-9]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            votDurationErr: util.checkNumberRange(
              "min",
              targetValue,
              formData.votDurationMax
            ),
          });
        }
        break;
      case "votDurationMax":
        if (!/^([0-9]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            votDurationErr: util.checkNumberRange(
              "max",
              formData.votDurationMin,
              targetValue
            ),
          });
        }
        break;
      //Authority Member Staking Amount
      case "authMemSkAmountMin":
        if (!/^([0-9]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            authMemSkAmountErr:
              util.checkNumberRange(
                "min",
                targetValue,
                formData.authMemSkAmountMax
              ) ||
              util.checkMemberStakingAmount(
                targetValue,
                formData.authMemSkAmountMax
              ),
          });
        }
        break;
      case "authMemSkAmountMax":
        if (!/^([0-9]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            authMemSkAmountErr:
              util.checkNumberRange(
                "max",
                formData.authMemSkAmountMin,
                targetValue
              ) ||
              util.checkMemberStakingAmount(
                formData.authMemSkAmountMin,
                targetValue
              ),
          });
        }
        break;
      // Block Creation Time
      case "blockCreation":
        if (!/^([0-9.]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            blockCreationErr: !util.checkBlockCreationTime(targetValue),
          });
        }
        break;
      // Block Reward Distribution Method
      case "blockRate1":
      case "blockRate2":
      case "blockRate3":
      case "blockRate4":
        if (!/^[0-9]*\.?([0-9]{1,2})?$/.test(targetValue)) {
          // 입력이 더이상 되지 않도록 막음.
          setFormData({ ...formData });
        } else {
          const { name } = e.target;
          const parsedTargetValue = Number(targetValue) || 0;

          setTempRates((prevState) => {
            const updatedBlockRates = {
              ...prevState.blockRates,
              [name]: parsedTargetValue,
            };
            // get total
            const newTotal = Object.values(updatedBlockRates).reduce(
              (p, c) => p + c
            );
            return {
              blockRates: updatedBlockRates,
              blockRateTotal: newTotal,
              blockRewardDisMthErr: newTotal !== 100,
            };
          });
        }
        break;
      // Block Reward Amount
      case "blockRewardAmount":
        if (!/^([0-9.]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            blockRewardAmountErr: !util.checkRewardAmount(targetValue),
          });
        }
        break;
      // maxPriorityFeePerGas
      case "maxPriorityFeePerGas":
        if (!/^([0-9]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            maxPriorityFeePerGasErr: !util.checkPrice(targetValue),
          });
        }
        break;
      // Gas Limit & baseFee
      case "gasLimit":
        if (!/^([0-9]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            gasLimitErr: !util.checkPrice(targetValue),
          });
        }
        break;
      case "maxBaseFee":
        if (!/^([0-9]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            maxBaseFeeErr: !util.checkPrice(targetValue),
          });
        }
        break;
      case "baseFeeMaxChangeRate":
        if (!/^([0-9]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            baseFeeMaxChangeRateErr: !util.checkPrice(targetValue),
          });
        }
        break;
      case "gasTargetPercentage":
        if (!/^([0-9]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            gasTargetPercentageErr: !util.checkPrice(targetValue),
          });
        }
        break;
      // Voting Address
      case "newVotingAddr":
        setErrState({
          ...errState,
          newVotingAddrErr: !util.checkAddress(targetValue),
        });
        break;
      // Reward Address
      case "newRewardAddr":
        setErrState({
          ...errState,
          newRewardAddrErr: !util.checkAddress(targetValue),
        });
        break;
      case "companyName":
        setErrState({
          ...errState,
          companyNameErr: !util.checkCompanyName(targetValue),
        });
        break;
      case "companyAddress":
        setErrState({
          ...errState,
          companyAddressErr: !util.checkAddress(targetValue),
        });
        break;
      case "investmentAmount":
        if (!/^([0-9.]*)$/.test(targetValue)) setFormData(originStr);
        else {
          setErrState({
            ...errState,
            investmentAmountErr: !util.checkInvestmentAmount(targetValue),
          });
        }
        break;
      default:
        break;
    }
  };

  const checkLockAmount = (amount) => {
    return Number(amount) <= stakingMax && Number(amount) >= stakingMin;
  };

  // check before sending transaction
  const handleProposalError = async (refineData) => {
    // ! wait 안건 등록 시 화이트리스트에 등록된 계정만 가능한데 추후 조건 추가해야 됨
    if (
      selectedTopic !== "AddWaitProposal" &&
      !(await callContractMethod(
        web3Instance,
        "GovImp",
        "isMember",
        address
      )) &&
      !constants.debugMode
    ) {
      return getErrModal(
        "You are not Governance Member.",
        "Proposal Submit Error"
      );
    }
    switch (selectedTopic) {
      case "AddAuthorityMember": {
        const { staker, lockAmount } = refineData;
        const newLockedAmount = Number(lockAmount);
        // get the balance of staking address
        const balance = Number(
          await callContractMethod(
            web3Instance,
            "Staking",
            "availableBalanceOf",
            staker
          )
        );
        // check if addresses already exist
        const isMember = await callContractMethod(
          web3Instance,
          "GovImp",
          "isMember",
          staker
        );
        if (isMember) {
          return getErrModal(
            "Existing Member Address.",
            "Proposal Submit Error"
          );
        }
        // check if addresses already voted
        const inBallotMember = newMemberaddr.some((addr) => addr === staker);
        if (inBallotMember) {
          return getErrModal(
            "Address with Existing Ballot.",
            "Proposal Submit Error"
          );
        }
        // check if staking address has META
        if (balance < newLockedAmount) {
          return getErrModal(
            "Not Enough META to Stake.",
            "Proposal Submit Error"
          );
        }
        return false;
      }
      case "ReplaceAuthorityMember": {
        const { oldStaker, staker, lockAmount } = refineData;
        const newLockedAmount = Number(lockAmount);
        // get the balance of old, new addresses
        const oldMemberBalance = await callContractMethod(
          web3Instance,
          "Staking",
          "lockedBalanceOf",
          oldStaker
        );
        const newMemberBalance = Number(
          await callContractMethod(
            web3Instance,
            "Staking",
            "availableBalanceOf",
            staker
          )
        );
        // check if old address does not exist
        const isMemberOldAddr = await callContractMethod(
          web3Instance,
          "GovImp",
          "isMember",
          oldStaker
        );
        if (!isMemberOldAddr) {
          return getErrModal(
            "Non-existing Member Address (Old).",
            "Proposal Submit Error"
          );
        }
        // check if new addresses already exist
        const isMemberNewAddr = await callContractMethod(
          web3Instance,
          "GovImp",
          "isMember",
          staker
        );
        if (isMemberNewAddr) {
          return getErrModal(
            "Existing Member Address.",
            "Proposal Submit Error"
          );
        }
        // check if old address already voted
        const inBallotOldMember = oldMemberaddr.some(
          (addr) => addr === oldStaker
        );
        if (inBallotOldMember) {
          return getErrModal(
            "Address with Existing Ballot (Old).",
            "Proposal Submit Error"
          );
        }
        // check if new address already voted
        const isBallotNewMember = newMemberaddr.some((addr) => addr === staker);
        if (isBallotNewMember) {
          return getErrModal(
            "Address with Existing Ballot (New).",
            "Proposal Submit Error"
          );
        }
        // check the balance of the old address is not same as lockAmount
        if (Number(oldMemberBalance) !== newLockedAmount) {
          return getErrModal(
            [
              "Invalid Replace META Amount",
              <br />,
              `(Old Address: ${util.convertWeiToEther(
                oldMemberBalance,
                "ether"
              )} META Locked)`,
            ],
            "Proposal Submit Error"
          );
        }
        // check if staking address has META
        if (newMemberBalance < newLockedAmount) {
          return getErrModal(
            "Not Enough META Stake (New)",
            "Proposal Submit Error"
          );
        }
        return false;
      }
      case "RemoveAuthorityMember": {
        const { staker, lockAmount } = refineData;
        const balance = await callContractMethod(
          web3Instance,
          "Staking",
          "lockedBalanceOf",
          staker
        );
        const lockedAmount = Number(lockAmount);

        // check if addresses already exist
        const isMember = await callContractMethod(
          web3Instance,
          "GovImp",
          "isMember",
          staker
        );
        if (!isMember) {
          return getErrModal(
            "Non-existing Member Address.",
            "Proposal Submit Error"
          );
        }
        // check if new address already voted
        const isBallotMember = newMemberaddr.some((addr) => addr === staker);
        if (isBallotMember) {
          return getErrModal(
            "Address with Existing Ballot.",
            "Proposal Submit Error"
          );
        }
        // check if the balance is small
        if (balance < lockedAmount) {
          return getErrModal(
            "Locked Amount must be less than or equal to Unlocked Amount.",
            "Proposal Submit Error"
          );
        }
        return false;
      }
      case "GovernanceContractAddress": {
        const { newGovAddr } = refineData;
        // check if address is contract code
        // const code = await web3Instance.web3.eth.getCode(newGovAddr);
        // if (code === "0x") {
        //   return getErrModal(
        //     "Address is not a Contract Address.",
        //     "Proposal Submit Error"
        //   );
        // }
        try {
          // 거버넌스 컨트랙트 객체를 만들어서 메소드가 호출되는지 확인
          const contract = new web3Instance.web3.eth.Contract(
            abis["GovImp"].abi,
            newGovAddr
          );
          const checkAddr = await contract.methods.proxiableUUID().call();
          if (checkAddr) return false;

          throw "Invalid Governance Contract Address";
        } catch (e) {
          return getErrModal(
            "Invalid Governance Contract Address.",
            "Proposal Submit Error"
          );
        }
      }
      default:
        return false;
    }
  };

  const checkStakingLockedBalance = async (
    inputStakingMin,
    inputStakingMax
  ) => {
    try {
      const authorityList = AuthorityList[process.env.REACT_APP_MODE] || [];
      for await (const authority of authorityList) {
        const { addr } = authority;
        const lockedBalance = await callContractMethod(
          web3Instance,
          "Staking",
          "lockedBalanceOf",
          addr
        );
        const convertLockedBalance = util.convertWeiToEther(lockedBalance);
        if (convertLockedBalance < inputStakingMin) {
          getErrModal(
            `Currently, the minimum staking amount is ${convertLockedBalance}. Please input less than this quantity.`,
            "Proposal Submit Error"
          );
          return false;
        }
        if (convertLockedBalance > inputStakingMax) {
          getErrModal(
            `Currently, the maximum staking amount is ${convertLockedBalance}. Please input larger than this quantity.`,
            "Proposal Submit Error"
          );
          return false;
        }
      }
      return true;
    } catch (e) {
      console.error(e);
    }
  };

  // check the data error handling
  const checkSubmitData = async (data) => {
    const { memo, votDuration } = data;
    let checkData, refineData, trxFunction;

    try {
      switch (selectedTopic) {
        case "AddAuthorityMember": {
          const { newAddr, newName, newNode, newLockAmount } = data;
          // check undefined
          if (util.checkUndefined(newAddr)) {
            setErrState({
              ...errState,
              newAddrErr: !errState.newAddrErr,
            });
            setOnLoading(false);
            return;
          }
          if (util.checkUndefined(newName)) {
            setErrState({
              newNameErr: !errState.newNameErr,
            });
            setOnLoading(false);
            return;
          }
          if (util.checkUndefined(newLockAmount)) {
            setErrState({
              ...errState,
              newLockAmountErr: !errState.newLockAmountErr,
            });
            setOnLoading(false);
            return;
          }
          if (util.checkUndefined(newNode)) {
            setErrState({
              ...errState,
              newNodeErr: !errState.newNodeErr,
            });
            setOnLoading(false);
            return;
          }
          // get node information
          const { node, ip, port } = util.splitNodeInfo(newNode);
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToAddMember",
              trx
            );
          checkData = {
            staker: newAddr,
            voter: newAddr,
            reward: newAddr,
            name: newName,
            lockAmount: newLockAmount,
            enode: node,
            ip,
            port,
            memo,
            duration: votDuration,
          };
          break;
        }
        case "ReplaceAuthorityMember": {
          const { stakingAddr, newAddr, newName, newNode, newLockAmount } =
            data;
          // check undefined
          if (util.checkUndefined(stakingAddr)) {
            setErrState({
              ...errState,
              stakingAddrErr: !errState.stakingAddrErr,
            });
            setOnLoading(false);
            return;
          }
          if (util.checkUndefined(newAddr)) {
            setErrState({
              ...errState,
              newAddrErr: !errState.newAddrErr,
            });
            setOnLoading(false);
            return;
          }
          if (util.checkUndefined(newName)) {
            setErrState({
              ...errState,
              newNameErr: !errState.newNameErr,
            });
            setOnLoading(false);
            return;
          }
          if (util.checkUndefined(newNode)) {
            setErrState({
              ...errState,
              newNodeErr: !errState.newNodeErr,
            });
            setOnLoading(false);
            return;
          }
          if (util.checkUndefined(newLockAmount) || newLockAmount === "") {
            setErrState({
              ...errState,
              newLockAmountErr: !errState.newLockAmountErr,
            });
            setOnLoading(false);
            return;
          }
          // get node information
          const { node, ip, port } = util.splitNodeInfo(newNode);
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToChangeMember",
              trx
            );
          checkData = {
            staker: newAddr,
            voter: newAddr,
            reward: newAddr,
            name: newName,
            lockAmount: newLockAmount,
            enode: node,
            ip,
            port,
            memo,
            duration: votDuration,
            oldStaker: stakingAddr,
          };
          break;
        }
        case "RemoveAuthorityMember": {
          const { stakingAddr, oldLockAmount } = data;

          // check undefined
          if (util.checkUndefined(stakingAddr)) {
            setErrState({
              ...errState,
              stakingAddrErr: !errState.stakingAddrErr,
            });
            setOnLoading(false);
            return;
          }
          if (util.checkUndefined(formData.showLockAmount)) {
            setErrState({
              ...errState,
              showLockAmountErr: !errState.showLockAmountErr,
            });
            setOnLoading(false);
            return;
          }
          if (util.checkUndefined(oldLockAmount)) {
            setErrState({
              ...errState,
              oldLockAmountErr: !errState.oldLockAmountErr,
            });
            setOnLoading(false);
            return;
          }
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToRemoveMember",
              trx
            );
          checkData = {
            staker: stakingAddr,
            lockAmount: oldLockAmount,
            memo,
            duration: votDuration,
          };
          break;
        }
        case "GovernanceContractAddress": {
          const { newGovAddr } = data;
          // check undefined
          if (util.checkUndefined(newGovAddr)) {
            setErrState({
              ...errState,
              newGovAddrErr: !errState.newGovAddrErr,
            });
            setOnLoading(false);
            return;
          }
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToChangeGov",
              trx
            );
          checkData = {
            newGovAddr,
            memo,
            duration: votDuration,
          };
          break;
        }
        case "VotingDurationSetting": {
          const { votDurationMin, votDurationMax } = data;
          // check undefined
          if (util.checkUndefined(votDurationMin) || votDurationMin === "") {
            setErrState({
              ...errState,
              votDurationErr: !errState.votDurationErr,
            });
            setOnLoading(false);
            return;
          }
          if (util.checkUndefined(votDurationMax) || votDurationMax === "") {
            setErrState({
              ...errState,
              votDurationErr: !errState.votDurationErr,
            });
            setOnLoading(false);
            return;
          }
          // setting env variables
          const envName = util.encodeStringToSha3(
            ENV_NAMES.ENV_BALLOT_DURATION_MIN_MAX
          );
          const envVal = util.encodeParameters(
            ["uint256", "uint256"],
            [
              util.convertDayToSeconds(votDurationMin),
              util.convertDayToSeconds(votDurationMax),
            ]
          );
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToChangeEnv",
              trx
            );
          checkData = {
            envName,
            envType: String(3),
            envVal,
            memo,
            duration: votDuration,
          };
          break;
        }
        case "AuthorityMemberStakingAmount": {
          const { authMemSkAmountMin, authMemSkAmountMax } = data;
          // check undefined
          if (
            util.checkUndefined(authMemSkAmountMin) ||
            authMemSkAmountMin === ""
          ) {
            setErrState({
              ...errState,
              authMemSkAmountErr: !errState.authMemSkAmountErr,
            });
            setOnLoading(false);
            return;
          }
          if (
            util.checkUndefined(authMemSkAmountMax) ||
            authMemSkAmountMax === ""
          ) {
            setErrState({
              ...errState,
              authMemSkAmountErr: !errState.authMemSkAmountErr,
            });
            setOnLoading(false);
            return;
          }

          const checkLockedBalance = await checkStakingLockedBalance(
            authMemSkAmountMin,
            authMemSkAmountMax
          );
          if (!checkLockedBalance) {
            setOnLoading(false);
            return;
          }

          // setting env variables
          const envName = util.encodeStringToSha3(
            ENV_NAMES.ENV_STAKING_MIN_MAX
          );
          const envVal = util.encodeParameters(
            ["uint256", "uint256"],
            [
              util.convertEtherToWei(authMemSkAmountMin),
              util.convertEtherToWei(authMemSkAmountMax),
            ]
          );
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToChangeEnv",
              trx
            );
          checkData = {
            envName,
            envType: String(3),
            envVal,
            memo,
            duration: votDuration,
          };
          break;
        }
        case "BlockCreationTime": {
          const { blockCreation } = data;
          // check undefined
          if (util.checkUndefined(blockCreation) || blockCreation === "") {
            setErrState({
              ...errState,
              blockCreationErr: !errState.blockCreationErr,
            });
            setOnLoading(false);
            return;
          }
          // setting env variables
          const envName = util.encodeStringToSha3(
            ENV_NAMES.ENV_BLOCK_CREATION_TIME
          );
          // convert ms
          const envVal = util.encodeParameters(
            ["uint256"],
            [(blockCreation * 1000).toFixed(0)]
          );
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToChangeEnv",
              trx
            );
          checkData = {
            envName,
            envType: String(2),
            envVal,
            memo,
            duration: votDuration,
          };
          break;
        }
        case "BlockRewardAmount": {
          const { blockRewardAmount } = data;
          // check undefined
          if (
            util.checkUndefined(blockRewardAmount) ||
            blockRewardAmount === ""
          ) {
            setErrState({
              ...errState,
              blockRewardAmountErr: !errState.blockRewardAmountErr,
            });
            setOnLoading(false);
            return;
          }
          // setting env variables
          const envName = util.encodeStringToSha3(
            ENV_NAMES.ENV_BLOCK_REWARD_AMOUNT
          );
          const envVal = util.encodeParameters(
            ["uint256"],
            [util.convertEtherToWei(blockRewardAmount)]
          );
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToChangeEnv",
              trx
            );
          checkData = {
            envName,
            envType: String(2),
            envVal,
            memo,
            duration: votDuration,
          };
          break;
        }
        case "BlockRewardDistributionMethod": {
          const { blockRate1, blockRate2, blockRate3, blockRate4 } =
            tempRates.blockRates;
          // check undefined
          if (
            tempRates.blockRateTotal !== 100 ||
            (!blockRate1 && !blockRate2 && !blockRate3 && !blockRate4)
          ) {
            setTempRates({
              ...tempRates,
              blockRewardDisMthErr: !tempRates.blockRewardDisMthErr,
            });
            setOnLoading(false);
            return;
          }
          // setting env variables
          const envName = util.encodeStringToSha3(
            ENV_NAMES.ENV_BLOCK_REWARD_DISTRIBUTION
          );
          // remove decimals
          const envVal = util.encodeParameters(
            ["uint256", "uint256", "uint256", "uint256"],
            [
              (Number(blockRate1) * 100).toFixed(0),
              (Number(blockRate2) * 100).toFixed(0),
              (Number(blockRate3) * 100).toFixed(0),
              (Number(blockRate4) * 100).toFixed(0),
            ]
          );
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToChangeEnv",
              trx
            );
          checkData = {
            envName,
            envType: String(5),
            envVal,
            memo,
            duration: votDuration,
          };
          break;
        }
        case "MaxPriorityFeePerGas": {
          const { maxPriorityFeePerGas } = data;
          // check undefined
          if (
            util.checkUndefined(maxPriorityFeePerGas) ||
            maxPriorityFeePerGas === ""
          ) {
            setErrState({
              ...errState,
              maxPriorityFeePerGasErr: !errState.maxPriorityFeePerGasErr,
            });
            setOnLoading(false);
            return;
          }
          // setting env variables
          const envName = util.encodeStringToSha3(
            ENV_NAMES.ENV_MAX_PRIORITY_FEE_PER_GAS
          );
          const envVal = util.encodeParameters(
            ["uint256"],
            [util.convertGWeiToWei(maxPriorityFeePerGas)]
          );
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToChangeEnv",
              trx
            );
          checkData = {
            envName,
            envType: String(2),
            envVal,
            memo,
            duration: votDuration,
          };
          break;
        }
        case "GasLimitBaseFee": {
          const {
            gasLimit,
            maxBaseFee,
            baseFeeMaxChangeRate,
            gasTargetPercentage,
          } = data;
          // check undefined
          if (util.checkUndefined(gasLimit) || gasLimit === "") {
            setErrState({
              ...errState,
              gasLimitErr: !errState.gasLimitErr,
            });
            setOnLoading(false);
            return;
          }
          if (util.checkUndefined(maxBaseFee) || maxBaseFee === "") {
            setErrState({
              ...errState,
              maxBaseFeeErr: !errState.maxBaseFeeErr,
            });
            setOnLoading(false);
            return;
          }
          if (
            util.checkUndefined(baseFeeMaxChangeRate) ||
            baseFeeMaxChangeRate === ""
          ) {
            setErrState({
              ...errState,
              baseFeeMaxChangeRateErr: !errState.baseFeeMaxChangeRateErr,
            });
            setOnLoading(false);
            return;
          }
          if (
            util.checkUndefined(gasTargetPercentage) ||
            gasTargetPercentage === ""
          ) {
            setErrState({
              ...errState,
              gasTargetPercentageErr: !errState.gasTargetPercentageErr,
            });
            setOnLoading(false);
            return;
          }
          // setting env variables
          const envName = util.encodeStringToSha3(
            ENV_NAMES.ENV_GASLIMIT_AND_BASE_FEE
          );
          const envVal = util.encodeParameters(
            ["uint256", "uint256", "uint256", "uint256"],
            [
              util.convertGWeiToWei(gasLimit),
              maxBaseFee,
              baseFeeMaxChangeRate,
              gasTargetPercentage,
            ]
          );
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToChangeEnv",
              trx
            );
          checkData = {
            envName,
            envType: String(5),
            envVal,
            memo,
            duration: votDuration,
          };
          break;
        }
        case "VotingAddress": {
          const { staker, name, lockAmount, enode, ip, port, newVotingAddr } =
            data;

          // check undefined
          if (util.checkUndefined(newVotingAddr)) {
            setErrState({
              ...errState,
              newVotingAddrErr: !errState.newVotingAddrErr,
            });
            setOnLoading(false);
            return;
          }
          if (oldVotingAddr === newVotingAddr) {
            setErrState({
              ...errState,
              newVotingAddrErr: !errState.newVotingAddrErr,
            });
            setOnLoading(false);
            return;
          }
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToChangeMember",
              trx
            );
          checkData = {
            staker,
            voter: newVotingAddr,
            reward: oldRewardAddr,
            name,
            lockAmount,
            enode,
            ip,
            port,
            memo,
            oldStaker: staker,
          };
          break;
        }
        case "RewardAddress": {
          const { staker, name, lockAmount, enode, ip, port, newRewardAddr } =
            data;
          // const { oldVotingAddr, oldRewardAddr } = props;
          // check undefined
          if (util.checkUndefined(newRewardAddr)) {
            setErrState({
              ...errState,
              newRewardAddrErr: !errState.newRewardAddrErr,
            });
            setOnLoading(false);
            return;
          }
          if (oldRewardAddr === newRewardAddr) {
            setErrState({
              ...errState,
              newRewardAddrErr: !errState.newRewardAddrErr,
            });
            setOnLoading(false);
            return;
          }
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "GovImp",
              "addProposalToChangeMember",
              trx
            );
          checkData = {
            staker,
            voter: oldVotingAddr,
            reward: newRewardAddr,
            name,
            lockAmount,
            enode,
            ip,
            port,
            memo,
            oldStaker: staker,
          };
          break;
        }
        case "AddWaitProposal": {
          const {
            companyName,
            companyAddress,
            investmentAmount,
            link = "",
          } = data;
          if (util.checkUndefined(companyName)) {
            setErrState({
              ...errState,
              companyNameErr: !errState.companyNameErr,
            });
            setOnLoading(false);
            return;
          }
          if (util.checkUndefined(companyAddress)) {
            setErrState({
              companyAddress: !errState.companyAddress,
            });
            setOnLoading(false);
            return;
          }
          if (
            util.checkUndefined(investmentAmount) ||
            investmentAmount === ""
          ) {
            setErrState({
              ...errState,
              investmentAmountErr: !errState.investmentAmountErr,
            });
            setOnLoading(false);
            return;
          }
          trxFunction = (trx) =>
            encodeABIValueInMethod(
              web3Instance,
              "WaitGovernance",
              "addProposal",
              trx
            );
          // company name 입력 시 앞에 넘버링 추가
          checkData = {
            companyName: `WAIT-${
              waitBallotLength >= 10 ? waitBallotLength : `0${waitBallotLength}`
            }: ${companyName}`,
            companyAddress,
            investmentAmount,
            description: memo,
            link,
          };
          break;
        }
        default:
          return;
      }
      // sets the default value of memo, votDuration
      checkData = {
        ...checkData,
        memo: checkData.memo || "",
        duration:
          util.convertDayToSeconds(checkData.duration) || votingDurationMin,
      };
      // override data for formatting
      refineData = util.refineSubmitData(checkData);
      if (typeof (await handleProposalError(refineData)) === "undefined") {
        setOnLoading(false);
        return;
      }
      return trxFunction(refineData);
    } catch (err) {
      console.log(err);
      getErrModal(err.message, err.name);
      setOnLoading(false);
    }
  };

  // submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOnLoading(true);
    try {
      const trx = await checkSubmitData(formData);
      // run only if there is data for sending transactions
      if (trx !== undefined) {
        sendTransaction(trx);
      }
    } catch (err) {
      console.log(err);
      getErrModal(err.message, err.name);
      setOnLoading(false);
    }
  };

  const waitForReceipt = (hash, cb) => {
    web3Instance.web3.eth.getTransactionReceipt(hash, (err, receipt) => {
      if (err) console.log("err: ", err);
      if (util.checkUndefined(receipt) || receipt === null) {
        // Try again in 1 second
        window.setTimeout(() => {
          waitForReceipt(hash, cb);
        }, 1000);
      } else {
        // Transaction went through
        if (cb) cb(receipt);
      }
    });
  };

  // send transaction
  const sendTransaction = async (trx) => {
    try {
      await sendTransactionAsync({
        from: address,
        to: trx.to,
        data: trx.data,
        gasPrice: 110000000000,
        value: "0x0",
        // maxFeePerGas: 101000000000,
        // maxPriorityFeePerGas: 100000000000,
      })
        .then(({ hash }) => {
          waitForReceipt(hash, (receipt) => {
            if (receipt.status) {
              window.location.href = "/voting/list";
            } else {
              getErrModal(
                "The transaction could not be sent normally.",
                "Proposal Submit Error",
                receipt.transactionHash
              );
              setOnLoading(false);
            }
          });
        })
        .catch((err) => {
          const _msg = err?.details || "Unknown Error";
          getErrModal(_msg, "Proposal Submit Error");
          setOnLoading(false);
        });
      // web3Instance.web3.eth.sendTransaction(
      //   {
      //     from: address,
      //     to: trx.to,
      //     data: trx.data,
      //     gasPrice: 101000000000,
      //     // maxFeePerGas: 101000000000,
      //     // maxPriorityFeePerGas: 100000000000,
      //   },
      //   (err, hash) => {
      //     if (err) {
      //       getErrModal(err.message, "Proposal Submit Error");
      //       setOnLoading(false);
      //     } else {
      //       waitForReceipt(hash, (receipt) => {
      //         if (receipt.status) {
      //           window.location.href = "/voting/list";
      //         } else {
      //           getErrModal(
      //             "The transaction could not be sent normally.",
      //             "Proposal Submit Error",
      //             receipt.transactionHash,
      //           );
      //           setOnLoading(false);
      //         }
      //       });
      //     }
      //   },
      // );
    } catch (err) {
      console.log(err);
      getErrModal(err.message, err.name);
      setOnLoading(false);
    }
  };

  // get my information for send transaction
  const getMyInfo = useCallback(async () => {
    try {
      const { name, enode, ip, port } = await callContractMethod(
        web3Instance,
        "GovImp",
        "getNode",
        memberIdx
      );
      const lockAmount = await callContractMethod(
        web3Instance,
        "Staking",
        "lockedBalanceOf",
        address
      );

      setFormData({
        ...formData,
        staker: address,
        name: util.decodeHexToString(name),
        enode,
        ip,
        port,
        lockAmount: util.convertWeiToEther(lockAmount),
        oldStaker: address,
      });
    } catch (err) {
      console.log(err);
      getErrModal(err.message, err.name);
      setOnLoading(false);
    }
  });

  // show components that follow selected topic
  let showProposalForm = () => {
    const TopicComponent = (topic) => {
      switch (topic) {
        case "AddAuthorityMember":
          return (
            <PComponent.AddProposalForm
              newAddrErr={errState.newAddrErr}
              newLockAmountErr={errState.newLockAmountErr}
              newLockAmount={addCommasToNumber(formData.newLockAmount)}
              newNodeErr={errState.newNodeErr}
              newNameErr={errState.newNameErr}
            />
          );
        case "ReplaceAuthorityMember":
          return (
            <PComponent.ReplaceProposalForm
              stakingAddrErr={errState.stakingAddrErr}
              newAddrErr={errState.newAddrErr}
              newNameErr={errState.newNameErr}
              stakingMin={stakingMin}
              newLockAmount={addCommasToNumber(formData.newLockAmount)}
              newLockAmountErr={errState.newLockAmountErr}
              newNodeErr={errState.newNodeErr}
            />
          );
        case "RemoveAuthorityMember":
          return (
            <PComponent.RemoveProposalForm
              stakingAddrErr={errState.stakingAddrErr}
              showLockAmount={addCommasToNumber(formData.showLockAmount)}
              showLockAmountErr={errState.showLockAmountErr}
              stakingMin={stakingMin}
              oldLockAmount={addCommasToNumber(formData.oldLockAmount)}
              oldLockAmountErr={errState.oldLockAmountErr}
              getLockAmount={getLockAmount}
            />
          );
        case "GovernanceContractAddress":
          return (
            <PComponent.GovernanceContractAddressForm
              newGovAddrErr={errState.newGovAddrErr}
            />
          );
        case "VotingDurationSetting":
          return (
            <PComponent.VotingDurationSettingForm
              votDurationErr={errState.votDurationErr}
              votDurationMin={formData.votDurationMin}
              votDurationMax={formData.votDurationMax}
            />
          );
        case "AuthorityMemberStakingAmount":
          return (
            <PComponent.AuthorityMemberStakingAmountForm
              authMemSkAmountErr={errState.authMemSkAmountErr}
              authMemSkAmountMin={addCommasToNumber(
                formData.authMemSkAmountMin
              )}
              authMemSkAmountMax={addCommasToNumber(
                formData.authMemSkAmountMax
              )}
            />
          );
        case "BlockCreationTime":
          return (
            <PComponent.BlockCreationTime
              blockCreation={formData.blockCreation}
              blockCreationErr={errState.blockCreationErr}
            />
          );
        case "BlockRewardAmount":
          return (
            <PComponent.BlockRewardAmount
              blockRewardAmount={addCommasToNumber(formData.blockRewardAmount)}
              blockRewardAmountErr={errState.blockRewardAmountErr}
            />
          );
        case "BlockRewardDistributionMethod":
          return (
            <PComponent.BlockRewardDistributionMethod
              blockRate1={formData.blockRate1}
              blockRate2={formData.blockRate2}
              blockRate3={formData.blockRate3}
              blockRate4={formData.blockRate4}
              blockRateTotal={tempRates.blockRateTotal}
              blockRewardDisMthErr={tempRates.blockRewardDisMthErr}
            />
          );
        case "MaxPriorityFeePerGas":
          return (
            <PComponent.MaxPriorityFeePerGasForm
              maxPriorityFeePerGas={addCommasToNumber(
                formData.maxPriorityFeePerGas
              )}
              maxPriorityFeePerGasErr={errState.maxPriorityFeePerGasErr}
            />
          );
        case "GasLimitBaseFee":
          return (
            <PComponent.GasLimitBaseFeeForm
              gasLimit={addCommasToNumber(formData.gasLimit)}
              gasLimitErr={errState.gasLimitErr}
              maxBaseFee={addCommasToNumber(formData.maxBaseFee)}
              maxBaseFeeErr={errState.maxBaseFeeErr}
              baseFeeMaxChangeRate={formData.baseFeeMaxChangeRate}
              baseFeeMaxChangeRateErr={errState.baseFeeMaxChangeRateErr}
              gasTargetPercentage={formData.gasTargetPercentage}
              gasTargetPercentageErr={errState.gasTargetPercentageErr}
            />
          );
        case "VotingAddress":
          return (
            <MComponent.VotingAddress
              oldVotingAddr={oldVotingAddr}
              newVotingAddrErr={errState.newVotingAddrErr}
            />
          );
        case "RewardAddress":
          return (
            <MComponent.RewardAddress
              oldRewardAddr={oldRewardAddr}
              newRewardAddrErr={errState.newRewardAddrErr}
            />
          );
        case "AddWaitProposal":
          return (
            <PComponent.AddWaitProposalForm
              companyNameErr={errState.companyNameErr}
              companyAddressErr={errState.companyAddressErr}
              investmentAmount={formData.investmentAmount}
              investmentAmountErr={errState.investmentAmountErr}
            />
          );
        default:
          return <></>;
      }
    };
    return (
      /* component for only common props pass */
      <PComponent.PassesCommonProps
        netName={web3Instance.netName}
        loading={onLoading}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        votingDurationMax={votingDurationMax}
        votingDurationMin={votingDurationMin}
      >
        {/* component of selected topic */}
        {TopicComponent(selectedTopic)}
      </PComponent.PassesCommonProps>
    );
  };

  const options =
    selectedMenu === "menu-myinfo"
      ? ENV_MY_INFO_PROPOSAL_LIST
      : ENV_VOTING_PROPOSAL_LIST;

  const network = process.env.REACT_APP_NETWORK_TYPE;
  const whiteList =
    network === "mainnet"
      ? MAINNET_WHITE_LIST
      : network === "testnet"
      ? TESTNET_WHITE_LIST
      : network === "devnet"
      ? DEVMETANET_WHITE_LIST
      : DEVMETANET_WHITE_LIST;

  return (
    <>
      <div className="section-body">
        <div className="wrap">
          <VotingTopProposal
            loading={onLoading}
            options={options}
            showProposal={showProposal}
            selectedTopic={selectedTopic}
            handleSelectTopicChange={handleSelectTopicChange}
            isWhiteList={whiteList.includes(address)}
          />
          <main>
            <div className={"proposal-form"}>
              <div className="textfield-contain">
                <div className="textfield-wrap">{showProposalForm()}</div>
              </div>
            </div>
            {selectedMenu === "menu-voting" && (
              <div className={cn("reference-wrap")}>
                <strong className={cn("reference-title")}>Reference</strong>
                <ul className={cn("reference-list")}>
                  <li className={cn("reference-list-info")}>
                    Even within the voting duration, if more than 50% of options
                    are expressed for or against, voting ends and follow-up work
                    is carried out.
                  </li>
                  <li className={cn("reference-list-info")}>
                    Basically, only one voting is conducted at a time, so if
                    there is already voting in progress, you cannot start a new
                    voting.
                  </li>
                </ul>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Proposal;

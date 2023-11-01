import React from "react";

import {
  ProposalForm,
  VotingBallots,
  ShowBallots,
  SubHeader,
  SubNav,
  ChangeModal,
} from "./";
import { constants, ENV_PARAMETER_COUNT } from "../constants";
import Loading from "../Loading";
import * as util from "../util";
import {
  callContractMethod,
  encodeABIValueInMethod,
  onlyCallContractMethod,
  web3Instance,
} from "../web3";


// import "./style/style.css";

class Voting extends React.Component {
  data = {
    // Mapped with ballotBasicOriginData
    curBallotIdx: 0,
    ballotBasicOriginItems: [],
    existBallotNewMember: [],
    existBallotOldMember: [],
    authorityNames: new Map(),

    activeItems: [],
    proposalItems: [],
    finalizedItems: [],
    visibleActiveItems: [],
    visibleProposalItems: [],
    visibleFinalizedItems: [],
  };

  state = {
    isBallotLoading: false,
    ballotUpdateDuration: 1,
    ballotUpdateMemo: "new memo",
    position: "active",
    updateModal: false,
    proposalCount: 5,
    finalizedCount: 5,
  };

  constructor(props) {
    super(props);
    this.waitForReceipt = this.waitForReceipt.bind(this);

    this.titles = {
      activeTitle: null,
      proposalTitle: null,
      finalizedTitle: null,
    };
    this.ballotDetails = new Map();
  }

  async componentDidMount() {
    Object.values(this.props.authorityOriginData).forEach((item) =>
      this.data.authorityNames.set(item.addr, item.title)
    );
    this.getBallotOriginItem();
  }

  reloadVoting = async (component, init = false) => {
    if (component) this.props.convertVotingComponent(component);
    if (init) await this.props.getContractAuthorityBallots();
    else await this.props.refreshContractData(true);
    this.getBallotOriginItem();
    this.props.convertLoading(false);
  };

  getBallotOriginItem() {
    if (!this.props.ballotBasicOriginData || !this.props.ballotMemberOriginData)
      return;
    let list = [];
    // Use origin data in contract
    Object.values(this.props.ballotBasicOriginData).forEach((item, index) => {
      const { newStakerAddress, oldStakerAddress } =
        this.props.ballotMemberOriginData[item.id];
      if (
        item.state === constants.ballotState.Ready ||
        item.state === constants.ballotState.InProgress
      ) {
        this.data.existBallotNewMember.push(newStakerAddress);
        this.data.existBallotOldMember.push(oldStakerAddress);
      }

      list.push(
        <VotingBallots
          key={index}
          item={item}
          ballotDetails={this.ballotDetails}
          authorityName={this.data.authorityNames.get(item.creator)}
          ballotMemberOriginData={this.props.ballotMemberOriginData[item.id]}
          setTopic={this.setTopic}
          onClickDetail={this.onClickDetail}
          onClickVote={this.onClickVote}
          setDescription={this.setDescription}
          onClickUpdateProposal={this.onClickUpdateProposal}
        />
      );
    });
    this.data.ballotBasicOriginItems = list.reverse();
    this.getBallotDetailInfo();
  }

  getBallotDetailInfo() {
    let activeList = [];
    let proposalList = [];
    let finalizedList = [];

    this.data.ballotBasicOriginItems.forEach((item) => {
      switch (item.props.item.state) {
        case constants.ballotState.InProgress:
          activeList.push(item);
          break; // InProgress
        case constants.ballotState.Ready:
          proposalList.push(item);
          break; // Ready
        case constants.ballotState.Approved: // Approved, Rejected
        case constants.ballotState.Rejected:
          finalizedList.push(item);
          break;
        default:
          break;
      }
    });

    this.data.activeItems = activeList;
    this.data.visibleActiveItems = activeList;
    this.data.proposalItems = proposalList;
    this.data.visibleProposalItems = proposalList;
    this.data.finalizedItems = finalizedList;
    this.data.visibleFinalizedItems = finalizedList;

    this.setState({ isBallotLoading: true });
  }

  // show proposal name
  setTopic = (
    creator,
    type,
    name,
    oldStakerAddr,
    newStakerAddr,
    newVotingAddr,
    newRewardAddr
  ) => {
    // to distinguish whether it came from a search
    if (
      creator &&
      oldStakerAddr &&
      newStakerAddr &&
      newVotingAddr &&
      newRewardAddr
    ) {
      if (
        type === constants.ballotTypes.ReplaceAuthorityMember &&
        creator === oldStakerAddr
      ) {
        if (oldStakerAddr !== newVotingAddr) {
          return "Voting Address";
        } else if (oldStakerAddr !== newRewardAddr) {
          return "Reward Address";
        }
      }
    }
    if (type === constants.ballotTypes.ChangedEnv) {
      return name;
    }
    return constants.ballotTypesArr[parseInt(type)];
  };

  setDescription = (type, id) => {
    let { lockAmount } = this.props.ballotMemberOriginData[id];
    lockAmount =
      typeof lockAmount === "undefined"
        ? 0
        : util.convertWeiToEther(lockAmount, "ether");
    switch (type) {
      // Add Authority Member
      case constants.ballotTypes.AddAuthorityMember: {
        const { newStakerAddress } = this.props.ballotMemberOriginData[id];
        return (
          <p className="description flex-full">
            Authority Address: {newStakerAddress}
            <br />
            META To be Locked: {lockAmount} META
          </p>
        );
      }
      // Replace Authority Member
      case constants.ballotTypes.ReplaceAuthorityMember: {
        const {
          oldStakerAddress,
          newStakerAddress,
          newVoterAddress,
          newRewardAddress,
        } = this.props.ballotMemberOriginData[id];
        if (oldStakerAddress === newStakerAddress) {
          if (newStakerAddress !== newVoterAddress) {
            return (
              <p className="description flex-full">
                New Voting Address: {newVoterAddress}
              </p>
            );
          } else if (newStakerAddress !== newRewardAddress) {
            return (
              <p className="description flex-full">
                New Reward Address: {newRewardAddress}
              </p>
            );
          } else {
            return (
              <p className="description flex-full">
                Old Authority Address: {oldStakerAddress}
                <br />
                New Authority Address: {newStakerAddress}
              </p>
            );
          }
        } else {
          return (
            <p className="description flex-full">
              Old Authority Address: {oldStakerAddress}
              <br />
              New Authority Address: {newStakerAddress}
              <br />
              META To be Locked: {lockAmount} META
            </p>
          );
        }
      }
      //  Governance Contract Address
      case constants.ballotTypes.GovernanceContractAddress: {
        const { newGovernanceAddress } = this.props.ballotMemberOriginData[id];
        return (
          <p className="description flex-full">
            New Governnce Address: {newGovernanceAddress}
          </p>
        );
      }
      // Env Variables
      case constants.ballotTypes.ChangedEnv: {
        const { envVariableName, envVariableValue } =
          this.props.ballotMemberOriginData[id];
        // get variable value
        let paramsArr = [];
        // number of parameters
        let paramsCnt = ENV_PARAMETER_COUNT[envVariableName];
        for (let i = 1; i <= paramsCnt; i++) {
          paramsArr.push("uint256");
        }
        const decodeValue = util.decodeParameters(paramsArr, envVariableValue);
        // set description
        let description = `${envVariableName}: `;
        if (envVariableName === "Voting Duration Setting") {
          description += `${util.convertSecondsToDay(
            decodeValue[0]
          )}-${util.convertSecondsToDay(decodeValue[1])} day`;
        } else if (envVariableName === "Authority Member Staking Amount") {
          description += `${util.convertWeiToEther(
            decodeValue[0]
          )}-${util.convertWeiToEther(decodeValue[1])} META`;
        } else if (envVariableName === "Block Creation Time") {
          description += `${decodeValue[0] / 1000} s`;
        } else if (envVariableName === "Block Reward Amount") {
          description += `${util.convertWeiToEther(decodeValue[0])} META/Block`;
        } else if (envVariableName === "Block Reward Distribution Method") {
          description = `Distribution Rate: ${
            decodeValue[0] / 100
          }%, Staking Reward: ${decodeValue[1] / 100}%, Ecosystem: ${
            decodeValue[2] / 100
          }%, Maintenance: ${decodeValue[3] / 100}%`;
        } else if (envVariableName === "MaxPriorityFeePerGas") {
          description += `${util.convertWeiToGWei(decodeValue[0])} GWei`;
        } else if (envVariableName === "Gas Limit & baseFee") {
          description = `Gas Limit: ${util.convertWeiToGWei(
            decodeValue[0]
          )} GWei\nMax baseFee: ${
            decodeValue[1]
          } GWei\nBaseFee Max Change Rate: ${
            decodeValue[2]
          }\nGas Target Percentage: ${decodeValue[3]}`;
        } else {
          return "Wrong Proposal (This label is only test)";
        }
        return (
          <p className="description flex-full">
            {description.split("\n").map((line, i) => {
              return (
                <span key={i}>
                  {line}
                  <br />
                </span>
              );
            })}
          </p>
        );
      }
      default:
        return (
          <p className="description flex-full">
            META To be Locked: {lockAmount} META
          </p>
        );
    }
  };

  waitForReceipt = (hash, cb) => {
    // console.log('Start waitForReceipt: ', hash)
    web3Instance.web3.eth.getTransactionReceipt(hash, (err, receipt) => {
      // console.log('getTransactionReceipt: ', receipt)
      if (err) console.log("err: ", err);

      if (util.checkUndefined(receipt) || receipt === null) {
        // Try again in 1 second
        window.setTimeout(() => {
          this.waitForReceipt(hash, cb);
        }, 1000);
      } else {
        // Transaction went through
        if (cb) cb(receipt);
      }
    });
  };

  onClickDetail = (e, id) => {
    const element = this.ballotDetails.get(id);
    if (element.style.height === "auto") {
      e.target.style.transform = "rotate(0deg)";
      element.style.height = constants.ballotDetailHeightToPixel;
    } else {
      e.target.style.transform = "rotate(180deg)";
      element.style.height = "auto";
    }
  };

  onClickVote = async (value, item) => {
    const { id, endTime, state } = item;
    // check web3
    if (!web3Instance.web3) {
      this.props.getErrModal("web3 is not exist", "Voting Error");
      return;
    }
    // check if you've logged in
    if (!this.props.isLogin) {
      this.props.getErrModal("Please connect your wallet.", "Voting Error");
      return;
    }
    // check if member
    if (!this.props.isMember) {
      this.props.getErrModal("You are not member.", "Voting Error");
      return;
    }
    // check if you've already voted
    const isVoted = await callContractMethod(
      web3Instance,
      "ballotStorage",
      "hasAlreadyVoted",
      {
        id,
        voter: this.props.defaultAccount,
      }
    );
    if (isVoted) {
      this.props.getErrModal("You've already voted.", "Voting Error");
      return;
    }
    // check if there are items already being voted on
    const isInVoting = await onlyCallContractMethod(
      web3Instance,
      "GovImp",
      "getBallotInVoting"
    );
    if (!(isInVoting === "0" || isInVoting === item.id.toString())) {
      this.props.getErrModal(
        "Active has an offer. Proposals in Active must be completed before voting in Proposals can proceed.",
        "Voting Error"
      );
      return;
    }
    // check the voting time
    if (
      state === constants.ballotState.InProgress &&
      new Date(endTime * 1000) < Date.now()
    ) {
      this.props.getErrModal("This Ballot is timeouted", "Voting Error");
      this.reloadVoting(false);
      return;
    }

    this.props.convertLoading(true);
    let trx = encodeABIValueInMethod(
      web3Instance,
      "GovImp",
      "vote",
      id,
      value === "Y"
    );
    this.sendTransaction(trx, "Voting");
  };

  onClickUpdateProposal = (topic, item) => {
    const { id, duration, creator } = item;
    // check if you've logged in
    if (!this.props.isLogin) {
      this.props.getErrModal("Please connect your wallet.", "Voting Error");
      return;
    }
    // check if member
    if (!this.props.isMember) {
      this.props.getErrModal("You are not member.", "Voting Error");
      return;
    }
    // only those who voted are allowed
    if (creator !== this.props.defaultAccount) {
      this.props.getErrModal(
        "You don't have permission to Change or Revoke.",
        "Voting Error"
      );
      return;
    }
    if (topic === "change") {
      this.data.curBallotIdx = id;
      this.setState({
        ballotUpdateDuration: duration === 0 ? 1 : duration,
        updateModal: true,
      });
      return;
    }

    this.props.convertLoading(true);
    let trx = encodeABIValueInMethod(
      web3Instance,
      "BallotStorage",
      "cancelBallot",
      id
    );
    this.sendTransaction(trx, "Revoke", true);
  };

  completeModal = async (e) => {
    this.props.convertLoading(true);
    let trx = await encodeABIValueInMethod(
      web3Instance,
      "BallotStorage",
      "updateBallotDuration",
      this.data.curBallotIdx,
      util.convertDayToSeconds(this.state.ballotUpdateDuration)
    );
    this.sendTransaction(trx, "Change", true);
    this.setState({ updateModal: false });
  };

  sendTransaction(trx, type, init = false) {
    this.props.convertLoading(true);

    trx.from = this.props.defaultAccount;
    trx.gasPrice = 110000000000;
    // trx.maxFeePerGas = 101000000000;
    // trx.maxPriorityFeePerGas = 100000000000;

    web3Instance.web3.eth.sendTransaction(trx, (err, hash) => {
      try {
        if (err) {
          throw err;
        } else {
          // console.log("hash: ", hash);
          this.waitForReceipt(hash, (receipt) => {
            // console.log("Updated :", receipt);
            if (receipt.status) this.reloadVoting(false, init);
            else {
              this.props.getErrModal(
                "Transaction has been reverted.",
                type + " Error",
                receipt.transactionHash
              );
            }
            this.props.convertLoading(false);
          });
        }
      } catch (err) {
        this.props.convertLoading(false);
        this.props.getErrModal(err.message, err.name);
      }
    });
  }

  onClickSubMenu = (e) => {
    switch (e.key) {
      case "active":
        if (this.titles.activeTitle)
          window.scrollTo(0, this.titles.activeTitle.offsetTop - 70);
        break;
      case "proposal":
        if (this.titles.proposalTitle)
          window.scrollTo(0, this.titles.proposalTitle.offsetTop - 70);
        break;
      case "finalized":
        if (this.titles.finalizedTitle)
          window.scrollTo(0, this.titles.finalizedTitle.offsetTop - 70);
        break;
      default:
        break;
    }
    this.setState({ position: e.key });
  };

  onClickReadMore = (state) => {
    switch (state) {
      case "proposal":
        this.setState({ proposalCount: this.state.proposalCount + 5 });
        break;
      case "finalized":
        this.setState({ finalizedCount: this.state.finalizedCount + 5 });
        break;
      default:
        break;
    }
  };

  hideChangeModal = () => {
    this.setState({ updateModal: false });
  };

  sliderChange = (value) => {
    this.setState({ ballotUpdateDuration: value });
  };

  searchBallot = (e) => {
    const str = e.target.value.toLowerCase();
    this.data.visibleActiveItems = this.filteringBallot(
      this.data.activeItems,
      str
    );
    this.data.visibleProposalItems = this.filteringBallot(
      this.data.proposalItems,
      str
    );
    this.data.visibleFinalizedItems = this.filteringBallot(
      this.data.finalizedItems,
      str
    );
    this.setState({
      isBallotLoading: true,
      proposalCount: 5,
      finalizedCount: 5,
    });
  };

  filteringBallot(ballots, str) {
    return ballots.filter((value) => {
      let topic = this.setTopic(
        value.props.item.creator,
        value.props.item.ballotType,
        value.props.ballotMemberOriginData.envVariableName,
        value.props.ballotMemberOriginData.newMemberAddress,
        value.props.ballotMemberOriginData.oldMemberAddress,
        value.props.ballotMemberOriginData.newVotingAddress,
        value.props.ballotMemberOriginData.newRewardAddress
      );
      return [topic, value.props.item.creator].some((elem) => {
        return elem.toLowerCase().indexOf(str) !== -1;
      });
    });
  }

  convertVotingComponentOveride = () => {
    this.props.convertVotingComponent("proposal");
  };

  render() {
    return (
      <div>
        {!this.props.showProposal ? (
          <div className="background">
            <SubHeader
              netName={web3Instance.netName}
              placeholder="Search by Type, Proposal, Keywords"
              condition={this.props.isMember || constants.debugMode}
              btnText="New Proposal"
              btnIcon="+"
              loading={!this.state.isBallotLoading || this.props.loading}
              btnFunction={this.convertVotingComponentOveride}
              searchFunction={this.searchBallot}
            />

            <SubNav
              position={this.state.position}
              onClickSubMenu={this.onClickSubMenu}
            />

            <ChangeModal
              updateModal={this.state.updateModal}
              ballotUpdateDuration={this.state.ballotUpdateDuration}
              votingDurationMin={this.props.votingDurationMin}
              votingDurationMax={this.props.votingDurationMax}
              completeModal={this.completeModal}
              hideChangeModal={this.hideChangeModal}
              sliderChange={this.sliderChange}
            />

            {(!this.state.isBallotLoading || this.props.loading) && (
              <Loading txLoading={true} />
            )}
            <ShowBallots
              titles={this.titles}
              visibleActiveItems={this.data.visibleActiveItems}
              visibleProposalItems={this.data.visibleProposalItems.slice(
                0,
                this.state.proposalCount
              )}
              totalProposalItemLength={this.data.visibleProposalItems.length}
              visibleFinalizedItems={this.data.visibleFinalizedItems.slice(
                0,
                this.state.finalizedCount
              )}
              totalFinalizedItemLength={this.data.visibleFinalizedItems.length}
              netName={web3Instance.netName}
              onClickReadMore={this.onClickReadMore}
            />
          </div>
        ) : (
          <ProposalForm
            getErrModal={this.props.getErrModal}
            newMemberaddr={this.data.existBallotNewMember}
            oldMemberaddr={this.data.existBallotOldMember}
            convertComponent={this.reloadVoting}
            loading={this.props.loading}
            convertLoading={this.props.convertLoading}
            waitForReceipt={this.waitForReceipt}
            stakingMax={this.props.stakingMax}
            stakingMin={this.props.stakingMin}
            votingDurationMax={this.props.votingDurationMax}
            votingDurationMin={this.props.votingDurationMin}
            selectedMenu={this.props.selectedMenu}
            oldVotingAddr={this.props.oldVotingAddr}
            oldRewardAddr={this.props.oldRewardAddr}
            memberIdx={this.props.memberIdx}
            defaultAccount={this.props.defaultAccount}
          />
        )}
      </div>
    );
  }
}
export { Voting };

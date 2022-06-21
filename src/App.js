import React from "react";
import { Layout } from "antd";
import {
  contracts,
  initContractsByNames,
  constants as metaWeb3Constants,
} from "meta-web3";

import {
  TopNav,
  FootNav,
  StakingModal,
  ErrModal,
  AccessFailedModal,
  Voting,
  Authority,
  Myinfo,
  BaseLoader,
} from "./components";
import getWeb3Instance, { web3Instance } from "./web3";
import { constants, ENV_NAMES_SHA3 } from "./constants";
import * as util from "./util";

import "./App.css";
import "./components/style/style.css";

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  data = {
    myBalance: 0,
    myLockedBalance: 0,
    stakingTopic: "deposit",
    stakingAmount: "",
    stakingMax: null,
    stakingMin: null,
    eventsWatch: null,
    ballotMemberOriginData: {},
    ballotBasicOriginData: {},
    voteLength: 0,
    authorityOriginData: [],
    errTitle: null,
    errContent: null,
    errLink: null,
    errAccessFail: null,
    isMember: false,
    // for getting ballot data
    ballotTypeData: [],
    // voting duration
    votingDurationMin: null,
    votingDurationMax: null,
  };

  state = {
    loadWeb3: false,
    accessFailMsg: null,
    nav: "1",
    contractReady: false,
    stakingModalVisible: false,
    errModalVisible: false,
    errStakging: false,
    loading: false,
    activeMenu: "Authority",
    // true - voting / false - authority
    showProposal: false,
  };

  constructor(props) {
    super(props);
    this.initContractData = this.initContractData.bind(this);
    this.refreshContractData = this.refreshContractData.bind(this);

    // get web3 instance
    getWeb3Instance().then(
      async (web3Config) => {
        this.initContracts(web3Config);
        console.log("debugMode: ", constants.debugMode);
        this.setState({ loadWeb3: true });
      },
      async (error) => {
        console.log("getWeb3 error: ", error);
        this.setState({ loadWeb3: false, accessFailMsg: error.message });
      }
    );
  }

  // initial contract
  async initContracts(web3Config) {
    initContractsByNames({
      web3: web3Config.web3,
      branch: web3Config.branch,
      names: web3Config.names,
    }).then(async () => {
      await this.getStakingRange();
      await this.getVotingDuration();
      await this.initContractData();
      await this.updateAccountBalance();

      // detect when the MetaMask account is changed
      window.ethereum.on("accountsChanged", async (chagedAccounts) => {
        // disconnect MetaMask
        if (chagedAccounts[0] === undefined) {
          console.error("MetaMask connection is broken!");
          window.location.reload();
          return;
        }
        await this.updateDefaultAccount(chagedAccounts[0]);
      });

      this.setStakingEventsWatch();
      // check if account is a proposalable member
      this.data.isMember = await contracts.governance.isMember(
        web3Instance.defaultAccount
      );
      this.setState({ contractReady: true });
    });
  }

  // set the balance of account
  async updateAccountBalance() {
    this.data.myBalance = await contracts.staking.balanceOf(
      web3Instance.defaultAccount
    );
    this.data.myLockedBalance = await contracts.staking.lockedBalanceOf(
      web3Instance.defaultAccount
    );
    this.data.myBalance = web3Instance.web3.utils.fromWei(
      this.data.myBalance,
      "ether"
    );
    this.data.myLockedBalance = web3Instance.web3.utils.fromWei(
      this.data.myLockedBalance,
      "ether"
    );
    this.setState({ stakingModalVisible: false, loading: false });
  }

  // set the default account to MetaMask account
  async updateDefaultAccount(account) {
    if (web3Instance.defaultAccount.toLowerCase() !== account.toLowerCase()) {
      web3Instance.defaultAccount = account;
      await this.updateAccountBalance();
      this.setStakingEventsWatch();
      this.data.isMember = await contracts.governance.isMember(
        web3Instance.defaultAccount
      );
      this.setState({ showProposal: false });
    }
  }

  setStakingEventsWatch() {
    if (this.data.eventsWatch) {
      this.data.eventsWatch.unsubscribe((error, success) => {
        if (error) console.log("Faild to unsubscribed!");
        // else if (success) console.log('Successfully unsubscribed!')
      });
    }
    var filteraddress = web3Instance.web3.eth.abi.encodeParameter(
      "address",
      web3Instance.defaultAccount
    );
    this.data.eventsWatch = contracts.staking.stakingInstance.events.allEvents(
      {
        fromBlock: "latest",
        topics: [null, filteraddress],
      },
      (error, events) => {
        // console.log(events)
        if (error) console.log("error", error);
        else this.updateAccountBalance();
      }
    );
  }

  // set the minimum and maximum values that can be staked
  async getStakingRange() {
    if (["MAINNET", "TESTNET"].includes(web3Instance.netName)) {
      this.data.stakingMin = web3Instance.web3.utils.fromWei(
        await contracts.envStorage.getStakingMin()
      );
      this.data.stakingMax = web3Instance.web3.utils.fromWei(
        await contracts.envStorage.getStakingMax()
      );
    }
  }

  // set voting duration minium and maximum values
  async getVotingDuration() {
    if (["MAINNET", "TESTNET"].includes(web3Instance.netName)) {
      const duration = await contracts.envStorage.getBallotDurationMinMax();
      this.data.votingDurationMin = duration[0];
      this.data.votingDurationMax = duration[1];
    }
  }

  async initContractData() {
    await this.getAuthorityData();
    await this.initBallotData();
    util.setUpdatedTimeToLocal(new Date());
  }

  async refreshContractData(forced = false) {
    const updatedTime = forced ? 0 : util.getUpdatedTimeFromLocal.value;
    if (updatedTime + constants.expirationTime > Date.now()) return;
    Promise.all([
      this.getAuthorityData(),
      this.getBallotData(),
      this.modifyBallotData(),
    ]).then(() => util.setUpdatedTimeToLocal(new Date()));
  }

  // get the authority list stored in localStorage if modified block height is equal
  // or initalize new authority list
  async getAuthorityData() {
    const modifiedBlock = await contracts.governance.getModifiedBlock();
    if (
      modifiedBlock === util.getModifiedFromLocal() &&
      util.getAuthorityFromLocal()
    ) {
      this.data.authorityOriginData = util.getAuthorityFromLocal();
      return;
    }
    await this.initAuthorityData();
    util.setModifiedToLocal(modifiedBlock);
  }

  async getBallotData() {
    const ballotCnt = await contracts.governance.getBallotLength();
    let localBallotCnt = Object.keys(this.data.ballotBasicOriginData).length;
    if (!ballotCnt || ballotCnt === localBallotCnt) return;

    for (localBallotCnt += 1; localBallotCnt <= ballotCnt; localBallotCnt++) {
      await this.getBallotBasicOriginData(localBallotCnt);
      await this.getBallotMemberOriginData(localBallotCnt);
    }
  }

  async modifyBallotData() {
    let voteLength = await contracts.governance.getVoteLength();
    if (!voteLength || voteLength === this.data.voteLength) return;

    for (
      this.data.voteLength += 1;
      this.data.voteLength <= voteLength;
      this.data.voteLength++
    ) {
      const ballotId = (
        await contracts.ballotStorage.getVote(this.data.voteLength)
      ).ballotId;
      await this.getBallotBasicOriginData(ballotId);
      await this.getBallotMemberOriginData(ballotId);
    }
    this.data.voteLength -= 1;
  }

  // get a static list for network status from github repository
  async initAuthorityData() {
    let authorityOriginData = await util.getAuthorityLists(
      constants.authorityRepo.org,
      constants.authorityRepo.repo,
      constants.authorityRepo.branch,
      constants.authorityRepo.source
    );
    this.data.authorityOriginData = await this.refineAuthority(
      authorityOriginData
    );
    util.setAuthorityToLocal(this.data.authorityOriginData);
  }

  // to make sure that the authority is included
  async refineAuthority(authorityList) {
    let memberAuthority = {};
    let index = 0;
    for (let i = 0; i < Object.keys(authorityList).length; i++) {
      if (await contracts.governance.isMember(authorityList[i].addr)) {
        memberAuthority[index] = authorityList[i];
        memberAuthority[index].addr = web3Instance.web3.utils.toChecksumAddress(
          memberAuthority[index].addr
        );
        index++;
      }
    }
    return memberAuthority;
  }

  // get the ballot list stored in localStorage
  // or initalize new ballot list
  async initBallotData() {
    let ballotBasicFinalizedData = util.getBallotBasicFromLocal()
      ? util.getBallotBasicFromLocal()
      : {};
    let ballotMemberFinalizedData = util.getBallotMemberFromLocal()
      ? util.getBallotMemberFromLocal()
      : {};
    let localDataUpdated = false;

    this.data.voteLength = await contracts.governance.getVoteLength();
    const ballotCnt = await contracts.governance.getBallotLength();
    if (!ballotCnt) return;
    for (var i = 1; i <= ballotCnt; i++) {
      if (i in ballotBasicFinalizedData) {
        this.data.ballotBasicOriginData[i] = ballotBasicFinalizedData[i];
        this.data.ballotMemberOriginData[i] = ballotMemberFinalizedData[i];
      } else {
        let isUpdated = await this.getBallotBasicOriginData(
          i,
          ballotBasicFinalizedData
        );
        await this.getBallotMemberOriginData(
          i,
          isUpdated,
          ballotMemberFinalizedData
        );
        if (isUpdated) localDataUpdated = true;
      }
    }

    if (localDataUpdated) {
      util.setBallotBasicToLocal(ballotBasicFinalizedData);
      util.setBallotMemberToLocal(ballotMemberFinalizedData);
    }
  }

  async getBallotBasicOriginData(i, ballotBasicFinalizedData = {}) {
    let isUpdated = false;
    await contracts.ballotStorage.getBallotBasic(i).then((ret) => {
      this.data.ballotTypeData[i] = ret.ballotType; // for sorting ballot data
      ret.id = i; // add ballot id

      util.refineBallotBasic(ret);
      this.data.ballotBasicOriginData[i] = ret;

      if (
        ret.state === constants.ballotState.Accepted ||
        ret.state === constants.ballotState.Rejected
      ) {
        ballotBasicFinalizedData[i] = ret;
        isUpdated = true;
      }
    });
    return { isUpdated };
  }

  // match the ballot item with the ballot data
  async getBallotMemberOriginData(
    i,
    isUpdated = false,
    ballotMemberFinalizedData
  ) {
    const ballotType = this.data.ballotTypeData[i];
    let result = null;

    switch (ballotType) {
      case "4":
        result = {
          oldGovernanceAddress: await contracts.governance.implementation(),
          newGovernanceAddress: await contracts.ballotStorage.getBallotAddress(
            i
          ),
        };
        break;
      case "5": {
        result = await contracts.ballotStorage.getBallotVariable(i);
        const type = ENV_NAMES_SHA3.filter((key) => {
          return key.sha3Name === result.envVariableName;
        })[0] || { name: "Wrong Proposal (This label is only test)" };
        result.envVariableName = type.name;
        break;
      }
      // TODO member
      case "1":
      default:
        result = await contracts.ballotStorage.getBallotMember(i);
        break;
    }

    if (typeof result === "object") {
      // delete duplicate key values that web3 returns
      for (let key in result) {
        if (!isNaN(key)) delete result[key];
      }
    }
    result.id = i; // add ballot id
    this.data.ballotMemberOriginData[i] = result;
    if (isUpdated) ballotMemberFinalizedData[i] = result;
  }

  // Called when TapNav menu clicked
  onMenuClick = ({ key }) => {
    this.setState({ nav: key });
  };

  onClickFootIcon = (e) => {
    switch (e.target.alt) {
      case "wemix":
        window.open("", "_blank");
        break;
      case "explorer":
        window.open(metaWeb3Constants.NETWORK[web3Instance.netId].EXPLORER);
        break;
      case "github":
        window.open("https://github.com/nxtmeta/", "_blank");
        break;
      default:
    }
  };

  getContent() {
    if (!this.state.loadWeb3) return;
    this.refreshContractData();
    switch (this.state.nav) {
      case "1":
        return (
          <Authority
            title="Authority"
            contracts={contracts}
            getErrModal={this.getErrModal}
            authorityOriginData={this.data.authorityOriginData}
            netName={web3Instance.netName}
          />
        );
      case "2":
        return (
          <Voting
            title="Voting"
            contracts={contracts}
            getErrModal={this.getErrModal}
            initContractData={this.initContractData}
            refreshContractData={this.refreshContractData}
            authorityOriginData={this.data.authorityOriginData}
            ballotMemberOriginData={this.data.ballotMemberOriginData}
            ballotBasicOriginData={this.data.ballotBasicOriginData}
            convertVotingComponent={this.convertVotingComponent}
            loading={this.state.loading}
            convertLoading={this.convertLoading}
            showProposal={this.state.showProposal}
            isMember={this.data.isMember}
            stakingMax={this.data.stakingMax}
            stakingMin={this.data.stakingMin}
            votingDurationMax={this.data.votingDurationMax}
            votingDurationMin={this.data.votingDurationMin}
          />
        );
      case "3":
        return <Myinfo title="Myinfo" />;
      default:
    }
    this.setState({ selectedMenu: true });
  }

  // Called when New Proposal button is clicked in Voting Menu
  convertVotingComponent = (component) => {
    if (component === "proposal") {
      this.setState({ showProposal: true });
    } else this.setState({ showProposal: false });
  };

  convertLoading = (state) => {
    if (typeof state === "boolean") {
      this.setState({ loading: state });
    }
  };

  getErrModal = (
    _err = "Unknown Error",
    _title = "Unknown Error",
    _link = false
  ) => {
    if (_err.includes("error:")) _err = _err.split("error:")[1];

    this.data.errTitle = _title;
    this.data.errContent = _err;
    if (_link)
      this.data.errLink = metaWeb3Constants.NETWORK[web3Instance.netId] + _link;
    else this.data.errLink = false;
    this.setState({ errModalVisible: true });
  };

  getStakingModal = () => {
    this.data.stakingAmount = "";
    this.data.stakingTopic = "deposit";
    this.setState({ stakingModalVisible: true });
  };

  submitWemixStaking = () => {
    if (!/^[1-9]\d*$/.test(this.data.stakingAmount)) {
      this.setState({ errStakging: true });
      return;
    }

    this.setState({ loading: true });
    let trx = {};
    if (this.data.stakingTopic === "deposit")
      trx = contracts.staking.deposit(this.data.stakingAmount);
    else trx = contracts.staking.withdraw(this.data.stakingAmount);
    this.sendStakingTransaction(trx);
  };

  sendStakingTransaction(trx) {
    trx.from = web3Instance.defaultAccount;
    web3Instance.web3.eth.sendTransaction(trx, async (err, hash) => {
      if (err) {
        console.log(err);
        this.getErrModal(err.message, "Staking Error");
      } else {
        console.log("hash: ", hash);
      }
      this.setState({ stakingModalVisible: false, loading: false });
    });
  }

  handleSelectChange = (topic) => {
    this.data.stakingTopic = topic;
    this.setState({});
  };

  handleInputChange = (event) => {
    let value = event.target.value;
    if (/^([0-9]*)$/.test(value)) {
      this.data.stakingAmount = value;
      this.setState({ errStakging: false });
    }
  };

  render() {
    return (
      <Layout className="layout">
        <AccessFailedModal
          visible={!!this.state.accessFailMsg}
          message={this.state.accessFailMsg}
        />

        {this.state.contractReady && this.state.loadWeb3 ? (
          <div className="flex-column">
            <Header className={web3Instance.netName}>
              <TopNav
                netName={web3Instance.netName}
                nav={this.state.nav}
                myBalance={this.data.myBalance}
                myLockedBalance={this.data.myLockedBalance}
                onMenuClick={this.onMenuClick}
                getStakingModal={this.getStakingModal}
              />
            </Header>

            <StakingModal
              netName={web3Instance.netName}
              accountBalance={{
                balance: this.data.myBalance,
                lockedBalance: this.data.myLockedBalance,
              }}
              stakingModalVisible={this.state.stakingModalVisible}
              loading={this.state.loading}
              stakingAmount={this.data.stakingAmount}
              errStakging={this.state.errStakging}
              stakingTopic={this.data.stakingTopic}
              hideStakingModal={() => {
                if (!this.state.loading)
                  this.setState({ stakingModalVisible: false });
              }}
              submitWemixStaking={this.submitWemixStaking}
              handleInputChange={this.handleInputChange}
              handleSelectChange={this.handleSelectChange}
            />

            <ErrModal
              netName={web3Instance.netName}
              title={this.data.errTitle}
              err={this.data.errContent}
              link={this.data.errLink}
              visible={this.state.errModalVisible}
              coloseErrModal={() =>
                this.setState({ errModalVisible: !this.state.loadWeb3 })
              }
            />

            <Content>
              {this.state.loadWeb3 ? (
                <div> {this.getContent()} </div>
              ) : (
                this.getErrModal(
                  "This is an unknown network. Please connect to Metadium network",
                  "Connecting Error"
                )
              )}
            </Content>

            <Footer>
              <FootNav
                netName={web3Instance.netName}
                onClickFootIcon={this.onClickFootIcon}
              />
            </Footer>
          </div>
        ) : (
          <div>
            <BaseLoader />
          </div>
        )}
      </Layout>
    );
  }
}

export default App;

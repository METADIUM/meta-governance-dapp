import React from 'react'
import { Button, Progress, Input, Affix, Menu } from 'antd'
import './style/style.css'
import { ProposalForm } from './ProposalForm'
import * as util from '../util'
import { web3Instance } from '../ethereum/web3'
import { constants } from '../ethereum/constants'

class Voting extends React.Component {
    data = {
      ballotBasicOriginData: [],
      ballotBasicOriginItems: [],
      ballotUpdateData: { duration: 0, memo: 'new memo' },
      activeItems: [],
      proposalItems: [],
      finalizedItems: [],
      ballotCnt: 0,
      isMember: false,
    }
    state = {
      isBallotLoading: false,
      isBallotDetailLoading: false,
      isUpdated: false,
      didVoted: false,
      newProposal: false,
      position: 'active'
    }

    constructor (props) {
      super(props)
      this.onClickDetail = this.onClickDetail.bind(this)
      this.onClickVote = this.onClickVote.bind(this)
      this.onClickUpdateProposal = this.onClickUpdateProposal.bind(this)

      this.activeTitle = null;
      this.proposalTitle = null;
      this.finalizedTitle = null;
      this.ballotDestals = new Map();
    }

    async componentDidMount () {
      this.data.isMember = await this.props.contracts.gov.isMember(web3Instance.defaultAccount)
      this.data.ballotCnt = await this.props.contracts.gov.getBallotLength()
      this.getBallotOriginItem()
    }

    async getBallotOriginItem () {
      let list = []
      // Use origin data in contract
      if (!this.data.ballotCnt) return
      for (var i = 1; i <= this.data.ballotCnt; i++) {
        await this.props.contracts.ballotStorage.getBallotBasic(i).then(
          ret => {
            ret.id = i // Add ballot id
            this.data.ballotBasicOriginData = [...this.data.ballotBasicOriginData, util.refineBallotBasic(ret)]
          })
      }
      if (!this.data.ballotBasicOriginData) return
      this.data.ballotBasicOriginData.map((item, index) => {
        list.push(
          <div className={"ballotDiv state" + item.state} state={item.state} key={list.length} id={item.id} ref={ ref => this.ballotDestals.set(index, ref)}>
            <div className="ballotInfoDiv">
              <div className="infoLeft">
                <p className="topic">{constants.ballotTypesArr[parseInt(item.ballotType)]}</p>
                <p className="company">METADIUM_EXAM</p>
                <p className="addr">{item.creator}</p>
              </div>
              <div className="infoRight">
                {item.state === constants.ballotState.Ready || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected
                  ? <Button type='primary' id='ballotDetailBtn' onClick={e => this.onClickDetail(index, e)} icon="down"/> : <div>&nbsp;</div>}
                <p className="status">Status : {constants.ballotStateArr[parseInt(item.state)]}</p>
              </div>
            </div>
	          <div className="ballotContentDiv">
              <div className="voteDiv">
                <div className="imageContent">
                  <Button id='yesVotingBtn' onClick={() => this.onClickVote('Y', item.id)} >Yes</Button>
                  <div className="chart">
                    <div className="number">
                      <span>{item.powerOfAccepts === 0 ? '0' : item.powerOfAccepts}%</span>
                      <span>{item.powerOfRejects === 0 ? '0' : item.powerOfRejects}%</span>
                    </div>
                    <Progress percent={item.powerOfAccepts} status="active" showInfo={false} />
                  </div>
                  <Button id='noVotingBtn' onClick={() => this.onClickVote('N', item.id)} >No</Button>
                </div>
                <div className="textContent">
                  <p className="description">description<br/>description<br/>description</p>
                  <div className="duration">
                    { item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected || item.state === constants.ballotState.InProgress
                    ? <div>
                      <div><span>Start : </span><span>{item.startTime}</span></div>
                      <div><span>End : </span><span>{item.endTime}</span></div>
                    </div> : null }
                    { item.state === constants.ballotState.Ready
                    ? <div>
                      <div><span>duration</span><span>{item.duration}days</span></div>
                      <Button type='primary' onClick={() => this.onClickUpdateProposal('change', item.id)}>Change</Button>
                    </div> : null }
                  </div>
                </div>
              </div>
              <div className="memoDiv">
                <p>MEMO</p>
                <p>{item.memo}</p>
              </div>
              { item.state === '1'
              ? <div className="revokeDiv">
                <Button onClick={() => this.onClickUpdateProposal('revoke', item.id)}>Revoke</Button>
              </div> : null }
            </div>
          </div>
        )
      })
      this.data.ballotBasicOriginItems = list

      this.getBallotDetailInfo()
      this.setState({ isBallotLoading: true })
    }

    getBallotDetailInfo () {
      let activeList = []; let proposalList = []; let finalizedList = []

      this.data.ballotBasicOriginItems.map(item => {
        switch (item.props.state) {
          case '2': activeList.push(item) // InProgress
            break
          case '1': proposalList.push(item) // Ready
            break
          case '3': // Aceepted, Rejected
          case '4': finalizedList.push(item)
            break
          default: break
        }
      })
      this.data.activeItems = activeList
      this.data.proposalItems = proposalList
      this.data.finalizedItems = finalizedList
    }

    onClickDetail = (index, e) => {
      this.ballotDestals.get(index).style.height = this.ballotDestals.get(index).style.height === "auto" ? "124px" : "auto";
    }

    onClickVote = (e, id) => {
      if (!web3Instance.web3) return

      let approval
      if (e === 'N') approval = false
      else approval = true

      let { to, data } = this.props.contracts.govImp.vote(id, approval)
      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        to: to,
        data: data
      }, (err, hash) => {
        if (err) console.log('err: ', err)
        else {
          this.setState({ didVoted: true })
        }
      })
    }

    async onClickUpdateProposal (e, id) {
      let trx
      if (e === 'change') {
        trx = await this.props.contracts.ballotStorage.updateBallotDuration(id, util.convertDayToTimestamp(this.data.ballotUpdateData.duration))
        // Using updateMemo
        //trx = this.props.contracts.ballotStorage.updateBallotMemo(id, web3Instance.web3.utils.asciiToHex(this.data.ballotUpdateData.memo))
      }
      else {
        trx = this.props.contracts.ballotStorage.cancelBallot(id)
      }
      console.log(trx,id,parseInt(constants.ballotState.Canceled))

      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        to: trx.to,
        data: trx.data
      }, (err, hash) => {
        if (err) console.log('err: ', err)
        else this.setState({ isUpdated: true })
      })
    }

    onClickSubMenu = (e) => {
      switch(e.key) {
        case 'active': window.scrollTo(0, this.activeTitle.offsetTop - 70)
          break
        case 'proposal': window.scrollTo(0, this.proposalTitle.offsetTop - 70)
          break
        case 'finalized': window.scrollTo(0, this.finalizedTitle.offsetTop - 70)
         break
        default: break
      }
      this.setState({ position: e.key })
    }

    render () {
      return (
        <div>
          {!this.state.newProposal
            ? <div className="background">
              <div className="sub-header">
                <div className="functionDiv">
                  <div>
                    <Input.Search
                      placeholder='Search by Type, Proposal, Keywords'
                      enterButton
                    />
                    {!this.data.isMember
                    ? <Button className='apply_proposal_Btn' onClick={() => this.setState({ newProposal: !this.state.newProposal })}>
                      <span>+</span>
                      <span className="text_btn">New Proposal</span>
                    </Button>
                    : <Button className='apply_proposal_Btn' onClick={() => this.setState({ newProposal: !this.state.newProposal })}>
                    <span>+</span>
                    <span className="text_btn">New Proposal</span>
                  </Button>}
                  </div>
                </div>
                <Affix>
                  <div className="sub-menu">
                    <Menu
                      onClick={this.onClickSubMenu}
                      selectedKeys={[this.state.position]}
                      mode="horizontal">
                      <Menu.Item key="active">Active</Menu.Item>
                      <Menu.Item key="proposal">Proposal</Menu.Item>
                      <Menu.Item key="finalized">Finalized</Menu.Item>
                    </Menu>
                  </div>
                </Affix>
              </div>
              <div className='contentDiv'>
                <p className="stateTitle" ref={ ref => {this.activeTitle = ref;} }>Active</p>
                {this.state.isBallotLoading ? this.data.activeItems : <div>empty</div> }
                <p className="stateTitle" ref={ ref => {this.proposalTitle = ref;} }>Proposals</p>
                {this.state.isBallotLoading ? this.data.proposalItems : <div>empty</div> }
                {this.data.proposalItems.length > 0
                ? <div className="moreDiv">
                  <Button value="large">
                    <span>+</span>
                    <span className="text_btn">Read More</span>
                  </Button>
                </div>
                : null}
                <p className="stateTitle"ref={ ref => {this.finalizedTitle = ref;} }>Finalized</p>
                {this.state.isBallotLoading ? this.data.finalizedItems : <div>empty</div>}
                {this.data.finalizedItems.length > 0
                ? <div className="moreDiv">
                  <Button value="large">
                    <span>+</span>
                    <span className="text_btn">Read More</span>
                  </Button>
                </div>
                : null}
              </div>
            </div>
            : <div>
              <ProposalForm contracts = {this.props.contracts}/>
            </div>
          }
        </div>
      )
    }
}
export { Voting }

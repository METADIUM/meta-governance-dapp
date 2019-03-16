import React from 'react'
import { Button, Affix, Menu, Modal, Slider } from 'antd'
import './style/style.css'
import { ProposalForm } from './ProposalForm'
import { VotingBallots } from './VotingBallots'
import { SubHeader } from './Nav'
import { BaseLoader } from './BaseLoader'

import * as util from '../util'
import { web3Instance } from '../ethereum/web3'
import { constants } from '../ethereum/constants'

class Voting extends React.Component {
  data = {
   // Mapped with ballotBasicOriginData
    ballotCnt: 0,
    curBallotIdx: 0,
    ballotMemberOriginData: {},
    ballotBasicOriginData: [],
    ballotBasicOriginItems: [],
    existBallotNewMember: [],
    existBallotOldMemberaddr: [],
    activeItems: [],
    proposalItems: [],
    finalizedItems: [],
    authorityNames: new Map()
  }
  state = {
    isBallotLoading: false,
    ballotUpdateDuration: 2,
    ballotUpdateMemo: 'new memo',
    position: 'active',
    updateModal: false,
    proposalCount: 5,
    finalizedCount: 5,
    visibleActiveItems: [],
    visibleProposalItems: [],
    visibleFinalizedItems: []
  }

  constructor (props) {
    super(props)
    this.reloadVoting = this.reloadVoting.bind(this)
    this.getOriginData = this.getOriginData.bind(this)
    this.getBallotOriginItem = this.getBallotOriginItem.bind(this)
    this.getBallotDetailInfo = this.getBallotDetailInfo.bind(this)
    this.setDescription = this.setDescription.bind(this)
    this.waitForReceipt = this.waitForReceipt.bind(this)
    this.onClickDetail = this.onClickDetail.bind(this)
    this.onClickVote = this.onClickVote.bind(this)
    this.onClickUpdateProposal = this.onClickUpdateProposal.bind(this)
    this.completeModal = this.completeModal.bind(this)
    this.onClickSubMenu = this.onClickSubMenu.bind(this)
    this.onClickReadMore = this.onClickReadMore.bind(this)
    this.sliderChange = this.sliderChange.bind(this)
    this.searchBallot = this.searchBallot.bind(this)
    this.convertVotingComponentOveride = this.convertVotingComponentOveride.bind(this)

    this.activeTitle = null;
    this.proposalTitle = null;
    this.finalizedTitle = null;
    this.ballotDetails = new Map();
  }

  async componentDidMount () {
    this.data.ballotCnt = await this.props.contracts.gov.getBallotLength()
    this.props.authorityOriginData.map(item => this.data.authorityNames.set(item.addr, item.title))
    this.getOriginData()
  }

  async reloadVoting(component) {
    if(component) this.props.convertVotingComponent(component)
    this.data.ballotCnt = await this.props.contracts.gov.getBallotLength()
    this.data.ballotBasicOriginData = []
    await this.getOriginData()
    this.props.convertLoading(false)
  }

  async getOriginData () {
    if (!this.data.ballotCnt) return
    console.log('Ballot Count: ', this.data.ballotCnt)
    for (var i = 1; i <= this.data.ballotCnt; i++) {
      await this.props.contracts.ballotStorage.getBallotBasic(i).then(
        ret => {
          ret.id = i // Add ballot id
          this.data.ballotBasicOriginData = [...this.data.ballotBasicOriginData, util.refineBallotBasic(ret)]
        })
      await this.props.contracts.ballotStorage.getBallotMember(i).then(
        ret => {
          ret.id = i // Add ballot id
           this.data.ballotMemberOriginData[i] = ret
        })
    }
    this.getBallotOriginItem()
  }

  async getBallotOriginItem () {
    if (!this.data.ballotBasicOriginData || !this.data.ballotMemberOriginData) return
    let list = []
    // Use origin data in contract

    this.data.ballotBasicOriginData.map((item, index) => {
      const newMemberAddress = this.data.ballotMemberOriginData[item.id].newMemberAddress
      const oldMemberAddress = this.data.ballotMemberOriginData[item.id].oldMemberAddress

      if(item.state === constants.ballotState.Ready || item.state === constants.ballotState.InProgress) {
        this.data.existBallotNewMember.push(newMemberAddress)
        this.data.existBallotOldMember.push(oldMemberAddress)
      }
        
      list.push(
        <VotingBallots
          key={index}
          item={item}
          ballotDetails={this.ballotDetails}
          authorityName={this.data.authorityNames.get(item.creator)}
          newMemberAddress={newMemberAddress}
          oldMemberAddress={oldMemberAddress}
          setTopic={this.setTopic}
          onClickDetail={this.onClickDetail}
          onClickVote={this.onClickVote}
          setDescription={this.setDescription}
          onClickUpdateProposal={this.onClickUpdateProposal}/>
      )
    })
    this.data.ballotBasicOriginItems = list
    this.getBallotDetailInfo()
  }

  getBallotDetailInfo () {
    let activeList = []; let proposalList = []; let finalizedList = []

    this.data.ballotBasicOriginItems.map(item => {
      switch (item.props.item.state) {
        case constants.ballotState.InProgress: activeList.push(item); break // InProgress
        case constants.ballotState.Ready: proposalList.push(item);break // Ready
        case constants.ballotState.Accepted: // Aceepted, Rejected
        case constants.ballotState.Rejected: finalizedList.push(item); break
        default: break
      }
    })
    this.data.activeItems = activeList
    this.data.proposalItems = proposalList
    this.data.finalizedItems = finalizedList
    this.setState({visibleActiveItems: activeList, visibleProposalItems: proposalList, visibleFinalizedItems: finalizedList, isBallotLoading: true})
  }

  setTopic(type, newAddr, oldAddr) {
    if(newAddr === oldAddr) return 'MemberUpdate'
    else return constants.ballotTypesArr[parseInt(type)]
  }

  setDescription(type, newAddr, oldAddr, id) {
    const lockAmount = web3Instance.web3.utils.fromWei(this.data.ballotMemberOriginData[id].lockAmount, 'ether')
    switch(type) {
      case constants.ballotTypes.MemverAdd:
        return <p className='description'>
          New Authority Address: {newAddr}<br />
          META To be Locked: {lockAmount}META
        </p>
      case constants.ballotTypes.MemberRemoval:
        return <p className='description'>
          Address To be Removed: {oldAddr}<br />
          META Amount to be unlocked: {lockAmount}META
        </p>
      case constants.ballotTypes.MemberChange:
        if(newAddr === oldAddr) {
          return <p className='description'>
          META To be Locked: {lockAmount}META
        </p>
        } else {
          return <p className='description'>
          Old Authority Address: {oldAddr}<br />
          New Authority Address: {newAddr}<br />
          META To be Locked: {lockAmount}META
        </p>
        }
      default:
        return <p className='description'>
        New Authority Address: {newAddr}<br />
        META To be Locked: {lockAmount}META
      </p>
    }
  }

  waitForReceipt = (hash, cb) =>{
    console.log('Start waitForReceipt: ', hash)
    web3Instance.web3.eth.getTransactionReceipt(hash, (err, receipt) => {
      console.log('getTransactionReceipt: ', receipt);
      if (err) console.log('err: ', err)

      if (receipt  === undefined || receipt === null){
        console.log('Try again in 1 second')
        // Try again in 1 second
        window.setTimeout(() => {this.waitForReceipt(hash, cb)}, 1000);
      } else {
        console.log('receipt : ', receipt)
        // Transaction went through
        if (cb) cb(receipt)
      }
    })
  }

  onClickDetail = (id) => {
    this.ballotDetails.get(id).style.height = this.ballotDetails.get(id).style.height === 'auto' ? '124px' : 'auto'
  }

  onClickVote (value, id, endTime, state) {
    if (!web3Instance.web3) {
      this.props.getErrModal("web3 is not exist", "Voting Error")
      return
    } else if (!this.props.isMember) {
      this.props.getErrModal("You are not member", "Voting Error")
      return
    } else if( state === constants.ballotState.InProgress && new Date(endTime * 1000) < Date.now()) {
      this.props.getErrModal("This Ballot is timeouted", "Voting Error")
      this.reloadVoting(false)
      return
    }

    this.props.convertLoading(true)
    let { to, data } = this.props.contracts.govImp.vote(id, value === 'Y')
    web3Instance.web3.eth.sendTransaction({
      from: web3Instance.defaultAccount,
      to: to,
      data: data
    }, (err, hash) => {
      if (err) {
        console.log(err)
        this.props.getErrModal(err.message, err.name)
        this.props.convertLoading(false)
      } else {
        console.log('hash: ', hash)
        this.waitForReceipt(hash, (receipt)=>{
          console.log("Updated :", receipt);
          if(receipt.status) this.reloadVoting(false)
          else this.props.getErrModal("You don't have voting authority", "Voting Error", receipt.transactionHash)
        });
      }
    })
  }

  onClickUpdateProposal (topic, id, duration, newMemberAddress, oldMemberAddress) {
    if (topic === 'change') {
      this.data.curBallotIdx = id
      this.setState({ ballotUpdateDuration: duration === 0 ? 1 : duration, updateModal: true })
      return
    }

    this.props.convertLoading(true)
    let trx = this.props.contracts.ballotStorage.cancelBallot(id)
    web3Instance.web3.eth.sendTransaction({
      from: web3Instance.defaultAccount,
      to: trx.to,
      data: trx.data
    }, (err, hash) => {
      if (err) {
        console.log(err)
        this.props.getErrModal(err.message, err.name)
        this.props.convertLoading(false)
      } else{
        console.log("hash:",hash) 
        this.waitForReceipt(hash, (receipt)=>{
          console.log("Updated :", receipt)
          if(receipt.status) this.reloadVoting(false)
          else this.props.getErrModal("You don't have revoke authority", "Voting Error", receipt.transactionHash)
        });
      }
    })
  }

  async completeModal (e) {
    this.props.convertLoading(true)
    let trx = await this.props.contracts.ballotStorage.updateBallotDuration(this.data.curBallotIdx, util.convertDayToTimestamp(this.state.ballotUpdateDuration))
    
    // Using updateMemo
    // trx = this.props.contracts.ballotStorage.updateBallotMemo(id, web3Instance.web3.utils.asciiToHex(this.state.ballotUpdateMemo))
    web3Instance.web3.eth.sendTransaction({
      from: web3Instance.defaultAccount,
      to: trx.to,
      data: trx.data
    }, (err, hash) => {
      if (err) {
        console.log(err)
        this.props.getErrModal(err.message, err.name)
        this.props.convertLoading(false)
      } else {
        console.log("hash:",hash) 
        this.waitForReceipt(hash, (receipt)=>{
          console.log("Updated :",receipt)
          if(receipt.status) this.reloadVoting(false)
          else this.props.getErrModal("You don't have change authority", "Change Error", receipt.transactionHash)
        });
      }
    })
    this.setState({ updateModal: false })
  }

  onClickSubMenu(e) {
    switch (e.key) {
      case 'active': if(this.activeTitle) window.scrollTo(0, this.activeTitle.offsetTop - 70); break
      case 'proposal': if(this.proposalTitle) window.scrollTo(0, this.proposalTitle.offsetTop - 70); break
      case 'finalized': if(this.finalizedTitle) window.scrollTo(0, this.finalizedTitle.offsetTop - 70); break
      default: break
    }
    this.setState({ position: e.key })
  }

  onClickReadMore(state) {
    switch(state) {
      case 'proposal': this.setState({proposalCount: this.state.proposalCount + 5}); break
      case 'finalized': this.setState({finalizedCount: this.state.finalizedCount + 5}); break
    }
  }

  sliderChange(value) {
    this.setState({ ballotUpdateDuration: value / 20 })
  }

  searchBallot(str) {
    str = str.toLowerCase()
    this.setState({
      visibleActiveItems: this.filteringBallot(this.data.activeItems, str),
      visibleProposalItems: this.filteringBallot(this.data.proposalItems, str),
      visibleFinalizedItems: this.filteringBallot(this.data.finalizedItems, str)
    })
  }

  filteringBallot(ballots, str) {
    return ballots.filter(value => {
      let topic = this.setTopic(value.props.item.ballotType, value.props.newMemberAddress, value.props.oldMemberAddress)
      return topic.toLowerCase().indexOf(str) !== -1 || value.props.authorityName.toLowerCase().indexOf(str) !== -1 || value.props.item.creator.toLowerCase().indexOf(str) !== -1 || value.props.newMemberAddress.toLowerCase().indexOf(str) !== -1 || value.props.oldMemberAddress.toLowerCase().indexOf(str) !== -1
    })
  }

  convertVotingComponentOveride() {
    this.props.convertVotingComponent('proposal')
  }

  render () {
    return (
      <div>
        {!this.props.showProposal
          ? <div className='background'>
            <SubHeader
              netid={this.props.netid}
              placeholder='Search by Type, Proposal, Keywords'
              condition={this.props.isMember}
              btnText='New Proposal'
              btnIcon='+'
              loading={!this.state.isBallotLoading || this.props.loading}
              btnFunction={this.convertVotingComponentOveride}
              searchFunction={this.searchBallot} />

            <Affix>
              <div className='sub-menu flex flex-center-vertical'>
                <Menu
                  onClick={this.onClickSubMenu}
                  selectedKeys={[this.state.position]}
                  mode='horizontal'>
                  <Menu.Item key='active'>Active</Menu.Item>
                  <Menu.Item key='proposal'>Proposal</Menu.Item>
                  <Menu.Item key='finalized'>Finalized</Menu.Item>
                </Menu>
              </div>
            </Affix>

            <Modal
              title='Voting Duration Change'
              visible={this.state.updateModal}
              onOk={this.completeModal}
              onCancel={e => this.setState({ updateModal: false })} >
              <p className='changeDay flex flex-end-vertical'>{this.state.ballotUpdateDuration}days</p>
              <Slider marks={{ 0: '0 days', 60: '3 days', 100: '5days' }} step={20} value={this.state.ballotUpdateDuration * 20} tooltipVisible={false} onChange={this.sliderChange} />
            </Modal>

            {!this.state.isBallotLoading || this.props.loading ? <div><BaseLoader/></div> : null}
            <div className='contentDiv container'>
              <p className='stateTitle text-heavy' ref={ref => { this.activeTitle = ref }}>Active</p>
              {this.data.activeItems}
              <p className='stateTitle text-heavy' ref={ref => { this.proposalTitle = ref }}>Proposals</p>
              {this.state.visibleProposalItems.slice(0, this.state.proposalCount)}
              {this.state.visibleProposalItems.length > 0
              ? <div className='moreDiv'>
                <Button value='large' onClick={(e) => this.onClickReadMore('proposal')}>
                  <span>+</span>
                  <span className='text_btn'>Read More</span>
                </Button>
              </div>
              : null}
              <p className='stateTitle text-heavy'ref={ref => { this.finalizedTitle = ref }}>Finalized</p>
              {this.state.visibleFinalizedItems.slice(0, this.state.finalizedCount)}
              {this.state.visibleFinalizedItems.length > 0
              ? <div className='moreDiv'>
                <Button value='large' onClick={(e) => this.onClickReadMore('finalized')}>
                  <span>+</span>
                  <span className='text_btn'>Read More</span>
                </Button>
              </div>
              : null}
            </div>
          </div>
          : <div>
            <ProposalForm
              contracts={this.props.contracts}
              getErrModal={this.props.getErrModal}
              newMemberaddr={this.data.newMemberaddr}
              oldMemberaddr={this.data.oldMemberaddr}
              convertComponent={this.reloadVoting.bind(this)}
              buttonLoading={this.props.buttonLoading}
              convertButtonLoading={this.props.convertLoading}
              waitForReceipt={this.waitForReceipt}/>
          </div>
        }
      </div>
    )
  }
}
export { Voting }

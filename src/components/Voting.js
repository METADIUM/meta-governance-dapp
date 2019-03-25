import React from 'react'

import { ProposalForm } from './ProposalForm'
import { VotingBallots, ShowBallots } from './VotingBallots'
import { SubHeader, SubNav } from './Nav'
import { ChangeModal } from './Modal'
import { BaseLoader } from './BaseLoader'

import * as util from '../util'
import { web3Instance } from '../web3'
import { constants } from '../constants'
import './style/style.css'

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
    authorityNames: new Map(),

    activeItems: [],
    proposalItems: [],
    finalizedItems: [],
    visibleActiveItems: [],
    visibleProposalItems: [],
    visibleFinalizedItems: []
  }

  state = {
    isBallotLoading: false,
    ballotUpdateDuration: 2,
    ballotUpdateMemo: 'new memo',
    position: 'active',
    updateModal: false,
    proposalCount: 5,
    finalizedCount: 5
  }

  constructor (props) {
    super(props)
    this.reloadVoting = this.reloadVoting.bind(this)
    this.getOriginData = this.getOriginData.bind(this)
    this.getBallotOriginItem = this.getBallotOriginItem.bind(this)
    this.getBallotDetailInfo = this.getBallotDetailInfo.bind(this)
    this.setBallotBasicOriginData = this.setBallotBasicOriginData.bind(this)
    this.setBallotMemberOriginData = this.setBallotMemberOriginData.bind(this)
    this.setDescription = this.setDescription.bind(this)
    this.waitForReceipt = this.waitForReceipt.bind(this)
    this.onClickDetail = this.onClickDetail.bind(this)
    this.onClickVote = this.onClickVote.bind(this)
    this.onClickUpdateProposal = this.onClickUpdateProposal.bind(this)
    this.completeModal = this.completeModal.bind(this)
    this.onClickSubMenu = this.onClickSubMenu.bind(this)
    this.onClickReadMore = this.onClickReadMore.bind(this)
    this.hideChangeModal = this.hideChangeModal.bind(this)
    this.sliderChange = this.sliderChange.bind(this)
    this.searchBallot = this.searchBallot.bind(this)
    this.convertVotingComponentOveride = this.convertVotingComponentOveride.bind(this)

    this.titles = { activeTitle: null, proposalTitle: null, finalizedTitle: null }
    this.ballotDetails = new Map()
  }

  async componentDidMount () {
    this.data.ballotCnt = await this.props.contracts.governance.getBallotLength()
    this.props.authorityOriginData.forEach(item => this.data.authorityNames.set(item.addr, item.title))
    this.getOriginData()
  }

  async reloadVoting (component) {
    if (component) this.props.convertVotingComponent(component)
    this.data.ballotCnt = await this.props.contracts.governance.getBallotLength()
    this.data.ballotBasicOriginData = []
    await this.getOriginData()
    this.props.convertLoading(false)
  }

  async getOriginData () {
    if (!this.data.ballotCnt) return
    for (var i = 1; i <= this.data.ballotCnt; i++) {
      await this.setBallotBasicOriginData(i)
      await this.setBallotMemberOriginData(i)
    }
    this.getBallotOriginItem()
  }

  async getBallotOriginItem () {
    if (!this.data.ballotBasicOriginData || !this.data.ballotMemberOriginData) return
    let list = []
    // Use origin data in contract

    this.data.ballotBasicOriginData.forEach((item, index) => {
      const newMemberAddress = this.data.ballotMemberOriginData[item.id].newMemberAddress
      const oldMemberAddress = this.data.ballotMemberOriginData[item.id].oldMemberAddress

      if (item.state === constants.ballotState.Ready || item.state === constants.ballotState.InProgress) {
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
          onClickUpdateProposal={this.onClickUpdateProposal}
        />
      )
    })
    this.data.ballotBasicOriginItems = list
    this.getBallotDetailInfo()
  }

  getBallotDetailInfo () {
    let activeList = [], proposalList = [], finalizedList = []

    this.data.ballotBasicOriginItems.forEach(item => {
      switch (item.props.item.state) {
        case constants.ballotState.InProgress: activeList.push(item); break // InProgress
        case constants.ballotState.Ready: proposalList.push(item); break // Ready
        case constants.ballotState.Accepted: // Aceepted, Rejected
        case constants.ballotState.Rejected: finalizedList.push(item); break
        default: break
      }
    })
    this.data.activeItems = this.data.visibleActiveItems = activeList
    this.data.proposalItems = this.data.visibleProposalItems = proposalList
    this.data.finalizedItems = this.data.visibleFinalizedItems = finalizedList
    this.setState({ isBallotLoading: true })
  }

  async setBallotBasicOriginData (i) {
    await this.props.contracts.ballotStorage.getBallotBasic(i).then(
      ret => {
        ret.id = i // Add ballot id
        this.data.ballotBasicOriginData = [...this.data.ballotBasicOriginData, util.refineBallotBasic(ret)]
      })
  }

  async setBallotMemberOriginData (i) {
    await this.props.contracts.ballotStorage.getBallotMember(i).then(
      ret => {
        ret.id = i // Add ballot id
        this.data.ballotMemberOriginData[i] = ret
      })
  }

  setTopic (type, newAddr, oldAddr) {
    if (type === constants.ballotTypes.MemberChange && newAddr === oldAddr) return 'MemberUpdate'
    else return constants.ballotTypesArr[parseInt(type)]
  }

  setDescription (type, newAddr, oldAddr, id) {
    const lockAmount = web3Instance.web3.utils.fromWei(this.data.ballotMemberOriginData[id].lockAmount, 'ether')
    switch (type) {
      case constants.ballotTypes.MemverAdd:
        return <p className='description flex-full'>
          New Authority Address: {newAddr}<br />
          META To be Locked: {lockAmount}META
        </p>
      case constants.ballotTypes.MemberRemoval:
        return <p className='description flex-full'>
          Address To be Removed: {oldAddr}<br />
          META Amount to be unlocked: {lockAmount}META
        </p>
      case constants.ballotTypes.MemberChange:
        if (newAddr === oldAddr) {
          return <p className='description flex-full'>
          META To be Locked: {lockAmount}META
          </p>
        } else {
          return <p className='description flex-full'>
          Old Authority Address: {oldAddr}<br />
          New Authority Address: {newAddr}<br />
          META To be Locked: {lockAmount}META
          </p>
        }
      default:
        return <p className='description flex-full'>
        New Authority Address: {newAddr}<br />
        META To be Locked: {lockAmount}META
        </p>
    }
  }

  waitForReceipt = (hash, cb) => {
    // console.log('Start waitForReceipt: ', hash)
    web3Instance.web3.eth.getTransactionReceipt(hash, (err, receipt) => {
      // console.log('getTransactionReceipt: ', receipt)
      if (err) console.log('err: ', err)

      if (receipt === undefined || receipt === null) {
        // Try again in 1 second
        window.setTimeout(() => { this.waitForReceipt(hash, cb) }, 1000)
      } else {
        // Transaction went through
        if (cb) cb(receipt)
      }
    })
  }

  onClickDetail = (e, id) => {
    const element = this.ballotDetails.get(id)
    if (element.style.height === 'auto') {
      e.target.style.transform = 'rotate(0deg)'
      element.style.height = constants.ballotDetailHeightToPixel
    } else {
      e.target.style.transform = 'rotate(180deg)'
      element.style.height = 'auto'
    }
  }

  onClickVote (value, id, endTime, state) {
    if (!web3Instance.web3) {
      this.props.getErrModal('web3 is not exist', 'Voting Error')
      return
    } else if (!this.props.isMember) {
      this.props.getErrModal('You are not member', 'Voting Error')
      return
    } else if (state === constants.ballotState.InProgress && new Date(endTime * 1000) < Date.now()) {
      this.props.getErrModal('This Ballot is timeouted', 'Voting Error')
      this.reloadVoting(false)
      return
    }

    this.props.convertLoading(true)
    let { to, data } = this.props.contracts.governance.vote(id, value === 'Y')
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
        // console.log('hash: ', hash)
        this.waitForReceipt(hash, (receipt) => {
          // console.log('Updated :', receipt)
          if (receipt.status) this.reloadVoting(false)
          else this.props.getErrModal("You don't have voting authority", 'Voting Error', receipt.transactionHash)
        })
      }
    })
  }

  onClickUpdateProposal (topic, id, duration) {
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
      } else {
        console.log('hash:', hash)
        this.waitForReceipt(hash, (receipt) => {
          console.log('Updated :', receipt)
          if (receipt.status) this.reloadVoting(false)
          else this.props.getErrModal("You don't have revoke authority", 'Voting Error', receipt.transactionHash)
        })
      }
    })
  }

  async completeModal (e) {
    this.props.convertLoading(true)
    let trx = await this.props.contracts.ballotStorage.updateBallotDuration(this.data.curBallotIdx, util.convertDayToTimestamp(this.state.ballotUpdateDuration))

    // Using updateMemo
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
        console.log('hash:', hash)
        this.waitForReceipt(hash, (receipt) => {
          console.log('Updated :', receipt)
          if (receipt.status) this.reloadVoting(false)
          else this.props.getErrModal("You don't have change authority", 'Change Error', receipt.transactionHash)
        })
      }
    })
    this.setState({ updateModal: false })
  }

  onClickSubMenu (e) {
    switch (e.key) {
      case 'active': if (this.titles.activeTitle) window.scrollTo(0, this.titles.activeTitle.offsetTop - 70); break
      case 'proposal': if (this.titles.proposalTitle) window.scrollTo(0, this.titles.proposalTitle.offsetTop - 70); break
      case 'finalized': if (this.titles.finalizedTitle) window.scrollTo(0, this.titles.finalizedTitle.offsetTop - 70); break
      default: break
    }
    this.setState({ position: e.key })
  }

  onClickReadMore (state) {
    switch (state) {
      case 'proposal': this.setState({ proposalCount: this.state.proposalCount + 5 }); break
      case 'finalized': this.setState({ finalizedCount: this.state.finalizedCount + 5 }); break
      default: break
    }
  }

  hideChangeModal () {
    this.setState({ updateModal: false })
  }

  sliderChange (value) {
    this.setState({ ballotUpdateDuration: value / 20 })
  }

  searchBallot (str) {
    str = str.toLowerCase()
    this.data.visibleActiveItems = this.filteringBallot(this.data.activeItems, str)
    this.data.visibleProposalItems = this.filteringBallot(this.data.proposalItems, str)
    this.data.visibleFinalizedItems = this.filteringBallot(this.data.finalizedItems, str)
    this.setState({ isBallotLoading: true })
  }

  filteringBallot (ballots, str) {
    return ballots.filter(value => {
      let topic = this.setTopic(value.props.item.ballotType, value.props.newMemberAddress, value.props.oldMemberAddress)
      return topic.toLowerCase().indexOf(str) !== -1 || value.props.authorityName.toLowerCase().indexOf(str) !== -1 || value.props.item.creator.toLowerCase().indexOf(str) !== -1 || value.props.newMemberAddress.toLowerCase().indexOf(str) !== -1 || value.props.oldMemberAddress.toLowerCase().indexOf(str) !== -1
    })
  }

  convertVotingComponentOveride () {
    this.props.convertVotingComponent('proposal')
  }

  render () {
    return (
      <div>
        {!this.props.showProposal
          ?
          <div className='background'>
            <SubHeader
              netName={web3Instance.netName}
              placeholder='Search by Type, Proposal, Keywords'
              condition={this.props.isMember || true}
              btnText='New Proposal'
              btnIcon='+'
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
              completeModal={this.completeModal}
              hideChangeModal={this.hideChangeModal}
              sliderChange={this.sliderChange}
            />

            {(!this.state.isBallotLoading || this.props.loading) && <div><BaseLoader /></div>}
            <ShowBallots
              titles={this.titles}
              visibleActiveItems={this.data.visibleActiveItems}
              visibleProposalItems={this.data.visibleProposalItems.slice(0, this.state.proposalCount)}
              visibleFinalizedItems={this.data.visibleFinalizedItems.slice(0, this.state.finalizedCount)}
              netName={web3Instance.netName}
              onClickReadMore={this.onClickReadMore}
            />
          </div>
          :
          <ProposalForm
            contracts={this.props.contracts}
            getErrModal={this.props.getErrModal}
            newMemberaddr={this.data.existBallotNewMember}
            oldMemberaddr={this.data.existBallotOldMemberaddr}
            convertComponent={this.reloadVoting}
            loading={this.props.loading}
            convertLoading={this.props.convertLoading}
            waitForReceipt={this.waitForReceipt}
            stakingMax={this.props.stakingMax}
            stakingMin={this.props.stakingMin}
          />
        }
      </div>
    )
  }
}
export { Voting }

import React from 'react'

import { ProposalForm, VotingBallots, ShowBallots, SubHeader, SubNav, ChangeModal, BaseLoader } from './'

import * as util from '../util'
import { web3Instance } from '../web3'
import { constants } from '../constants'
import './style/style.css'

class Voting extends React.Component {
  data = {
    // Mapped with ballotBasicOriginData
    curBallotIdx: 0,
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
    this.waitForReceipt = this.waitForReceipt.bind(this)

    this.ballotStorage = this.props.contracts.ballotStorage
    this.governance = this.props.contracts.governance

    this.titles = { activeTitle: null, proposalTitle: null, finalizedTitle: null }
    this.ballotDetails = new Map()
  }

  async componentDidMount () {
    Object.values(this.props.authorityOriginData).forEach(item => this.data.authorityNames.set(item.addr, item.title))
    this.getBallotOriginItem()
  }

  reloadVoting = async (component, init = false) => {
    if (component) this.props.convertVotingComponent(component)
    if (init) await this.props.initContractData()
    else await this.props.refreshContractData(true)
    this.getBallotOriginItem()
    this.props.convertLoading(false)
  }

  getBallotOriginItem () {
    if (!this.props.ballotBasicOriginData || !this.props.ballotMemberOriginData) return
    let list = []
    // Use origin data in contract

    Object.values(this.props.ballotBasicOriginData).forEach((item, index) => {
      const newMemberAddress = this.props.ballotMemberOriginData[item.id].newMemberAddress
      const oldMemberAddress = this.props.ballotMemberOriginData[item.id].oldMemberAddress

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
    this.data.ballotBasicOriginItems = list.reverse()
    this.getBallotDetailInfo()
  }

  getBallotDetailInfo () {
    let activeList = []
    let proposalList = []
    let finalizedList = []

    this.data.ballotBasicOriginItems.forEach(item => {
      switch (item.props.item.state) {
        case constants.ballotState.InProgress: activeList.push(item); break // InProgress
        case constants.ballotState.Ready: proposalList.push(item); break // Ready
        case constants.ballotState.Accepted: // Aceepted, Rejected
        case constants.ballotState.Rejected: finalizedList.push(item); break
        default: break
      }
    })

    this.data.activeItems = activeList
    this.data.visibleActiveItems = activeList
    this.data.proposalItems = proposalList
    this.data.visibleProposalItems = proposalList
    this.data.finalizedItems = finalizedList
    this.data.visibleFinalizedItems = finalizedList

    this.setState({ isBallotLoading: true })
  }

  setTopic = (type, newAddr, oldAddr) => {
    if (type === constants.ballotTypes.MemberChange && newAddr === oldAddr) return 'MemberUpdate'
    else return constants.ballotTypesArr[parseInt(type)]
  }

  setDescription = (type, newAddr, oldAddr, id) => {
    const lockAmount = web3Instance.web3.utils.fromWei(this.props.ballotMemberOriginData[id].lockAmount, 'ether')
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

  onClickVote = (value, id, endTime, state) => {
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
    let trx = this.governance.vote(id, value === 'Y')
    this.sendTransaction(trx, 'Voting')
  }

  onClickUpdateProposal = (topic, id, duration) => {
    if (topic === 'change') {
      this.data.curBallotIdx = id
      this.setState({ ballotUpdateDuration: duration === 0 ? 1 : duration, updateModal: true })
      return
    }

    this.props.convertLoading(true)
    let trx = this.ballotStorage.cancelBallot(id)
    this.sendTransaction(trx, 'Revoke', true)
  }

  completeModal = async (e) => {
    this.props.convertLoading(true)
    let trx = await this.ballotStorage.updateBallotDuration(this.data.curBallotIdx, util.convertDayToTimestamp(this.state.ballotUpdateDuration))
    this.sendTransaction(trx, 'Change', true)
    this.setState({ updateModal: false })
  }

  sendTransaction (trx, type, init = false) {
    trx.from = web3Instance.defaultAccount
    web3Instance.web3.eth.sendTransaction(trx, (err, hash) => {
      if (err) {
        console.log(err)
        this.props.getErrModal(err.message, err.name)
        this.props.convertLoading(false)
      } else {
        // console.log('hash: ', hash)
        this.waitForReceipt(hash, (receipt) => {
          // console.log('Updated :', receipt)
          if (receipt.status) this.reloadVoting(false, init)
          else {
            this.props.getErrModal(
              "You don't have " + type.toLowerCase + ' authority',
              type + ' Error',
              receipt.transactionHash)
          }
        })
      }
    })
  }

  onClickSubMenu = (e) => {
    switch (e.key) {
      case 'active': if (this.titles.activeTitle) window.scrollTo(0, this.titles.activeTitle.offsetTop - 70); break
      case 'proposal': if (this.titles.proposalTitle) window.scrollTo(0, this.titles.proposalTitle.offsetTop - 70); break
      case 'finalized': if (this.titles.finalizedTitle) window.scrollTo(0, this.titles.finalizedTitle.offsetTop - 70); break
      default: break
    }
    this.setState({ position: e.key })
  }

  onClickReadMore = (state) => {
    switch (state) {
      case 'proposal': this.setState({ proposalCount: this.state.proposalCount + 5 }); break
      case 'finalized': this.setState({ finalizedCount: this.state.finalizedCount + 5 }); break
      default: break
    }
  }

  hideChangeModal = () => {
    this.setState({ updateModal: false })
  }

  sliderChange = (value) => {
    this.setState({ ballotUpdateDuration: value / 20 })
  }

  searchBallot = (e) => {
    const str = e.target.value.toLowerCase()
    this.data.visibleActiveItems = this.filteringBallot(this.data.activeItems, str)
    this.data.visibleProposalItems = this.filteringBallot(this.data.proposalItems, str)
    this.data.visibleFinalizedItems = this.filteringBallot(this.data.finalizedItems, str)
    this.setState({ isBallotLoading: true, proposalCount: 5, finalizedCount: 5 })
  }

  filteringBallot (ballots, str) {
    return ballots.filter(value => {
      let topic = this.setTopic(value.props.item.ballotType, value.props.newMemberAddress, value.props.oldMemberAddress)
      return [topic,
        value.props.authorityName,
        value.props.item.creator,
        value.props.newMemberAddress,
        value.props.oldMemberAddress].some(elem => elem.toLowerCase().indexOf(str) !== -1)
    })
  }

  convertVotingComponentOveride = () => {
    this.props.convertVotingComponent('proposal')
  }

  render () {
    return (
      <div>
        {!this.props.showProposal
          ? <div className='background'>
            <SubHeader
              netName={web3Instance.netName}
              placeholder='Search by Type, Proposal, Keywords'
              condition={this.props.isMember || constants.debugMode}
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

            {(!this.state.isBallotLoading || this.props.loading) && <BaseLoader />}
            <ShowBallots
              titles={this.titles}
              visibleActiveItems={this.data.visibleActiveItems}
              visibleProposalItems={this.data.visibleProposalItems.slice(0, this.state.proposalCount)}
              totalProposalItemLength={this.data.visibleProposalItems.length}
              visibleFinalizedItems={this.data.visibleFinalizedItems.slice(0, this.state.finalizedCount)}
              totalFinalizedItemLength={this.data.visibleFinalizedItems.length}
              netName={web3Instance.netName}
              onClickReadMore={this.onClickReadMore}
            />
          </div>
          : <ProposalForm
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

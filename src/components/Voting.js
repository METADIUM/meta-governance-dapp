import React from 'react'
import { Button, Progress, Input, Affix, Menu, Modal, Slider } from 'antd'
import './style/style.css'
import { ProposalForm } from './ProposalForm'
import { BaseLoader } from './BaseLoader'
import * as util from '../util'
import { web3Instance } from '../ethereum/web3'
import { constants } from '../ethereum/constants'

class Voting extends React.Component {
    data = {
      // Mapped with ballotBasicOriginData
      ballotMemberOriginData: {},
      ballotBasicOriginData: [],
      ballotBasicOriginItems: [],
      ballotUpdateData: { duration: 2, memo: 'new memo' },
      activeItems: [],
      proposalItems: [],
      finalizedItems: [],
      ballotCnt: 0,
      curBallotIdx: 0,
      newMemberaddr: [],
      oldMemberaddr: [],
      authorityNames: new Map()
    }
    state = {
      isBallotLoading: false,
      isBallotDetailLoading: false,
      isUpdated: false,
      didVoted: false,
      position: 'active',
      updateModal: false,
      proposalCount: 5,
      finalizedCount: 5
    }

    constructor (props) {
      super(props)
      this.onClickDetail = this.onClickDetail.bind(this)
      this.onClickVote = this.onClickVote.bind(this)
      this.onClickUpdateProposal = this.onClickUpdateProposal.bind(this)
      this.completeModal = this.completeModal.bind(this)

      this.activeTitle = null;
      this.proposalTitle = null;
      this.finalizedTitle = null;
      this.ballotDestals = new Map();
    }

    async componentDidMount () {
      this.data.ballotCnt = await this.props.contracts.gov.getBallotLength()
      this.props.authorityOriginData.map(item => this.data.authorityNames.set(item.addr, item.title))
      console.log(this.data.authorityNames)
      this.getOriginData()
    }

    async getOriginData () {
      if (!this.data.ballotCnt) return
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

        this.data.newMemberaddr.push(newMemberAddress)
        this.data.oldMemberaddr.push(oldMemberAddress)
        list.push(
          <div className={'ballotDiv state' + item.state} state={item.state} key={list.length} id={item.id} ref={ref => this.ballotDestals.set(index, ref)}>
            <div className='ballotInfoDiv'>
              <div className='infoLeft'>
                <p className='topic'>{this.setTopic(constants.ballotTypesArr[parseInt(item.ballotType)], newMemberAddress, oldMemberAddress)}</p>
                <p className='company'>{this.data.authorityNames.get(item.creator)}</p>
                <p className='addr'>Proposal Address: {item.creator}</p>
              </div>
              <div className='infoRight'>
                {item.state === constants.ballotState.Ready || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected
                  ? <Button type='primary' id='ballotDetailBtn' onClick={e => this.onClickDetail(index, e)} icon='down' /> : <div>&nbsp;</div>}
                <p className='status'>Status : {constants.ballotStateArr[parseInt(item.state)]}</p>
              </div>
            </div>
            <div className='ballotContentDiv'>
              <div className='voteDiv'>
                <div className='imageContent'>
                  { !this.props.isMember || item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected
                    ? <Button disabled id='yesVotingBtn' onClick={() => this.onClickVote('Y', item.id)} >Yes</Button>
                    : <Button id='yesVotingBtn' onClick={() => this.onClickVote('Y', item.id)} loading={this.props.buttonLoading}>Yes</Button> }
                  <div className='chart'>
                    <div className='number'>
                      <span>{item.powerOfAccepts === 0 ? '0' : item.powerOfAccepts}%</span>
                      <span>{item.powerOfRejects === 0 ? '0' : item.powerOfRejects}%</span>
                    </div>
                    <Progress percent={item.powerOfAccepts} status='active' showInfo={false} />
                  </div>
                  { !this.props.isMember || item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected
                    ? <Button disabled id='noVotingBtn' onClick={() => this.onClickVote('N', item.id)} >No</Button>
                    : <Button id='noVotingBtn' onClick={() => this.onClickVote('N', item.id)} loading={this.props.buttonLoading} >No</Button> }
                </div>
                <div className='textContent'>
                  {this.setDescription(item.ballotType, newMemberAddress, oldMemberAddress, item.id)}
                  <div className='duration'>
                    { item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected || item.state === constants.ballotState.InProgress
                      ? <div>
                        <div><span>Start : </span><span>{item.startTime}</span></div>
                        <div><span>End : </span><span>{item.endTime}</span></div>
                      </div> : null }
                    { item.state === constants.ballotState.Ready
                      ? <div>
                        <div><span>duration</span><span>{item.duration === 0? 1 : item.duration}days</span></div>
                        <Button type='primary' onClick={() => this.onClickUpdateProposal('change', item.id)}>Change</Button>
                      </div> : null }
                  </div>
                </div>
              </div>
              <div className='memoDiv'>
                <p>MEMO</p>
                <p>{item.memo}</p>
              </div>
              { item.state === '1'
                ? <div className='revokeDiv'>
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

    setTopic(topic, newAddr, oldAddr) {
      if(newAddr === oldAddr) topic = 'MemberUpdate'
      return topic
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
            META To be Locked: {lockAmount}META
          </p>
        case constants.ballotState.MemberChange:
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
      this.ballotDestals.get(index).style.height = this.ballotDestals.get(index).style.height === 'auto' ? '124px' : 'auto'
    }

    async onClickVote (e, id) {
      this.props.convertButtonLoading(true)
      if (!web3Instance.web3) {
        this.props.convertButtonLoading(false)
        return
      }

      let approval
      if (e === 'N') approval = false
      else approval = true

      let { to, data } = this.props.contracts.govImp.vote(id, approval)
      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        to: to,
        data: data
      }, (err, hash) => {
        if (err) {
          console.log(err)
          this.props.getErrModal(err.message, err.name)
          this.props.convertButtonLoading(false)
        }
        else {
          console.log('hash: ', hash)
          this.getBallotOriginItem()
          this.setState({ didVoted: true })
        }
      })
    }

    async onClickUpdateProposal (e, id) {
      this.data.curBallotIdx = id
      let trx
      if (e === 'change') {
        this.setState({ updateModal: true })
        return
      } else {
        trx = this.props.contracts.ballotStorage.cancelBallot(id)
      }
      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        to: trx.to,
        data: trx.data
      }, (err, hash) => {
        if (err) {
          console.log(err)
          this.props.getErrModal(err.message, err.name)
          this.props.convertButtonLoading(false)
        }
        else this.setState({ isUpdated: true })
      })
    }

    onClickSubMenu = (e) => {
      switch (e.key) {
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

    onClickReadMore = (state) => {
      switch(state) {
        case 'proposal': this.setState({proposalCount: this.state.proposalCount + 5}); break
        case 'finalized': this.setState({finalizedCount: this.state.finalizedCount + 5}); break
      }
    }

    async completeModal (e) {
      let trx = await this.props.contracts.ballotStorage.updateBallotDuration(this.data.curBallotIdx, util.convertDayToTimestamp(this.data.ballotUpdateData.duration))
      // Using updateMemo
      // trx = this.props.contracts.ballotStorage.updateBallotMemo(id, web3Instance.web3.utils.asciiToHex(this.data.ballotUpdateData.memo))
      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        to: trx.to,
        data: trx.data
      }, (err, hash) => {
        if (err) {
          console.log(err)
          this.props.getErrModal(err.message, err.name)
          this.props.convertButtonLoading(false)
        }
        else this.setState({ isUpdated: true })
      })
      this.setState({ updateModal: false })
    }

    sliderChange = (value) => {
      this.data.ballotUpdateData.duration = value / 20
      this.setState({ isUpdated: true })
    }

    render () {
      return (
        <div>
          {!this.props.newProposal
            ? <div className='background'>
              <div className='sub-header'>
                <div className='functionDiv'>
                  <div>
                    <Input.Search
                      placeholder='Search by Type, Proposal, Keywords'
                      enterButton
                    />
                    {!this.props.isMember
                      ? <Button disabled className='apply_proposal_Btn' onClick={e => this.props.convertComponent('proposal')}>
                        <span>+</span>
                        <span className='text_btn'>New Proposal</span>
                      </Button>
                      : <Button className='apply_proposal_Btn' onClick={e => this.props.convertComponent('proposal')}>
                        <span>+</span>
                        <span className='text_btn'>New Proposal</span>
                      </Button>}
                  </div>
                </div>
                <Affix>
                  <div className='sub-menu'>
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
              </div>
              <Modal
                title='Voting Duration Change'
                visible={this.state.updateModal}
                onOk={this.completeModal}
                onCancel={e => this.setState({ updateModal: false })} >
                <p className='changeDay'>{this.data.ballotUpdateData.duration}days</p>
                <Slider marks={{ 0: '0 days', 60: '3 days', 100: '5days' }} step={20} defaultValue={this.data.ballotUpdateData.duration * 20} tooltipVisible={false} onChange={this.sliderChange} />
              </Modal>
                {!this.state.isBallotLoading ? <div><BaseLoader /></div> :
                <div className='contentDiv'>
                  <p className='stateTitle' ref={ref => { this.activeTitle = ref }}>Active</p>
                  {this.data.activeItems}
                  <p className='stateTitle' ref={ref => { this.proposalTitle = ref }}>Proposals</p>
                  {this.data.proposalItems.slice(0, this.state.proposalCount)}
                  {this.data.proposalItems.length > 0
                  ? <div className='moreDiv'>
                    <Button value='large' onClick={(e) => this.onClickReadMore('proposal')}>
                      <span>+</span>
                      <span className='text_btn'>Read More</span>
                    </Button>
                  </div>
                  : null}
                  <p className='stateTitle'ref={ref => { this.finalizedTitle = ref }}>Finalized</p>
                  {this.data.finalizedItems.slice(0, this.state.finalizedCount)}
                  {this.data.finalizedItems.length > 0
                  ? <div className='moreDiv'>
                    <Button value='large' onClick={(e) => this.onClickReadMore('finalized')}>
                      <span>+</span>
                      <span className='text_btn'>Read More</span>
                    </Button>
                  </div>
                  : null}
                </div>}
            </div>
            : <div>
              <ProposalForm
                contracts={this.props.contracts}
                getErrModal={this.props.getErrModal}
                newMemberaddr={this.data.newMemberaddr}
                oldMemberaddr={this.data.oldMemberaddr}
                convertComponent={this.props.convertComponent}
                buttonLoading={this.props.buttonLoading}
                convertButtonLoading={this.props.convertButtonLoading}/>
            </div>
          }
        </div>
      )
    }
}
export { Voting }

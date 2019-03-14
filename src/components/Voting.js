import React from 'react'
import { Button, Progress, Input, Affix, Menu, Modal, Slider, Icon } from 'antd'
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
      finalizedCount: 5,
      visibleProposalItems: [],
      visibleFinalizedItems: []
    }

    constructor (props) {
      super(props)
      this.onClickDetail = this.onClickDetail.bind(this)
      this.onClickVote = this.onClickVote.bind(this)
      this.onClickUpdateProposal = this.onClickUpdateProposal.bind(this)
      this.completeModal = this.completeModal.bind(this)
      this.reloadVoting = this.reloadVoting.bind(this)
      this.searchBallot = this.searchBallot.bind(this)

      this.activeTitle = null;
      this.proposalTitle = null;
      this.finalizedTitle = null;
      this.ballotDestals = new Map();
      this.ballotDurations = new Map();
    }

    async componentDidMount () {
      this.data.ballotCnt = await this.props.contracts.gov.getBallotLength()
      this.props.authorityOriginData.map(item => this.data.authorityNames.set(item.addr, item.title))
      this.getOriginData()
    }

    async reloadVoting(component) {
      if(component) this.props.convertComponent(component)
      this.data.ballotCnt = await this.props.contracts.gov.getBallotLength()
      this.data.ballotBasicOriginData = []
      this.data.newMemberaddr = []
      this.data.oldMemberaddr = []
      await this.getOriginData()
      this.props.convertButtonLoading(false)
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

        if(item.state == '1' || item.state == '2') {
          this.data.newMemberaddr.push(newMemberAddress)
          this.data.oldMemberaddr.push(oldMemberAddress)
        }
        list.push(
          <div className={'ballotDiv state' + item.state} state={item.state}
            key={list.length}
            id={item.id}
            topic={constants.ballotTypesArr[parseInt(item.ballotType)]}
            company={this.data.authorityNames.get(item.creator)}
            creator={item.creator}
            newaddr={newMemberAddress}
            oldaddr={oldMemberAddress}
            ref={ref => this.ballotDestals.set(index, ref)}>
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
                  { item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected
                    ? <Button disabled id='yesVotingBtn' onClick={() => this.onClickVote('Y', item.id, item.endTime, this.state)} >Yes</Button>
                    : <Button id='yesVotingBtn' onClick={() => this.onClickVote('Y', item.id, item.endTime, this.state)}>Yes</Button> }
                  <div className='chart'>
                    <div className='number'>
                      <span>{item.powerOfAccepts === 0 ? '0' : item.powerOfAccepts}%</span>
                      <span>{item.powerOfRejects === 0 ? '0' : item.powerOfRejects}%</span>
                    </div>
                    <Progress percent={item.powerOfAccepts} status='active' showInfo={false} />
                  </div>
                  { item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected
                    ? <Button disabled id='noVotingBtn' onClick={() => this.onClickVote('N', item.id, item.endTime, this.state)} >No</Button>
                    : <Button id='noVotingBtn' onClick={() => this.onClickVote('N', item.id, item.endTime, this.state)}>No</Button> }
                </div>
                <div className='textContent'>
                  {this.setDescription(item.ballotType, newMemberAddress, oldMemberAddress, item.id)}
                  <div className='duration'>
                    { item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected || item.state === constants.ballotState.InProgress
                      ? <div>
                        <div><span>Start : </span><span>{item.startTime}</span></div>
                        <div><span>End : </span><span>{item.endTimeConverted}</span></div>
                      </div> : null }
                    { item.state === constants.ballotState.Ready
                      ? <div>
                        <div><span>duration</span><span className="days" ref={ref => this.ballotDurations.set(item.id, ref)}>{item.duration === 0? 1 : item.duration}days</span></div>
                        <Button type='primary' onClick={() => this.onClickUpdateProposal('change', item.id, index, newMemberAddress, oldMemberAddress)}>Change</Button>
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
                  <Button onClick={() => this.onClickUpdateProposal('revoke', item.id, index, newMemberAddress, oldMemberAddress)}>Revoke</Button>
                </div> : null }
            </div>
          </div>
        )
      })
      this.data.ballotBasicOriginItems = list

      this.getBallotDetailInfo()
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
      this.setState({visibleProposalItems: proposalList, visibleFinalizedList: finalizedList, isBallotLoading: true})
    }

    onClickDetail = (index, e) => {
      this.ballotDestals.get(index).style.height = this.ballotDestals.get(index).style.height === 'auto' ? '124px' : 'auto'
    }

    waitForReceipt = (hash,cb) =>{
      console.log('Start waitForReceipt: ', hash);
      var waitFortxn = this.waitForReceipt.bind(this)
      web3Instance.web3.eth.getTransactionReceipt(hash, function (err, receipt) {
        console.log('getTransactionReceipt: ', receipt);
        if (err) {
           console.log('err: ', err)
        }
        if (receipt  === undefined || receipt === null){
          console.log('Try again in 1 second')
          // Try again in 1 second
          window.setTimeout(function () {
            console.log('timeout...')
            waitFortxn(hash, cb);
          }, 1000);
        } else {
          console.log('receipt : ', receipt)
          // Transaction went through
          if (cb) {
            cb(receipt);
          }
        }
      });
    }

    async onClickVote (e, id, endTime, state) {
      console.log(new Date(endTime * 1000))
      if (!web3Instance.web3) {
        this.props.getErrModal("web3 is not exist", "Voting Error")
        return
      } else if (!this.props.isMember) {
        this.props.getErrModal("You are not member", "Voting Error")
        return
      } else if( state === '2' && new Date(endTime * 1000) < Date.now()) {
        this.props.getErrModal("This Ballot is timeouted", "Voting Error")
        this.reloadVoting(false)
        return
      }

      this.props.convertButtonLoading(true)

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
          this.waitForReceipt(hash, async (receipt)=>{
            console.log("Updated :",receipt);
            if(receipt.status) this.reloadVoting(false)
            else this.props.getErrModal("You don't have voting authority", "Voting Error", receipt.transactionHash)
          });
        }
      })
    }

    async onClickUpdateProposal (e, id, index, newMemberAddress, oldMemberAddress) {
      this.data.curBallotIdx = id
      let trx
      if (e === 'change') {
        this.data.ballotUpdateData.duration = this.ballotDurations.get(this.data.curBallotIdx).innerHTML.replace('days','')
        this.setState({ updateModal: true })
        return
      } else {
        this.props.convertButtonLoading(true)
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
        else{
          console.log("hash:",hash) 
          this.waitForReceipt(hash, (receipt)=>{
            console.log("Updated :",receipt);
            this.props.convertButtonLoading(false)
            if(receipt.status) {
              this.ballotDestals.get(index).style.display = 'none'
              this.data.newMemberaddr = this.data.newMemberaddr.filter(value => value !== newMemberAddress)
              this.data.oldMemberaddr = this.data.oldMemberaddr.filter(value => value !== oldMemberAddress)
            }
            else this.props.getErrModal("You don't have revoke authority", "Revoke Error", receipt.transactionHash)
          });
        }
      })
    }

    onClickSubMenu = (e) => {
      switch (e.key) {
        case 'active': if(this.activeTitle) window.scrollTo(0, this.activeTitle.offsetTop - 70)
          break
        case 'proposal': if(this.proposalTitle) window.scrollTo(0, this.proposalTitle.offsetTop - 70)
          break
        case 'finalized': if(this.finalizedTitle) window.scrollTo(0, this.finalizedTitle.offsetTop - 70)
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
      this.props.convertButtonLoading(true)
      let trx = await this.props.contracts.ballotStorage.updateBallotDuration(this.data.curBallotIdx, util.convertDayToTimestamp(this.data.ballotUpdateData.duration))
      
      // Using updateMemo
      // trx = this.props.contracts.ballotStorage.updateBallotMemo(id, web3Instance.web3.utils.asciiToHex(this.data.ballotUpdateData.memo))
      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        to: trx.to,
        data: trx.data
      }, (err, hash) => {
        if (err) {
          this.props.getErrModal(err.message, err.name)
          this.props.convertButtonLoading(false)
        }
        else {
          this.setState({ isUpdated: true })
          this.waitForReceipt(hash, (receipt)=>{
            console.log("Updated :",receipt);
            this.props.convertButtonLoading(false)
            if(receipt.status) this.ballotDurations.get(this.data.curBallotIdx).innerHTML = this.data.ballotUpdateData.duration + 'days'
            else this.props.getErrModal("You don't have change authority", "Change Error", receipt.transactionHash)
          });
        }
      })
      this.setState({ updateModal: false })
    }

    sliderChange = (value) => {
      this.data.ballotUpdateData.duration = value / 20
      this.setState({ isUpdated: true })
    }

    searchBallot(str) {
      str = str.toLowerCase()
      let proposalItems = this.data.proposalItems.filter(value => {
        return value.props.topic.toLowerCase().indexOf(str) !== -1 || value.props.company.toLowerCase().indexOf(str) !== -1 || value.props.creator.toLowerCase().indexOf(str) !== -1 || value.props.newaddr.toLowerCase().indexOf(str) !== -1 || value.props.oldaddr.toLowerCase().indexOf(str) !== -1
      })
      let finalizedItems = this.data.finalizedItems.filter(value => {
        return value.props.topic.toLowerCase().indexOf(str) !== -1 || value.props.company.toLowerCase().indexOf(str) !== -1 || value.props.creator.toLowerCase().indexOf(str) !== -1 || value.props.newaddr.toLowerCase().indexOf(str) !== -1 || value.props.oldaddr.toLowerCase().indexOf(str) !== -1
      })
      this.setState({visibleProposalItems: proposalItems, visibleFinalizedItems: finalizedItems})
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
                      onSearch = {value => this.searchBallot(value)}
                      enterButton
                    />
                    {!this.props.isMember
                      ? <Button disabled className='apply_proposal_Btn' onClick={e => this.props.convertComponent('proposal')}>
                        <span>+</span>
                        <span className='text_btn'>New Proposal</span>
                      </Button>
                      : <Button className='apply_proposal_Btn' onClick={e => this.props.convertComponent('proposal')} loading={!this.state.isBallotLoading || this.props.buttonLoading}>
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
                <Slider marks={{ 0: '0 days', 60: '3 days', 100: '5days' }} step={20} value={this.data.ballotUpdateData.duration * 20} tooltipVisible={false} onChange={this.sliderChange} />
              </Modal>
                {!this.state.isBallotLoading || this.props.buttonLoading ? <div><BaseLoader/></div> : null}
                <div className='contentDiv'>
                  <p className='stateTitle' ref={ref => { this.activeTitle = ref }}>Active</p>
                  {this.data.activeItems}
                  <p className='stateTitle' ref={ref => { this.proposalTitle = ref }}>Proposals</p>
                  {this.state.visibleProposalItems.slice(0, this.state.proposalCount)}
                  {this.state.visibleProposalItems.length > 0
                  ? <div className='moreDiv'>
                    <Button value='large' onClick={(e) => this.onClickReadMore('proposal')}>
                      <span>+</span>
                      <span className='text_btn'>Read More</span>
                    </Button>
                  </div>
                  : null}
                  <p className='stateTitle'ref={ref => { this.finalizedTitle = ref }}>Finalized</p>
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
                convertButtonLoading={this.props.convertButtonLoading}
                waitForReceipt={this.waitForReceipt}/>
            </div>
          }
        </div>
      )
    }
}
export { Voting }

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
      ballotUpdateData: { duration: 3, memo: 'new memo' },
      activeItems: [],
      proposalItems: [],
      finalizedItems: [],
      ballotCnt: 0
    }
    state = {
      isBallotLoading: false,
      isBallotDetailLoading: false,
      didVoted: false,
      newProposal: false,
      position: 'active'
    }

    constructor (props) {
      super(props)
      this.onClickDetail = this.onClickDetail.bind(this)
      this.onClickVote = this.onClickVote.bind(this)
      this.onClickUpdateProposal = this.onClickUpdateProposal.bind(this)
    }

    async componentWillMount () {
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
      this.data.ballotBasicOriginData.map(item => {
        list.push(
          <div className='ballotDiv' state={item.state} key={list.length} id={item.id}>
            <div className='ballotInfoDiv'>
              <div className='ballotDetailDiv' style={{ width: '15%' }}>
                <h4>Creator</h4><p>METADIUM_EXAM
                </p>
              </div>
              <div className='ballotDetailDiv' style={{ width: '15%' }}>
                <h4>Ballot Type</h4><p>{constants.ballotTypesArr[parseInt(item.ballotType)]}</p>
              </div>
              <div className='ballotDetailDiv'>
                <h4>Proposal Address</h4><p>{item.creator}</p>
              </div>
              <div className='ballotDetailDiv' style={{ width: '10%' }}>
                <h4>State</h4><p>{constants.ballotStateArr[parseInt(item.state)]}</p>
              </div>
              {item.state === constants.ballotState.Ready || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected
                ? <Button type='primary' id='ballotDetailBtn' onClick={this.onClickDetail}>+</Button> : ''}
            </div>
            <div className='voteDiv'>
              <Button id='yesVotingBtn' onClick={() => this.onClickVote('Y', item.id)} >Yes</Button>
              <Button id='noVotingBtn' onClick={() => this.onClickVote('N', item.id)} >No</Button>
              <span>
                <h4 style={{ float: 'left' }}>{item.powerOfAccepts === 0 ? '0' : item.powerOfAccepts}</h4>
                <h4 style={{ float: 'right' }}>{item.powerOfRejects === 0 ? '0' : item.powerOfRejects}</h4>
                <Progress percent={item.powerOfAccept} showInfo={false} />
              </span>
            </div>
            <div className='ballotExplainDiv'>
              { item.state === constants.ballotState.Invalid || item.state === constants.ballotState.Accepted || item.state === constants.ballotState.Rejected
                // InProgress
                ? <div style={{ float: 'right' }}>
                  <p >Started: {item.startTime}</p>
                  <p >Ended: {item.endTime}</p>
                </div> : null}
              { item.state === constants.ballotState.Ready
                ? <div style={{ float: 'right' }}>
                  <p >Duration: {item.duration}days</p>
                  <Button type='primary' onClick={() => this.onClickUpdateProposal('change', item.id)}>Change</Button>
                </div> : null}
              <p>description</p>
              <p>description</p>
              <p>description</p>
              <div>
                <p>{item.memo}</p>
                { item.state === '1'
                  ? <Button onClick={() => this.onClickUpdateProposal('revoke', item.id)} style={{ float: 'right' }} type='primary'>Revoke</Button> : ''}
              </div>
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

    onClickDetail = (e) => {
      console.log('onClickDetailBtn: ', e.target.props, this)
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

    onClickUpdateProposal = (e, id) => {
      switch (e) {
        case 'change':
          let { c_to, c_data } = this.props.contracts.ballotStorage.updateBallotDuration(id, util.convertDayToTimestamp(this.data.ballotUpdateData.duration))
          web3Instance.web3.eth.sendTransaction({
            from: web3Instance.defaultAccount,
            to: c_to,
            data: c_data
          }, (err, hash) => {
            if (err) console.log('err: ', err)
            else console.log('hash: ', hash)
          })
          break
        case 'revoke':
          let { r_to, r_data } = this.props.contracts.ballotStorage.updateBallotMemo(id, web3Instance.web3.utils.asciiToHex(this.data.ballotUpdateData.memo))
          web3Instance.web3.eth.sendTransaction({
            from: web3Instance.defaultAccount,
            to: r_to,
            data: r_data
          }, (err, hash) => {
            if (err) console.log('err: ', err)
            else console.log('hash: ', hash)
          })
          break
      }
    }

    onClickSubMenu = (e) => {
      console.log('position ' , e);
      this.setState({
        position: e.key,
      })
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
                    <Button className='apply_proposal_Btn' onClick={() => this.setState({ newProposal: !this.state.newProposal })}>
                      <span>+</span>
                      <span className="text_btn">New Proposal</span>
                    </Button>
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
                <h1>Active</h1>
                {this.state.isBallotLoading ? this.data.activeItems : <div>empty</div> }<br /><br />

                <h1>Proposals</h1>
                {this.state.isBallotLoading ? this.data.proposalItems : <div>empty</div> }<br /><br />

                <h1>Finalized</h1>
                {this.state.isBallotLoading ? this.data.finalizedItems : <div>empty</div>}<br /><br />
              </div>
            </div>
            : <div>
              <ProposalForm />
            </div>
          }
        </div>
      )
    }
}
export { Voting }

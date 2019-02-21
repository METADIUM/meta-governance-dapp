import React from 'react'
import { Button, Progress, Input } from 'antd'
import './style/style.css'
import { ProposalForm } from './ProposalForm'
import * as util from '../util'
import { web3Instance } from '../ethereum/web3'

const Tx = require('ethereumjs-tx')

class Voting extends React.Component {
    data = {
      ballotBasicOriginData: [],
      ballotMemberOriginData: [],
      ballotBasicOriginItems: [],
      activeItems: [],
      proposalItems: [],
      finalizedItems: [],
      ballotCnt: 0,
    }
    state = {
      isBallotLoading: false,
      isBallotDetailLoading: false,
      didVoted: false,
      // for test
      newProposal: false
    }

    constructor (props) {
      super(props)
      this.onClickDetail = this.onClickDetail.bind(this)
      this.onClickVote = this.onClickVote.bind(this)
      this.onClickAlterProposal = this.onClickAlterProposal.bind(this)
    }

    async componentWillMount () {
      this.data.ballotCnt = await this.props.contracts.gov.getBallotLength()
      this.getBallotOriginItem()
    }

    async getBallotOriginItem () {
      let list = []
      // Use origin data in contract
      if (!this.data.ballotCnt) return;
      for (var i=1; i<=this.data.ballotCnt; i++) {
        await this.props.contracts.ballotStorage.getBallotBasic(i).then(
          ret => {
            ret.id = i  // Add ballot id
            this.data.ballotBasicOriginData = [...this.data.ballotBasicOriginData, util.refineBallotBasic(ret)]
          })
      }
      if(!this.data.ballotBasicOriginData) return
      this.data.ballotBasicOriginData.map(item => {
        list.push(
          <div className='ballotDiv' state={item.state} key={list.length} id = {item.id}>
            <div className='ballotInfoDiv'>
              <div className='ballotDetailDiv' style={{ width: '15%' }}>
                <h4>Creator</h4><p>METADIUM_EXAM
                </p>
              </div>
              <div className='ballotDetailDiv' style={{ width: '15%' }}>
                <h4>Ballot Type</h4><p>{item.ballotType}</p>
              </div>
              <div className='ballotDetailDiv'>
                <h4>Proposal Address</h4><p>{item.creator}</p>
              </div>
              <div className='ballotDetailDiv' style={{ width: '10%' }}>
                <h4>State</h4><p>{item.state}</p>
              </div>
              {item.state === '1' || item.state === '3' || item.state === '4'
                // Ready, Accepted, Rejected
                ? <Button type='primary' id='ballotDetailBtn' onClick={this.onClickDetail}>+</Button> : ''}
            </div>
            <div className='voteDiv'>
            <Button id='yesVotingBtn' onClick={() => this.onClickVote('Y')} >Yes</Button>
              <Button id='noVotingBtn' onClick={() => this.onClickVote('N')} >No</Button>
              <span>
                <h4 style={{ float: 'left' }}>{item.powerOfAccepts === 0 ? '0' : item.powerOfAccepts}</h4>
                <h4 style={{ float: 'right' }}>{item.powerOfRejects === 0 ? '0' : item.powerOfRejects}</h4>
                <Progress percent={item.powerOfAccept} showInfo={false} />
              </span>
            </div>
            <div className='ballotExplainDiv'>
              { item.state === '2' || item.state === '3' || item.state === '4'
                //InProgress
                ? <div style={{ float: 'right' }}>
                  <p >Started: {item.startTime}</p>
                  <p >Ended: {item.endTime}</p>
                </div> : null}
              { item.state === '1'
                ? <div style={{ float: 'right' }}>
                  <p >Duration: {item.duration}days</p>
                  <Button type='primary' onClick={() => this.onClickAlterProposal('change', item.id)}>Change</Button>
                </div> : null}
              <p>description</p>
              <p>description</p>
              <p>description</p>
              <div>
                <p>{item.memo}</p>
                { item.state === '1'
                  ? <Button onClick={() => this.onClickAlterProposal('revoke',item.id)} style={{ float: 'right' }} type='primary'>Revoke</Button> : ''}
              </div>
            </div>
          </div>
        )
      })
      console.log('data: ', this.data.ballotBasicOriginData)
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

    onClickVote = (e) => {
      // if (!web3) return

      // let tx_builder = this.props.contracts.govImp.govImpInstance.methods.vote(1,true)
      // let encoded_tx = tx_builder.encodeABI()
      // let rawTrx;
      // var trxObj = {
      //   //gas: web3.utils.toHex(3000000),
      //   gasPrice: web3.utils.toWei('18', 'gwei'),
      //   nonce: 0,
      //   data: encoded_tx,
      //   from: '0x961c20596e7EC441723FBb168461f4B51371D8aA',
      //   to: '0xeab80609b96cee89c48d384672f11616ffa50ffb'
      // }

      // web3.eth.sendTransaction(trxObj, (err, hash) => {
      //   if(err) console.log('err: ', err)
      //   else console.log('hash: ', hash)
      // });

      // switch (e) {
      //   case 'N':
      //     break
      //   case 'Y':
      //     break
      // }
      // this.setState({ didVoted: true })
    }

    onClickAlterProposal = (e, id) => {
      console.log(e, id)
      switch (e) {
        case 'change':
          let { to, data } = this.props.contracts.ballotStorage.updateBallotDuration(id, 86400)
          web3Instance.web3.eth.sendTransaction({
            from: web3Instance.defaultAccount,
            to: to,
            data: data
          },(err, hash) => {
              if(err) console.log('err: ', err)
              else console.log('hash: ', hash)
            });
          break
        case 'revoke':
        break
      }
    }

    render () {
      return (
        <div>
          {!this.state.newProposal
            ? <div className='contentDiv'>
              <div>
                <Input.Search
                  placeholder='Search by Type, Proposal, Keywords'
                  enterButton
                  style={{ width: '70%', margin: '1% 0 1% 1.5%' }}
                />
                <Button className='apply_proposal_Btn' onClick={() => this.setState({ newProposal: !this.state.newProposal })}>New Proposal</Button>
              </div>

              <h1>Active</h1>
              {this.state.isBallotLoading
                ? this.data.activeItems
                : <div>empty</div>
              }<br /><br />

              <h1>Proposals</h1>
              {this.state.isBallotLoading
                ? this.data.proposalItems
                : <div>empty</div>
              }<br /><br />

              <h1>Finalized</h1>
              {this.state.isBallotLoading
                ? this.data.finalizedItems
                : <div>empty</div>
              }<br /><br />
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

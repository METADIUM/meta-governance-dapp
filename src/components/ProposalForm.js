import React from 'react'
import { Button, Select, Input, Form, Icon } from 'antd'
import './style/style.css'
import { Voting } from './Voting'
import { web3Instance } from '../ethereum/web3'
import * as util from '../util'
// import { validNumber, validAddress, validLength } from '../util'
const { TextArea } = Input

class ProposalForm extends React.Component {
    data = {
      selectedVoteTopic: '',
      formData: {}
    }
    state = {
      isBack: false,
      selectedChange: false,
      submitForm: false,
      newLockAmountErr: false,
      newAddrErr: false,
      newNodeErr: false,
      oldAdderr: false,
      oldNodeErr: false
    }

    onSelectChange = async (value) => {
      this.data.selectedVoteTopic = value
      // Reset form data
      this.data.formData = {}
      this.setState({ selectedChange: true })
    }

    /* Type casting and save form data. */
    handleChange = (e) => {
      this.data.formData[e.target.name] = e.target.value

      switch(e.target.name) {
        case 'newLockAmount': this.setState({newLockAmountErr: !this.checkLockAmount(e.target.value)}); break
        case 'newAddr': this.setState({newAddrErr: !this.checkAddr(e.target.value)}); break
        case 'newNode': this.setState({newNodeErr: !this.checkNode(e.target.value)}); break
        case 'oldAddr': this.setState({oldAddrErr: !this.checkAddr(e.target.value)}); break
        case 'oldNode': this.setState({oldNodeErr: !this.checkNode(e.target.value)}); break
      }
    }

    checkLockAmount = (amount) => {
      const STAKING_MAX = 10
      const STAKING_MIN = 2

      return (/^[1-9]\d*$/.test(amount) && Number(amount) < STAKING_MAX && Number(amount) > STAKING_MIN )
    }

    checkAddr = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr)

    checkNode = (node) => /^[a-fA-F0-9]+@(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])+:([0-9]{5})+(\?discport=([0-9]{5}))$/.test(node)

    /* Submit form data. */
    handleSubmit = async (e) => {
      e.preventDefault()
      let trx = {}
      let isMember = await this.props.contracts.gov.isMember(web3Instance.defaultAccount)
      //check memeber
      if (!isMember) {
        this.props.getErrModal('You are not member', 'Proposal Submit Error')
        return
      }
      util.refineSubmitData(this.data.formData)

      //check new member staking error & aleardy member error & aleardy proposal exist error
      let newMemberBalance = Number(await this.props.contracts.staking.balanceOf(this.data.formData.newAddr))
      let newLockedAmount = Number(this.data.formData.newLockAmount)
      if (newMemberBalance < newLockedAmount) {
        this.props.getErrModal('Not Enough META Stake (New)', 'Proposal Submit Error')
        return
      } else if(await this.props.contracts.gov.isMember(this.data.formData.newAddr)) {
        this.props.getErrModal('Existing Member Address (New)', 'Proposal Submit Error')
        return
      } else if(this.props.newMemberaddr.some((item) => item === this.data.formData.newAddr)) {
        this.props.getErrModal('Address with existing ballot (New)', 'Proposal Submit Error')
        return
      }

      if (this.data.selectedVoteTopic === 'add') {
        trx = this.props.contracts.govImp.addProposalToAddMember(
          this.data.formData.addr,
          this.data.formData.node.node,
          this.data.formData.node.ip,
          this.data.formData.node.port,
          this.data.formData.lockAmount,
          this.data.formData.memo
        )
      } else {
        let oldMemberBalance = Number(await this.props.contracts.staking.lockedBalanceOf(this.data.formData.oldAddr))
        if(oldMemberBalance !== newLockedAmount) {
          this.props.getErrModal('Invalid Replace META Amount', 'Proposal Submit Error')
          return
        } else if(!await this.props.contracts.gov.isMember(this.data.formData.oldAddr)) {
          this.props.getErrModal('Non-existing Member Address (Old)', 'Proposal Submit Error')
          return
        } else if(this.props.oldMemberaddr.some((item) => item === this.data.formData.newAddr)) {
          this.props.getErrModal('Address with existing ballot (Old)', 'Proposal Submit Error')
          return
        }

        trx = this.props.contracts.govImp.addProposalToChangeMember(
          this.data.formData.oldAddr,
          this.data.formData.newAddr,
          this.data.formData.newNode.node,
          this.data.formData.newNode.ip,
          this.data.formData.newNode.port,
          this.data.formData.newLockAmount,
          this.data.formData.memo
        )
      }
      console.log(this.data.formData)

      web3Instance.web3.eth.sendTransaction({
        from: web3Instance.defaultAccount,
        to: trx.to,
        data: trx.data
      }, (err, hash) => {
        if (err) console.log('err: ', err)
        else console.log('hash: ', hash)
      })
    }

    getAddProposalForm () {
      return (<div className='proposalBody'>
        <Form onSubmit={this.handleSubmit}>
          <p className='subtitle'>META Amount to be locked <span className='required'>*</span></p>
          <Form.Item>
            <Input type="number" addonAfter='META' name='newLockAmount' onChange={this.handleChange} className={this.state.newLockAmountErr ? 'errInput' : ''}/>
            <p className={this.state.newLockAmountErr ? 'errHint' : ''}>Invalid Amount</p>
          </Form.Item>
          <p className='subtitle'>New Authority Address <span className='required'>*</span></p>
          <Form.Item>
            <Input name='newAddr' onChange={this.handleChange} className={this.state.newAddrErr ? 'errInput' : ''}/>
            <p className={this.state.newAddrErr ? 'errHint' : ''}>Invalid Address</p>
          </Form.Item>
          <p className='subtitle'>New Authority Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input type='primary' name='newNode' onChange={this.handleChange} className={this.state.newNodeErr ? 'errInput' : ''}/>
            <p className={this.state.newNodeErr ? 'errHint' : ''}>Invalid Node</p>
          </Form.Item>
          <p className='subtitle'>Description</p>
          <Form.Item>
            <TextArea
              rows={4}
              placeholder='Max. 256 bytes'
              autosize={{ minRows: 4, maxRows: 4 }}
              name='memo'
              onChange={this.handleChange}
            />
          </Form.Item>
          <Form.Item>
            <div className='submitDiv'>
              <Button className='submit_Btn' htmlType='submit' disabled={this.state.newLockAmountErr || this.state.newAddrErr || this.state.newNodeErr}>Submit </Button>
            </div>
          </Form.Item>
        </Form>
      </div>)
    }

    getReplaceProposalForm () {
      return (<div className='proposalBody'>
        <Form onSubmit={this.handleSubmit}>
          <p className='subtitle'>Replace META Amount <span className='required'>*</span></p>
          <Form.Item>
            <Input type='number' addonAfter='META' name='newLockAmount' onChange={this.handleChange} className={this.state.newLockAmountErr ? 'errInput' : ''} />
            <p className={this.state.newLockAmountErr ? 'errHint' : ''}>Invalid Amount</p>
          </Form.Item>
          <p className='subtitle'>New Authority Address <span className='required'>*</span></p>
          <Form.Item>
            <Input name='newAddr' onChange={this.handleChange} className={this.state.newAddrErr ? 'errInput' : ''}/>
            <p className={this.state.newAddrErr ? 'errHint' : ''}>Invalid Address</p>
          </Form.Item>
          <p className='subtitle'>New Authority Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input name='newNode' onChange={this.handleChange} className={this.state.newNodeErr ? 'errInput' : ''}/>
            <p className={this.state.newNodeErr ? 'errHint' : ''}>Invalid Node</p>
          </Form.Item>
          <p className='subtitle'>Old Authority Address <span className='required'>*</span></p>
          <Form.Item>
            <Input name='oldAddr' onChange={this.handleChange} className={this.state.oldAddrErr ? 'errInput' : ''}/>
            <p className={this.state.oldAddrErr ? 'errHint' : ''}>Invalid Address</p>
          </Form.Item>
          <p className='subtitle'>Old Authority Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input name='oldNode' onChange={this.handleChange} className={this.state.oldNodeErr ? 'errInput' : ''}/>
            <p className={this.state.oldNodeErr ? 'errHint' : ''}>Invalid Node</p>
          </Form.Item>
          <p className='subtitle'>Description </p>
          <Form.Item>
            <TextArea
              rows={4}
              placeholder='Max. 256 bytes'
              autosize={{ minRows: 4, maxRows: 4 }}
              name='memo'
              onChange={this.handleChange}
            />
          </Form.Item>
          <Form.Item>
            <div className='submitDiv'>
              <Button className='submit_Btn' htmlType='submit' disabled={this.state.newLockAmountErr || this.state.newAddrErr || this.state.newNodeErr || this.state.oldAdderr || this.state.oldNodeErr}>Submit </Button>
            </div>
          </Form.Item>
        </Form>
      </div>)
    }

    render () {
      return (
        <div>
          {!this.state.isBack
            ? <div className='contentDiv'>
              <div className='backBtnDiv'>
                <Button onClick={() => { this.setState({ isBack: !this.state.isBack }) }}>
                  <span><Icon type='left' /></span>
                  <span className='text_btn'>Back to Voting</span>
                </Button>
              </div>
              <div className='contentVotingDiv'>
                <div className='proposalHead'>
                  <div className='title'>
                    <p>New Proposal</p>
                    <p>* Mandatory</p>
                  </div>
                  <p className='subtitle'>Topic for voting <span className='required'>*</span></p>
                  <Select
                    showArrow
                    onChange={this.onSelectChange}
                  >
                    <Select.Option value='add'>Add Authority</Select.Option>
                    <Select.Option value='replace'>Replace Authority</Select.Option>
                  </Select>
                </div>
                { this.data.selectedVoteTopic !== ''
                  ? <div>
                    { this.data.selectedVoteTopic === 'add' ? this.getAddProposalForm() : this.getReplaceProposalForm() }
                  </div> : ''
                }
              </div>
            </div>
            : <div>
              <Voting contracts={this.props.contracts} />
            </div>
          }
        </div>
      )
    }
}

ProposalForm = Form.create()(ProposalForm)
export { ProposalForm }

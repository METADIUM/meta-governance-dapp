import React from 'react'
import { Button, Select, Input, Form, Icon } from 'antd'
import './style/style.css'
import { Voting } from './Voting'
import { web3Instance } from '../ethereum/web3'
import { constants } from '../ethereum/constants'
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
      return (/^[1-9]\d*$/.test(amount) && Number(amount) < constants.limitAmount.stakingMax && Number(amount) > constants.limitAmount.stakingMin )
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
      let formData = util.refineSubmitData(this.data.formData)

      if(this.data.selectedVoteTopic === 'update') {
        trx = this.props.contracts.govImp.addProposalToChangeMember(
          web3Instance.defaultAccount,
          web3Instance.defaultAccount,
          formData.newNode.node,
          formData.newNode.ip,
          formData.newNode.port,
          await this.props.contracts.staking.lockedBalanceOf(web3Instance.defaultAccount),
          formData.memo
        )

        this.props.getErrModal('This function is not yet available', 'Proposal Submit Error')
        return
      } else {
        //check new member staking error & aleardy member error & aleardy proposal exist error
        let newMemberBalance = Number(await this.props.contracts.staking.balanceOf(formData.newAddr))
        let newLockedAmount = Number(formData.newLockAmount)
        if (newMemberBalance < newLockedAmount) {
          this.props.getErrModal('Not Enough META Stake (New)', 'Proposal Submit Error')
          return
        } else if(await this.props.contracts.gov.isMember(formData.newAddr)) {
          this.props.getErrModal('Existing Member Address (New)', 'Proposal Submit Error')
          return
        } else if(this.props.newMemberaddr.some((item) => item === formData.newAddr)) {
          this.props.getErrModal('Address with existing ballot (New)', 'Proposal Submit Error')
          return
        }

        if (this.data.selectedVoteTopic === 'add') {
          trx = this.props.contracts.govImp.addProposalToAddMember(
            formData.newAddr,
            formData.newNode.node,
            formData.newNode.ip,
            formData.newNode.port,
            formData.newLockAmount,
            formData.memo
          )
        } else if(this.data.selectedVoteTopic === 'replace') {
          let oldMemberBalance = Number(await this.props.contracts.staking.lockedBalanceOf(formData.oldAddr))
          if(oldMemberBalance !== newLockedAmount) {
            this.props.getErrModal('Invalid Replace META Amount', 'Proposal Submit Error')
            return
          } else if(!await this.props.contracts.gov.isMember(formData.oldAddr)) {
            this.props.getErrModal('Non-existing Member Address (Old)', 'Proposal Submit Error')
            return
          } else if(this.props.oldMemberaddr.some((item) => item === formData.newAddr)) {
            this.props.getErrModal('Address with existing ballot (Old)', 'Proposal Submit Error')
            return
          }

          trx = this.props.contracts.govImp.addProposalToChangeMember(
            formData.oldAddr,
            formData.newAddr,
            formData.newNode.node,
            formData.newNode.ip,
            formData.newNode.port,
            formData.newLockAmount,
            formData.memo
          )
        }
      }
      console.log(formData)

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

    getUpdateProposalForm () {
      return (<div className='proposalBody'>
        <Form onSubmit={this.handleSubmit}>
          <p className='subtitle'>New Node Name <span className='required'>*</span></p>
          <Form.Item>
            <Input name='newName' onChange={this.handleChange}/>
          </Form.Item>
          <p className='subtitle'>New Node Description <span className='required'>*</span></p>
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
              <Button className='submit_Btn' htmlType='submit' disabled={this.state.newNodeErr}>Submit </Button>
            </div>
          </Form.Item>
        </Form>
      </div>)
    }

    getProposalForm() {
      switch(this.data.selectedVoteTopic) {
        case 'add': return this.getAddProposalForm()
        case 'replace': return this.getReplaceProposalForm()
        case 'update': return this.getUpdateProposalForm()
      }
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
                    onChange={this.onSelectChange}>
                    <Select.Option value='add'>Add Authority</Select.Option>
                    <Select.Option value='replace'>Replace Authority</Select.Option>
                    <Select.Option value='update'>Update Authority</Select.Option>
                  </Select>
                </div>
                { this.data.selectedVoteTopic !== ''
                  ? <div>
                    {this.getProposalForm()}
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

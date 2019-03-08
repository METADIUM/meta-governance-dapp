import React from 'react'
import { Button, Select, Input, Form, Icon } from 'antd'
import './style/style.css'
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
      selectedChange: false,
      submitForm: false,
      newLockAmountErr: false,
      newAddrErr: false,
      newNodeErr: false,
      oldLockAmountErr: false,
      oldAddrErr: false,
      oldNodeErr: false
    }

    onSelectChange = async (value) => {
      this.data.selectedVoteTopic = value
      // Reset form data
      this.data.formData = {newLockAmount: constants.limitAmount.stakingMin, oldLockAmount: constants.limitAmount.stakingMin}
      await this.setState({ 
        newLockAmountErr: false,
        newAddrErr: false,
        newNodeErr: false,
        oldLockAmountErr: false,
        oldAddrErr: false,
        oldNodeErr: false})
      this.resetForm()
    }

    resetForm() {
      if(window.document.forms[0]) {
        Object.keys(window.document.forms[0].elements).forEach(key => {
          switch(window.document.forms[0].elements[key].name) {
            case 'newLockAmount':
            case 'oldLockAmount': window.document.forms[0].elements[key].value = constants.limitAmount.stakingMin; break
            default: window.document.forms[0].elements[key].value = ''
          }
        })
      }
    }

    /* Type casting and save form data. */
    handleChange = (e) => {
      this.data.formData[e.target.name] = e.target.value

      switch(e.target.name) {
        case 'newLockAmount': this.setState({newLockAmountErr: !this.checkLockAmount(e.target.value)}); break
        case 'newAddr': this.setState({newAddrErr: !this.checkAddr(e.target.value)}); break
        case 'newNode': this.setState({newNodeErr: !this.checkNode(e.target.value)}); break
        case 'oldLockAmount': this.setState({oldLockAmountErr: !this.checkLockAmount(e.target.value)}); break
        case 'oldAddr': this.setState({oldAddrErr: !this.checkAddr(e.target.value)}); break
        case 'oldNode': this.setState({oldNodeErr: !this.checkNode(e.target.value)}); break
      }
    }

    checkLockAmount = (amount) => {
      return (/^[1-9]\d*$/.test(amount) && Number(amount) <= constants.limitAmount.stakingMax && Number(amount) >= constants.limitAmount.stakingMin )
    }

    checkAddr = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr)

    checkNode = (node) => /^[a-fA-F0-9]+@(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])+:([0-9]{5})$/.test(node)

    /* Submit form data. */
    handleSubmit = async (e) => {
      this.props.convertButtonLoading(true)
      try {
        e.preventDefault()
        let trx = {}
        let formData = util.refineSubmitData(this.data.formData)
        if(await this.handleProposalError(formData)) {
          this.props.convertButtonLoading(false)
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
          trx = this.props.contracts.govImp.addProposalToChangeMember(
            formData.oldAddr,
            formData.newAddr,
            formData.newNode.node,
            formData.newNode.ip,
            formData.newNode.port,
            formData.newLockAmount,
            formData.memo
          )
        } else if(this.data.selectedVoteTopic === 'remove') {
          trx = this.props.contracts.govImp.addProposalToRemoveMember(
            formData.oldAddr,
            formData.oldLockAmount,
            formData.memo
          )
        } else if(this.data.selectedVoteTopic === 'update') {
          trx = this.props.contracts.govImp.addProposalToChangeMember(
            web3Instance.defaultAccount,
            web3Instance.defaultAccount,
            formData.newNode.node,
            formData.newNode.ip,
            formData.newNode.port,
            await this.props.contracts.staking.lockedBalanceOf(web3Instance.defaultAccount),
            formData.memo
          )
        } else return

        web3Instance.web3.eth.sendTransaction({
          from: web3Instance.defaultAccount,
          to: trx.to,
          data: trx.data
        }, (err, hash) => {
          if (err) {
            this.props.getErrModal(err.message, 'Proposal Submit Error')
            this.props.convertButtonLoading(false)
            return
          }
          else console.log('hash: ', hash)
        })
      } catch(err) {
        console.log(err)
        this.props.getErrModal(err.message, err.name)
        this.props.convertButtonLoading(false)
        return
      }
    }

    async handleProposalError(formData) {
      if (!await this.props.contracts.gov.isMember(web3Instance.defaultAccount)) {
        this.props.getErrModal('You are not member', 'Proposal Submit Error')
        return true
      }

      if(this.data.selectedVoteTopic === 'add') {
        const newMemberBalance = Number(await this.props.contracts.staking.availableBalanceOf(formData.newAddr))
        const newLockedAmount = Number(formData.newLockAmount)

        if(await this.props.contracts.gov.isMember(formData.newAddr)) {
          this.props.getErrModal('Existing Member Address (New)', 'Proposal Submit Error')
          return true
        } else if(this.props.newMemberaddr.some((item) => item === formData.newAddr)) {
          this.props.getErrModal('Address with existing ballot (New)', 'Proposal Submit Error')
          return true
        } else if (newMemberBalance < newLockedAmount) {
          this.props.getErrModal('Not Enough META Stake (New)', 'Proposal Submit Error')
          return true
        }
      } else if(this.data.selectedVoteTopic === 'replace') {
        const oldMemberLockedBalance = Number(await this.props.contracts.staking.lockedBalanceOf(formData.oldAddr))
        const newMemberBalance = Number(await this.props.contracts.staking.availableBalanceOf(formData.newAddr))
        const newLockedAmount = Number(formData.newLockAmount)

        if(await this.props.contracts.gov.isMember(formData.newAddr)) {
          this.props.getErrModal('Existing Member Address (New)', 'Proposal Submit Error')
          return true
        } else if(!await this.props.contracts.gov.isMember(formData.oldAddr)) {
          this.props.getErrModal('Non-existing Member Address (Old)', 'Proposal Submit Error')
          return true
        } else if(this.props.newMemberaddr.some((item) => item === formData.newAddr)) {
          this.props.getErrModal('Address with existing ballot (New)', 'Proposal Submit Error')
          return true
        } else if(this.props.oldMemberaddr.some((item) => item === formData.oldAddr)) {
          this.props.getErrModal('Address with existing ballot (Old)', 'Proposal Submit Error')
          return true
        } else if(oldMemberLockedBalance !== newLockedAmount) {
          this.props.getErrModal('Invalid Replace META Amount', 'Proposal Submit Error')
          return true
        } else if (newMemberBalance < newLockedAmount) {
          this.props.getErrModal('Not Enough META Stake (New)', 'Proposal Submit Error')
          return true
        }
      } else if(this.data.selectedVoteTopic === 'remove') {
        const oldMemberBalance = Number(await this.props.contracts.staking.lockedBalanceOf(formData.oldAddr))
        const oldLockedAmount = Number(formData.oldLockAmount)

        if(!await this.props.contracts.gov.isMember(formData.oldAddr)) {
          this.props.getErrModal('Non-existing Member Address (Old)', 'Proposal Submit Error')
          return true
        } else if(this.props.oldMemberaddr.some((item) => item === formData.oldAddr)) {
          this.props.getErrModal('Address with existing ballot (Old)', 'Proposal Submit Error')
          return true
        } else if(oldMemberBalance < oldLockedAmount) {
          this.props.getErrModal('Invalid META Unlock Amount', 'Proposal Submit Error')
          return true
        }
      }
      return false;
    }

    getAddProposalForm () {
      return (<div className='proposalBody'>
        <Form onSubmit={this.handleSubmit}>
          <p className='subtitle'>New Authority Address <span className='required'>*</span></p>
          <Form.Item>
            <Input name='newAddr' onChange={this.handleChange} className={this.state.newAddrErr ? 'errInput' : ''} disabled={this.props.buttonLoading}/>
            <p className={this.state.newAddrErr ? 'errHint' : ''}>Invalid Address</p>
          </Form.Item>
          <div className="divider">
            <div>
              <p className='subtitle'>Node Name <span className='required'>*</span></p>
              <Form.Item>
                <Input name='newName' onChange={this.handleChange} disabled={this.props.buttonLoading}/>
              </Form.Item>
            </div>
            <div>
              <p className='subtitle'>META Amount to be locked <span className='required'>*</span></p>
              <Form.Item>
                <Input type="number" addonAfter='META' name='newLockAmount' defaultValue={constants.limitAmount.stakingMin} onChange={this.handleChange} className={this.state.newLockAmountErr ? 'errInput' : ''} disabled={this.props.buttonLoading}/>
                <p className={this.state.newLockAmountErr ? 'errHint' : ''}>Invalid Amount</p>
              </Form.Item>
            </div>
          </div>
          <p className='subtitle'>New Authority Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input name='newNode' onChange={this.handleChange} className={this.state.newNodeErr ? 'errInput' : ''} disabled={this.props.buttonLoading}/>
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
              disabled={this.props.buttonLoading}
            />
          </Form.Item>
          <Form.Item>
            <div className='submitDiv'>
              <Button name='submit' className='submit_Btn' htmlType='submit' disabled={this.state.newLockAmountErr || this.state.newAddrErr || this.state.newNodeErr} loading={this.props.buttonLoading}>Submit</Button>
            </div>
          </Form.Item>
        </Form>
      </div>)
    }

    getReplaceProposalForm () {
      return (<div className='proposalBody'>
        <Form onSubmit={this.handleSubmit}>
          <p className='subtitle'>Old Authority Address <span className='required'>*</span></p>
          <Form.Item>
            <Input name='oldAddr' onChange={this.handleChange} className={this.state.oldAddrErr ? 'errInput' : ''} disabled={this.props.buttonLoading}/>
            <p className={this.state.oldAddrErr ? 'errHint' : ''}>Invalid Address</p>
          </Form.Item>
          <p className='subtitle'>New Authority Address <span className='required'>*</span></p>
          <Form.Item>
            <Input name='newAddr' onChange={this.handleChange} className={this.state.newAddrErr ? 'errInput' : ''} disabled={this.props.buttonLoading}/>
            <p className={this.state.newAddrErr ? 'errHint' : ''}>Invalid Address</p>
          </Form.Item>
          <div className="divider">
            <div>
              <p className='subtitle'>Node Name <span className='required'>*</span></p>
              <Form.Item>
                <Input name='newName' onChange={this.handleChange} disabled={this.props.buttonLoading}/>
              </Form.Item>
            </div>
            <div>
              <p className='subtitle'>Replace META Amount <span className='required'>*</span></p>
              <Form.Item>
                <Input type='number' addonAfter='META' name='newLockAmount' defaultValue={constants.limitAmount.stakingMin} onChange={this.handleChange} className={this.state.newLockAmountErr ? 'errInput' : ''} disabled={this.props.buttonLoading}/>
                <p className={this.state.newLockAmountErr ? 'errHint' : ''}>Invalid Amount</p>
              </Form.Item>
            </div>
          </div>
          <p className='subtitle'>New Authority Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input name='newNode' onChange={this.handleChange} className={this.state.newNodeErr ? 'errInput' : ''} disabled={this.props.buttonLoading}/>
            <p className={this.state.newNodeErr ? 'errHint' : ''}>Invalid Node</p>
          </Form.Item>
          <p className='subtitle'>Old Authority Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input name='oldNode' onChange={this.handleChange} className={this.state.oldNodeErr ? 'errInput' : ''} disabled={this.props.buttonLoading}/>
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
              disabled={this.props.buttonLoading}
            />
          </Form.Item>
          <Form.Item>
            <div className='submitDiv'>
              <Button className='submit_Btn' htmlType='submit' disabled={this.state.newLockAmountErr || this.state.newAddrErr || this.state.newNodeErr || this.state.oldAddrErr || this.state.oldNodeErr}  loading={this.props.buttonLoading}>Submit</Button>
            </div>
          </Form.Item>
        </Form>
      </div>)
    }

    getRmoveProposalForm () {
      return (<div className='proposalBody'>
        <Form onSubmit={this.handleSubmit}>
          <p className='subtitle'>META Amount to be locked <span className='required'>*</span></p>
          <Form.Item>
            <Input type="number" addonAfter='META' name='oldLockAmount' defaultValue={constants.limitAmount.stakingMin} onChange={this.handleChange} className={this.state.oldLockAmountErr ? 'errInput' : ''} disabled={this.props.buttonLoading}/>
            <p className={this.state.oldLockAmountErr ? 'errHint' : ''}>Invalid Amount</p>
          </Form.Item>
          <p className='subtitle'>Address to be removed <span className='required'>*</span></p>
          <Form.Item>
            <Input name='oldAddr' onChange={this.handleChange} className={this.state.oldAddrErr ? 'errInput' : ''} disabled={this.props.buttonLoading}/>
            <p className={this.state.oldAddrErr ? 'errHint' : ''}>Invalid Address</p>
          </Form.Item>
          <p className='subtitle'>Description</p>
          <Form.Item>
            <TextArea
              rows={4}
              placeholder='Max. 256 bytes'
              autosize={{ minRows: 4, maxRows: 4 }}
              name='memo'
              onChange={this.handleChange}
              disabled={this.props.buttonLoading}
            />
          </Form.Item>
          <Form.Item>
            <div className='submitDiv'>
              <Button className='submit_Btn' htmlType='submit' disabled={this.state.oldLockAmountErr || this.state.oldAddrErr} loading={this.props.buttonLoading}>Submit</Button>
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
            <Input name='newName' onChange={this.handleChange} disabled={this.props.buttonLoading}/>
          </Form.Item>
          <p className='subtitle'>New Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input type='primary' name='newNode' onChange={this.handleChange} className={this.state.newNodeErr ? 'errInput' : ''} disabled={this.props.buttonLoading}/>
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
              disabled={this.props.buttonLoading}
            />
          </Form.Item>
          <Form.Item>
            <div className='submitDiv'>
              <Button className='submit_Btn' htmlType='submit' disabled={this.state.newNodeErr} loading={this.props.buttonLoading}>Submit </Button>
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
        case 'remove': return this.getRmoveProposalForm()
      }
    }

    render () {
      return (
        <div>
          <div className='contentDiv'>
            <div className='backBtnDiv'>
              <Button onClick={e => this.props.convertComponent('voting')}>
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
                  <Select.Option value='remove'>Remove Authority</Select.Option>
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
        </div>
      )
    }
}

ProposalForm = Form.create()(ProposalForm)
export { ProposalForm }

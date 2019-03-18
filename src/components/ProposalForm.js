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
      newNameErr: false,
      oldLockAmountErr: false,
      oldAddrErr: false,
      oldNodeErr: false,
      showLockAmount: ''
    }

    onSelectChange = async (value) => {
      this.data.selectedVoteTopic = value
      // Reset form data
      this.data.formData = { newLockAmount: constants.limitAmount.stakingMin, oldLockAmount: constants.limitAmount.stakingMin }
      await this.setState({
        newLockAmountErr: false,
        newAddrErr: false,
        newNodeErr: false,
        newNameErr: false,
        oldLockAmountErr: false,
        oldAddrErr: false,
        oldNodeErr: false })
      this.resetForm()
    }

    resetForm () {
      if (window.document.forms[0]) {
        Object.keys(window.document.forms[0].elements).forEach(key => {
          switch (window.document.forms[0].elements[key].name) {
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

      switch (e.target.name) {
        case 'newLockAmount': this.setState({ newLockAmountErr: !this.checkLockAmount(e.target.value) }); break
        case 'newAddr': this.setState({ newAddrErr: !this.checkAddr(e.target.value) }); break
        case 'newNode': this.setState({ newNodeErr: !this.checkNode(e.target.value) }); break
        case 'newName': this.setState({ newNameErr: !this.checkName(e.target.value) }); break
        case 'oldLockAmount': this.setState({ oldLockAmountErr: !this.checkUnlockAmount(e.target.value) }); break
        case 'oldAddr': this.setState({ oldAddrErr: !this.checkAddr(e.target.value) }); break
        case 'oldNode': this.setState({ oldNodeErr: !this.checkNode(e.target.value) }); break
      }
    }

    checkLockAmount = (amount) => {
      return (/^[1-9]\d*$/.test(amount) && Number(amount) <= this.props.stakingMax && Number(amount) >= this.props.stakingMin)
    }

    checkUnlockAmount = (amount) => /^[1-9]\d*$/.test(amount)

    checkAddr = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr)

    checkNode = (node) => /^([a-fA-F0-9]{128})+@(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])+:([0-9]{5})$/.test(node)

    checkName = (name) => /^[A-Za-z0-9+]{64}$/.test(name)

    /* Submit form data. */
    handleSubmit = async (e) => {
      this.props.convertButtonLoading(true)
      try {
        e.preventDefault()
        let trx = {}
        let formData = util.refineSubmitData(this.data.formData)
        if (await this.handleProposalError(formData)) {
          this.props.convertButtonLoading(false)
          return
        }
        if (this.data.selectedVoteTopic === 'add') {
          trx = this.props.contracts.govImp.addProposalToAddMember(
            formData.newAddr,
            formData.newName,
            formData.newNode.node,
            formData.newNode.ip,
            [formData.newNode.port, formData.newLockAmount],
            formData.memo
          )
        } else if (this.data.selectedVoteTopic === 'replace') {
          trx = this.props.contracts.govImp.addProposalToChangeMember(
            [formData.oldAddr, formData.newAddr],
            formData.newName,
            formData.newNode.node,
            formData.newNode.ip,
            [formData.newNode.port, formData.newLockAmount],
            formData.memo
          )
        } else if (this.data.selectedVoteTopic === 'remove') {
          trx = this.props.contracts.govImp.addProposalToRemoveMember(
            formData.oldAddr,
            formData.oldLockAmount,
            formData.memo
          )
        } else if (this.data.selectedVoteTopic === 'update') {
          let myLockBalance = await this.props.contracts.staking.lockedBalanceOf(web3Instance.defaultAccount)
          trx = this.props.contracts.govImp.addProposalToChangeMember(
            [web3Instance.defaultAccount, web3Instance.defaultAccount],
            formData.newNode.node,
            formData.newNode.ip,
            [formData.newNode.port, myLockBalance],
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
          } else {
            console.log('hash:', hash)
            this.props.waitForReceipt(hash, async (receipt) => {
              console.log('Updated :', receipt)
              if (receipt.status) {
                await this.props.convertComponent('voting')
              } else this.props.getErrModal("You don't have proposal submit authority", 'Proposal Submit Error', receipt.transactionHash)
            })
          }
        })
      } catch (err) {
        console.log(err)
        this.props.getErrModal(err.message, err.name)
        this.props.convertButtonLoading(false)
      }
    }

    async handleProposalError (formData) {
      if (!await this.props.contracts.gov.isMember(web3Instance.defaultAccount)) {
        this.props.getErrModal('You are not member', 'Proposal Submit Error')
        return true
      }

      if (this.data.selectedVoteTopic === 'add') {
        const newMemberBalance = Number(await this.props.contracts.staking.availableBalanceOf(formData.newAddr))
        const newLockedAmount = Number(formData.newLockAmount)

        if (await this.props.contracts.gov.isMember(formData.newAddr)) {
          this.props.getErrModal('Existing Member Address (New)', 'Proposal Submit Error')
          return true
        } else if (this.props.newMemberaddr.some((item) => item === formData.newAddr)) {
          this.props.getErrModal('Address with existing ballot (New)', 'Proposal Submit Error')
          return true
        } else if (newMemberBalance < newLockedAmount) {
          this.props.getErrModal('Not Enough META Stake (New)', 'Proposal Submit Error')
          return true
        }
      } else if (this.data.selectedVoteTopic === 'replace') {
        const oldMemberLockedBalance = await this.props.contracts.staking.lockedBalanceOf(formData.oldAddr)
        const newMemberBalance = Number(await this.props.contracts.staking.availableBalanceOf(formData.newAddr))
        const newLockedAmount = Number(formData.newLockAmount)

        if (await this.props.contracts.gov.isMember(formData.newAddr)) {
          this.props.getErrModal('Existing Member Address (New)', 'Proposal Submit Error')
          return true
        } else if (!await this.props.contracts.gov.isMember(formData.oldAddr)) {
          this.props.getErrModal('Non-existing Member Address (Old)', 'Proposal Submit Error')
          return true
        } else if (this.props.newMemberaddr.some((item) => item === formData.newAddr)) {
          this.props.getErrModal('Address with existing ballot (New)', 'Proposal Submit Error')
          return true
        } else if (this.props.oldMemberaddr.some((item) => item === formData.oldAddr)) {
          this.props.getErrModal('Address with existing ballot (Old)', 'Proposal Submit Error')
          return true
        } else if (Number(oldMemberLockedBalance) !== newLockedAmount) {
          this.props.getErrModal(['Invalid Replace META Amount', <br />, `(Old Address: ${web3Instance.web3.utils.fromWei(oldMemberLockedBalance, 'ether')} META Locked)`], 'Proposal Submit Error')
          return true
        } else if (newMemberBalance < newLockedAmount) {
          this.props.getErrModal('Not Enough META Stake (New)', 'Proposal Submit Error')
          return true
        }
      } else if (this.data.selectedVoteTopic === 'remove') {
        const oldMemberBalance = Number(await this.props.contracts.staking.lockedBalanceOf(formData.oldAddr))
        const oldLockedAmount = Number(formData.oldLockAmount)

        if (!await this.props.contracts.gov.isMember(formData.oldAddr)) {
          this.props.getErrModal('Non-existing Member Address (Old)', 'Proposal Submit Error')
          return true
        } else if (this.props.oldMemberaddr.some((item) => item === formData.oldAddr)) {
          this.props.getErrModal('Address with existing ballot (Old)', 'Proposal Submit Error')
          return true
        } else if (oldMemberBalance < oldLockedAmount) {
          this.props.getErrModal('Invalid META Unlock Amount', 'Proposal Submit Error')
          return true
        }
      }
      return false
    }

    getAddProposalForm () {
      return (<div className='proposalBody'>
        <Form onSubmit={this.handleSubmit}>
          <p className='subtitle'>New Authority Address <span className='required'>*</span></p>
          <Form.Item>
            <Input name='newAddr' onChange={this.handleChange} className={this.state.newAddrErr ? 'errInput' : ''} disabled={this.props.buttonLoading} />
            <p className={this.state.newAddrErr ? 'errHint' : ''}>Invalid Address</p>
          </Form.Item>
          <div className='divider'>
            <div>
              <p className='subtitle'>Node Name <span className='required'>*</span></p>
              <Form.Item>
                <Input name='newName' onChange={this.handleChange} disabled={this.props.buttonLoading} />
              </Form.Item>
            </div>
            <div>
              <p className='subtitle'>META Amount to be locked <span className='required'>*</span></p>
              <Form.Item>
                <Input type='number' addonAfter='META' name='newLockAmount' defaultValue={constants.limitAmount.stakingMin} onChange={this.handleChange} className={this.state.newLockAmountErr ? 'errInput' : ''} disabled={this.props.buttonLoading} />
                <p className={this.state.newLockAmountErr ? 'errHint' : ''}>Invalid Amount</p>
              </Form.Item>
            </div>
          </div>
          <p className='subtitle'>New Authority Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input name='newNode' onChange={this.handleChange} className={this.state.newNodeErr ? 'errInput' : ''} disabled={this.props.buttonLoading} placeholder='6f8a80d1....66ad92a0@10.3.58.6:30303' />
            <p className={this.state.newNodeErr ? 'errHint' : ''}>Invalid Node</p>
          </Form.Item>
          <div className='helpDescription'>
            <Icon type='question-circle' />
            <p>
              The hexadecimal node ID is encoded in the username portion of the URL, separated from the host by an @ sign. The hostname can only be given as an IP address, DNS domain names are not allowed. The port in the host name section is the TCP listening port.
            </p>
          </div>
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
              <Button name='submit' className='submit_Btn' htmlType='submit' disabled={this.state.newLockAmountErr || this.state.newAddrErr || this.state.newNodeErr || this.state.newNameErr} loading={this.props.buttonLoading}>Submit</Button>
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
            <Input name='oldAddr' onChange={this.handleChange} className={this.state.oldAddrErr ? 'errInput' : ''} disabled={this.props.buttonLoading} />
            <p className={this.state.oldAddrErr ? 'errHint' : ''}>Invalid Address</p>
          </Form.Item>
          <p className='subtitle'>New Authority Address <span className='required'>*</span></p>
          <Form.Item>
            <Input name='newAddr' onChange={this.handleChange} className={this.state.newAddrErr ? 'errInput' : ''} disabled={this.props.buttonLoading} />
            <p className={this.state.newAddrErr ? 'errHint' : ''}>Invalid Address</p>
          </Form.Item>
          <div className='divider'>
            <div>
              <p className='subtitle'>Node Name <span className='required'>*</span></p>
              <Form.Item>
                <Input name='newName' onChange={this.handleChange} disabled={this.props.buttonLoading} />
              </Form.Item>
            </div>
            <div>
              <p className='subtitle'>Replace META Amount <span className='required'>*</span></p>
              <Form.Item>
                <Input type='number' addonAfter='META' name='newLockAmount' defaultValue={constants.limitAmount.stakingMin} onChange={this.handleChange} className={this.state.newLockAmountErr ? 'errInput' : ''} disabled={this.props.buttonLoading} />
                <p className={this.state.newLockAmountErr ? 'errHint' : ''}>Invalid Amount</p>
              </Form.Item>
            </div>
          </div>
          <p className='subtitle'>New Authority Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input name='newNode' onChange={this.handleChange} className={this.state.newNodeErr ? 'errInput' : ''} disabled={this.props.buttonLoading} placeholder='6f8a80d1....66ad92a0@10.3.58.6:30303' />
            <p className={this.state.newNodeErr ? 'errHint' : ''}>Invalid Node</p>
          </Form.Item>
          <div className='helpDescription'>
            <Icon type='question-circle' />
            <p>
              The hexadecimal node ID is encoded in the username portion of the URL, separated from the host by an @ sign. The hostname can only be given as an IP address, DNS domain names are not allowed. The port in the host name section is the TCP listening port.
            </p>
          </div>
          <p className='subtitle'>Old Authority Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input name='oldNode' onChange={this.handleChange} className={this.state.oldNodeErr ? 'errInput' : ''} disabled={this.props.buttonLoading} placeholder='6f8a80d1....66ad92a0@10.3.58.6:30303' />
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
              <Button className='submit_Btn' htmlType='submit' disabled={this.state.newLockAmountErr || this.state.newAddrErr || this.state.newNodeErr || this.state.newNameErr || this.state.oldAddrErr || this.state.oldNodeErr} loading={this.props.buttonLoading}>Submit</Button>
            </div>
          </Form.Item>
        </Form>
      </div>)
    }

    getRmoveProposalForm () {
      return (<div className='proposalBody'>
        <Form onSubmit={this.handleSubmit}>
          <p className='subtitle'>Address to be removed <span className='required'>*</span></p>
          <Form.Item>
            <Input.Search
              name='oldAddr'
              onChange={this.handleChange}
              className={this.state.oldAddrErr ? 'errInput' : ''}
              disabled={this.props.buttonLoading}
              enterButton={<span><Icon type='search' /><span> Check Balance</span></span>}
              onSearch={value => this.showLockAmount(value)} />
            <p className={this.state.oldAddrErr ? 'errHint' : ''}>Invalid Address</p>
          </Form.Item>
          <div className='divider'>
            <div>
              <p className='subtitle'>Locked META Amount</p>
              <Form.Item>
                <Input name='showLockAmount' value={this.state.showLockAmount} addonAfter='META' disabled />
              </Form.Item>
            </div>
            <div>
              <p className='subtitle'>META Amount to be unlocked <span className='required'>*</span></p>
              <Form.Item>
                <Input type='number' addonAfter='META' name='oldLockAmount' defaultValue={constants.limitAmount.stakingMin} onChange={this.handleChange} className={this.state.oldLockAmountErr ? 'errInput' : ''} disabled={this.props.buttonLoading} />
                <p className={this.state.oldLockAmountErr ? 'errHint' : ''}>Invalid Amount</p>
              </Form.Item>
            </div>
          </div>
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
            <Input name='newName' onChange={this.handleChange} disabled={this.props.buttonLoading} />
          </Form.Item>
          <p className='subtitle'>New Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input type='primary' name='newNode' onChange={this.handleChange} className={this.state.newNodeErr ? 'errInput' : ''} disabled={this.props.buttonLoading} placeholder='6f8a80d1....66ad92a0@10.3.58.6:30303' />
            <p className={this.state.newNodeErr ? 'errHint' : ''}>Invalid Node</p>
          </Form.Item>
          <div className='helpDescription'>
            <Icon type='question-circle' />
            <p>
              The hexadecimal node ID is encoded in the username portion of the URL, separated from the host by an @ sign. The hostname can only be given as an IP address, DNS domain names are not allowed. The port in the host name section is the TCP listening port.
            </p>
          </div>
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
              <Button className='submit_Btn' htmlType='submit' disabled={this.state.newNodeErr || this.state.newNameErr} loading={this.props.buttonLoading}>Submit </Button>
            </div>
          </Form.Item>
        </Form>
      </div>)
    }

    async showLockAmount (value) {
      if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
        this.props.getErrModal('Invalid Adress', 'Proposal Submit Error')
        this.setState({ showLockAmount: '' })
        return
      } else if (!web3Instance.web3.utils.checkAddressChecksum(value)) {
        value = web3Instance.web3.utils.toChecksumAddress(value)
      }
      if (!await this.props.contracts.gov.isMember(value)) {
        this.props.getErrModal('Non-existing Member Address (Old)', 'Proposal Submit Error')
        this.setState({ showLockAmount: '' })
        return
      }

      try {
        let lockedBalance = await this.props.contracts.staking.lockedBalanceOf(value)
        lockedBalance = web3Instance.web3.utils.fromWei(lockedBalance)
        this.setState({ showLockAmount: lockedBalance })
      } catch (err) {
        console.log(err)
        this.props.getErrModal(err.message, err.name)
        this.props.convertButtonLoading(false)
        this.setState({ showLockAmount: '' })
      }
    }

    getProposalForm () {
      switch (this.data.selectedVoteTopic) {
        case 'add': return this.getAddProposalForm()
        case 'replace': return this.getReplaceProposalForm()
        case 'update': return this.getUpdateProposalForm()
        case 'remove': return this.getRmoveProposalForm()
      }
    }

    render () {
      return (
        <div>
          <div className='contentDiv container'>
            <div className='backBtnDiv'>
              <Button onClick={e => this.props.convertComponent('voting')} loading={this.props.buttonLoading}>
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
                  disabled={this.props.buttonLoading}>
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

// ProposalForm = Form.create()(ProposalForm)
export { ProposalForm }

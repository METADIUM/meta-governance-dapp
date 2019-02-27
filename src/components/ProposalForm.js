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
      submitForm: false
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
    }

    /* Submit form data. */
    handleSubmit = async (e) => {
      e.preventDefault()
      let trx = {}
      let isMember = await this.props.contracts.gov.isMember(web3Instance.defaultAccount)
      if (!isMember) {
        window.alert('Not Member')
        return
      }
      util.refineSubmitData(this.data.formData)

      if (!await this.props.contracts.staking.balanceOf(this.data.formData.newAddr) ||!await this.props.contracts.gov.isMember(this.data.formData.newAddr)) {
        window.alert('Not Exist staking meta or New member is Exist')
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
        let isExistMember = await this.props.contracts.gov.isMember(this.data.formData.oldAddr)
        let alreadyNewMember = this.props.contracts.gov.isMember(this.data.formData.newAddr)
        
        if (!isExistMember) {window.alert('Not Member')}return
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
            <Input addonAfter='META' name='lockAmount' onChange={this.handleChange} />
          </Form.Item>
          <p className='subtitle'>New Authority Address <span className='required'>*</span></p>
          <Form.Item>
            <Input name='addr' onChange={this.handleChange} />
          </Form.Item>
          <p className='subtitle'>New Authority Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input type='primary' name='node' onChange={this.handleChange} />
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
              <Button className='submit_Btn' htmlType='submit'>Submit </Button>
            </div>
          </Form.Item>
        </Form>
      </div>)
    }

    getReplaceProposalForm () {
      return (<div className='proposalBody'>
        <Form onSubmit={this.handleSubmit}>
          <p className='subtitle'>META Amount to be locked (New) <span className='required'>*</span></p>
          <Form.Item>
            <Input addonAfter='META' style={{ marginBottom: '0%' }} name='newLockAmount' onChange={this.handleChange} />
          </Form.Item>
          <p className='subtitle'>New Authority Address <span className='required'>*</span></p>
          <Form.Item>
            <Input style={{ marginBottom: '0%' }} name='newAddr' onChange={this.handleChange} />
          </Form.Item>
          <p className='subtitle'>New Authority Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input style={{ marginBottom: '0%' }} name='newNode' onChange={this.handleChange} />
          </Form.Item>
          <p className='subtitle'>META Amount to be unlocked (Old) <span className='required'>*</span></p>
          <Form.Item>
            <Input addonAfter='META' style={{ marginBottom: '0%' }} name='oldLockAmount' onChange={this.handleChange} />
          </Form.Item>
          <p className='subtitle'>Old Authority Address <span className='required'>*</span></p>
          <Form.Item>
            <Input style={{ marginBottom: '0%' }} name='oldAddr' onChange={this.handleChange} />
          </Form.Item>
          <p className='subtitle'>Old Authority Node Description <span className='required'>*</span></p>
          <Form.Item>
            <Input style={{ marginBottom: '0%' }} name='oldNode' onChange={this.handleChange} />
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
              <Button className='submit_Btn' htmlType='submit'>Submit </Button>
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

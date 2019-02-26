import React from 'react'
import { Button, Select, Input, Form } from 'antd'
import './style/style.css'
import { Voting } from './Voting'
import { web3Instance } from '../ethereum/web3'
import * as util from '../util'

import { validNumber, validAddress, validLength } from '../util'
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

    constructor (props) {
      super(props)
    }

    onSelectChange = async (value) => {
      this.data.selectedVoteTopic = value
      // Reset form data
      this.data.formData = {}
      this.setState({ selectedChange: true })
    }

    /* Type casting and save form data. */
    handleChange = (e) => {
      
      // if (type == 'number') {
      //   e.target.value = e.target.value.replace(' ', '')
      //   this.data.formData[this.data.selectedVoteTopic][e.target.name] = Number(e.target.value)
      // } else {
      //   this.data.formData[this.data.selectedVoteTopic][e.target.name] = e.target.value
      // }
      this.data.formData[e.target.name] = e.target.value
    }

    /* Submit form data. */
    handleSubmit = async (e) => {
      e.preventDefault()
      let trx = {}
      let isMember = await this.props.contracts.gov.isMember(web3Instance.defaultAccount)
      if (!isMember) {
        console.log('Not Member')
        return
      }
      util.refineSubmitData(this.data.formData)

      if(this.data.selectedVoteTopic === 'add') {
        trx = this.props.contracts.govImp.addProposalToAddMember(
          this.data.formData.addr,
          this.data.formData.node.node,
          this.data.formData.node.ip,
          this.data.formData.node.port,
          this.data.formData.lockAmount,
          this.data.formData.memo
        )
      } else {
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
      return (<div>
        <Form onSubmit={this.handleSubmit}>
          <h3> META Amount to be locked {<span style={{ color: 'red' }}>*</span>}</h3>
          <Form.Item>
            <Input addonAfter='META' style={ {marginBottom: '0%'} } name='lockAmount' onChange={this.handleChange }/>
          </Form.Item>
          <h3> New Authority Address {<span style={{ color: 'red' }}>*</span>} </h3>
          <Form.Item>
            <Input style={ {marginBottom: '0%'} } name='addr' onChange={this.handleChange }/>
          </Form.Item>
          <h3> New Authority Node Description {<span style={{ color: 'red' }}>*</span>}</h3>
          <Form.Item>
            <Input style={ {marginBottom: '0%'} } name='node' onChange={this.handleChange }/>
          </Form.Item>
          <h3> Description </h3>
          <Form.Item>
              <TextArea
                rows={4}
                placeholder='Max. 256 bytes'
                autosize={{ minRows: 2, maxRows: 4 }}
                name='memo'
                onChange={this.handleChange}
              />
          </Form.Item>

          <h4 style={{ color: 'red', marginTop: '2%' }}>*Mandatory</h4>
          <Form.Item>
            <Button className='submit_Btn' shape='round' htmlType='submit'>submit </Button>
          </Form.Item>
        </Form>
      </div>)
    }

    getReplaceProposalForm() {
      return (<div>
        <Form onSubmit={this.handleSubmit}>
          <h3> META Amount to be locked (New) {<span style={{ color: 'red' }}>*</span>}</h3>
          <Form.Item>
            <Input addonAfter='META' style={ {marginBottom: '0%'} } name='newLockAmount' onChange={this.handleChange }/>
          </Form.Item>
          <h3> New Authority Address {<span style={{ color: 'red' }}>*</span>} </h3>
          <Form.Item>
            <Input style={ {marginBottom: '0%'} } name='newAddr' onChange={this.handleChange }/>
          </Form.Item>
          <h3> New Authority Node Description {<span style={{ color: 'red' }}>*</span>}</h3>
          <Form.Item>
            <Input style={ {marginBottom: '0%'} } name='newNode' onChange={this.handleChange }/>
          </Form.Item>
          <h3> META Amount to be unlocked (Old) {<span style={{ color: 'red' }}>*</span>}</h3>
          <Form.Item>
            <Input addonAfter='META' style={ {marginBottom: '0%'} } name='oldLockAmount' onChange={this.handleChange }/>
          </Form.Item>
          <h3> Old Authority Address {<span style={{ color: 'red' }}>*</span>}</h3>
          <Form.Item>
            <Input style={ {marginBottom: '0%'} } name='oldAddr' onChange={this.handleChange }/>
          </Form.Item>
          <h3> Old Authority Node Description {<span style={{ color: 'red' }}>*</span>}</h3>
          <Form.Item>
            <Input style={ {marginBottom: '0%'} } name='oldNode' onChange={this.handleChange }/>
          </Form.Item>
          <h3> Description </h3>
          <Form.Item>
              <TextArea
                rows={4}
                placeholder='Max. 256 bytes'
                autosize={{ minRows: 2, maxRows: 4 }}
                name='memo'
                onChange={this.handleChange}
              />
          </Form.Item>

          <h4 style={{ color: 'red', marginTop: '2%' }}>*Mandatory</h4>
          <Form.Item>
            <Button className='submit_Btn' shape='round' htmlType='submit'>submit</Button>
          </Form.Item>
        </Form>
      </div>)
    }

    render () {
      return (
        <div>
          {!this.state.isBack
            ? <div>
              <div style={{ margin: '1% 2% 3% 16%' }}>
                <Button style={{ float: 'left', marginRight: '2%' }} onClick={() => { this.setState({ isBack: !this.state.isBack }) }}>←</Button>
                <h2>Back to Voting</h2>
              </div>
              <div className='contentVotingDiv'>
                <div>
                  <h2>New Proposal</h2><hr /><br />
                  <h2>Topic for voting <span style={{ color: 'red' }}>*</span></h2>
                  <Select
                    showArrow
                    onChange={this.onSelectChange}
                    style={{ width: '100%', marginBottom: '2%' }}
                  >
                    <Select.Option value='add'>Add Authority</Select.Option>
                    <Select.Option value='replace'>Replace Authority</Select.Option>
                  </Select><hr />
                </div><br /><br />
                { this.data.selectedVoteTopic !== '' ?
                  <div style={{ marginTop: '2%' }}>
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

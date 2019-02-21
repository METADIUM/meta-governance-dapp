import React from 'react'
import { Button, Select, Input, Form } from 'antd'
import './style/style.css'
import { Voting } from './Voting'
import { contracts, initContracts } from '../ethereum/web3Components/contracts'
import { validNumber, validAddress, validLength } from '../util'
const { TextArea } = Input

class ProposalForm extends React.Component {
    initialFormData = {
      add: {
        metaAmountToBeLocked: 0,
        newAuthorityAddress: 0,
        newAuthorityNodeDescription: '',
        description: ''
      },
      replace: {
        metaAmountToBeLockedNew: 0,
        newAuthorityAddress: 0,
        newAuthorityNodeDescription: '',
        metaAmountToBeUnlockedOld: 0,
        oldAuthorityAddress: 0,
        oldAuthorityNodeDescription: '',
        description: ''
      }
    }
    data = {
      selectedVoteTopic: '',
      formData: null
    }
    state = {
      isBack: false,
      selectedChange: false,
      formData: null
    }

    constructor (props) {
      super(props)
      this.data.formData = JSON.parse(JSON.stringify(this.initialFormData))
    }

    onSelectChange = async (value) => {
      console.log('onSelectChange: ', value)
      this.data.selectedVoteTopic = value
      this.setState({ selectedChange: true })

      /* Reset form field. */
      let fields = Object.keys(this.data.formData[this.data.selectedVoteTopic])
      this.data.formData = JSON.parse(JSON.stringify(this.initialFormData))
      await this.props.form.resetFields()
      await this.props.form.validateFields(fields, async (err, values) => {})
    }

    /* Type casting and save form data. */
    handleChange = (e) => {
      const type = typeof this.data.formData[this.data.selectedVoteTopic][e.target.name]
      if (type == 'number') {
        e.target.value = e.target.value.replace(' ', '')
        this.data.formData[this.data.selectedVoteTopic][e.target.name] = Number(e.target.value)
      } else {
        this.data.formData[this.data.selectedVoteTopic][e.target.name] = e.target.value
      }
    }

    /* Submit form data. */
    handleSubmit = async (e) => {
      e.preventDefault()
      let submitedFields = Object.keys(this.data.formData[this.data.selectedVoteTopic])
      this.props.form.validateFields(submitedFields, async (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          await this.setState({
            formData: this.data.formData
          })
          console.log(this.state.formData)
        }
      })
    }

    getProposalForm () {
      if (!this.state.selectedChange) return

      const {
        getFieldDecorator, getFieldsError, getFieldError, isFieldTouched
      } = this.props.form

      function defaultConfig (msg) {
        return ({
          rules: [{
            required: true,
            message: msg
          }]
        })
      }

      function formItemInput (config, options) {
        return (
          <Form.Item>
            {getFieldDecorator(options.name, config)(
              <Input addonAfter={options.addonAfter} style={options.style} name={options.name} onChange={options.onChange} type={options.type} />
            )}
          </Form.Item>
        )
      }

      const contentAdd = (
        <div>
          <Form onSubmit={this.handleSubmit}>
            <h3> META Amount to be locked {<span style={{ color: 'red' }}>*</span>}</h3>
            {formItemInput({
              rules: [
                { validator: validNumber }
              ]
            },
            { name: 'metaAmountToBeLocked', style: { marginBottom: '0%' }, onChange: this.handleChange, addonAfter: 'META' })}
            <h3> New Authority Address {<span style={{ color: 'red' }}>*</span>} </h3>
            {formItemInput({
              rules: [
                { validator: validAddress }
              ]
            },
            { name: 'newAuthorityAddress', style: { marginBottom: '0%' }, onChange: this.handleChange })}
            <h3> New Authority Node Description {<span style={{ color: 'red' }}>*</span>}</h3>
            {formItemInput(defaultConfig('Please input ...'),
              { name: 'newAuthorityNodeDescription', style: { marginBottom: '0%' }, onChange: this.handleChange })}

            <h3> Description </h3>
            <Form.Item>
              {getFieldDecorator('description', {
                getValueFromEvent: (e) => e.target.value.substring(0, 256),
                rules: [
                  { validator: validLength }
                ]
              })(
                <TextArea
                  rows={4}
                  placeholder='Max. 256 bytes'
                  autosize={{ minRows: 2, maxRows: 4 }}
                  name='description'
                  onChange={this.handleChange}
                />
              )}
            </Form.Item>

            <h4 style={{ color: 'red', marginTop: '2%' }}>*Mandatory</h4>
            <Form.Item>
              <Button className='submit_Btn' shape='round' htmlType='submit'>
              submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )

      const contentReplace = (
        <div>
          <Form onSubmit={this.handleSubmit}>
            <h3> META Amount to be locked (New) {<span style={{ color: 'red' }}>*</span>}</h3>
            {formItemInput({
              rules: [
                { validator: validNumber }
              ]
            },
            { name: 'metaAmountToBeLockedNew', style: { marginBottom: '0%' }, onChange: this.handleChange, addonAfter: 'META' })}
            <h3> New Authority Address {<span style={{ color: 'red' }}>*</span>} </h3>
            {formItemInput({
              rules: [
                { validator: validAddress }
              ]
            },
            { name: 'newAuthorityAddress', style: { marginBottom: '0%' }, onChange: this.handleChange })}
            <h3> New Authority Node Description {<span style={{ color: 'red' }}>*</span>}</h3>
            {formItemInput(defaultConfig('Please input ...'),
              { name: 'newAuthorityNodeDescription', style: { marginBottom: '0%' }, onChange: this.handleChange })}
            <h3> META Amount to be unlocked (Old) {<span style={{ color: 'red' }}>*</span>}</h3>
            {formItemInput({
              rules: [
                { validator: validNumber }
              ]
            },
            { name: 'metaAmountToBeUnlockedOld', style: { marginBottom: '0%' }, onChange: this.handleChange, addonAfter: 'META' })}
            <h3> Old Authority Address {<span style={{ color: 'red' }}>*</span>}</h3>
            {formItemInput({
              rules: [
                { validator: validAddress }
              ]
            },
            { name: 'oldAuthorityAddress', style: { marginBottom: '0%' }, onChange: this.handleChange })}
            <h3> Old Authority Node Description {<span style={{ color: 'red' }}>*</span>}</h3>
            {formItemInput(defaultConfig('Please input ...'),
              { name: 'oldAuthorityNodeDescription', style: { marginBottom: '0%' }, onChange: this.handleChange })}

            <h3> Description </h3>
            <Form.Item>
              {getFieldDecorator('description', {
                getValueFromEvent: (e) => e.target.value.substring(0, 256),
                rules: [
                  { validator: validLength }
                ]
              })(
                <TextArea
                  rows={4}
                  placeholder='Max. 256 bytes'
                  autosize={{ minRows: 2, maxRows: 4 }}
                  name='description'
                  onChange={this.handleChange}
                />
              )}
            </Form.Item>

            <h4 style={{ color: 'red', marginTop: '2%' }}>*Mandatory</h4>
            <Form.Item>
              <Button className='submit_Btn' shape='round' htmlType='submit'>
                submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )

      switch (this.data.selectedVoteTopic) {
        case 'add': return contentAdd
        case 'replace': return contentReplace
        default:
      }
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
                <div style={{ marginTop: '2%' }}>
                  {this.getProposalForm()}
                </div>
              </div>
            </div>
            : <div>
              <Voting contracts={contracts} />
            </div>
          }
        </div>
      )
    }
}

ProposalForm = Form.create()(ProposalForm)
export { ProposalForm }

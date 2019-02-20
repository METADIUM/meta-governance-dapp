import React from 'react'
import { Button, Select, Input, Form } from 'antd'
import './style/style.css'
import { Voting } from './Voting'
import { contracts, initContracts } from '../ethereum/web3Components/contracts'
const { TextArea } = Input



class ProposalForm extends React.Component {

    initialFormData = {
      add: {
        metaAmountToBeLocked: 0,
        newAuthorityAddress: 0,
        newAuthorityNodeDescription: '',
        description: '',
      },
      replace: {
        metaAmountToBeLockedNew: 0,
        newAuthorityAddress: 0,
        newAuthorityNodeDescription: '',
        metaAmountToBeUnlockedOld: 0,
        oldAuthorityAddress: 0,
        oldAuthorityNodeDescription: '',
        description: '',
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

    componentWillMount () {

    }

    onSelectChange = (value) => {
      console.log('onSelectChange: ', value)
      this.data.selectedVoteTopic = value
      this.setState({ selectedChange: true })

      /* Reset form field. */
      this.props.form.resetFields();
      this.data.formData = JSON.parse(JSON.stringify(this.initialFormData))
    }

    /* Type casting and save form data. */
    handleChange = (e) => {
      const {name, value} = e.target;
      const type = typeof this.data.formData[this.data.selectedVoteTopic][name]
      this.data.formData[this.data.selectedVoteTopic][name]
        = (type === 'number') ? Number(value)
        : value;
    }

    /* Submit form data. */
    handleSubmit = async (e) => {
      e.preventDefault()
      let submitedFields = Object.keys(this.data.formData[this.data.selectedVoteTopic])
      this.props.form.validateFields(submitedFields, async (err, values) =>{
        if (!err){
          console.log('Received values of form: ', values);
          await this.setState({
            formData: this.data.formData
          })
          console.log(this.state.formData);
        }
      })
    }

    getProposalForm () {

      if (!this.state.selectedChange) return

      let inputMarginStyle = {marginBottom: '0%'};
      let scale = 'META';
      let star = <span style={{color: 'red'}}>*</span>

      const {
        getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
      } = this.props.form;

      function defaultConfig(msg){
        return ({
          rules: [{
            required: true,
            message: msg
          }]
        })
      }

      function formItemInput(config, options) {
        return (
          <Form.Item>
            {getFieldDecorator(options.name, config)(
              <Input style= {options.style} name={options.name} onChange={options.onChange} addonAfter={options.addonAfter} />
            )}
          </Form.Item>
        );
      }

      const contentAdd = (
        <div>
        <Form onSubmit={this.handleSubmit}>
          <h3> META Amount to be locked {star}</h3>
          {formItemInput( defaultConfig('Please input ... '),
            {name: 'metaAmountToBeLocked', style: inputMarginStyle, onChange: this.handleChange, addonAfter: scale})}
          <h3> New Authority Address {star} </h3>
          {formItemInput (defaultConfig('Please input ...'),
            {name: 'newAuthorityAddress', style: inputMarginStyle, onChange: this.handleChange})}
          <h3> New Authority Node Description {star}</h3>
          {formItemInput (defaultConfig('Please input ...'),
            {name: 'newAuthorityNodeDescription', style: inputMarginStyle, onChange: this.handleChange})}

          <h3> Description </h3>
          <TextArea
            rows={4}
            placeholder='Max. 256 bytes'
            autosize={{ minRows: 2, maxRows: 4 }}
            name = 'description'
            onChange={this.handleChange}
          />

          <h4 style={{color: 'red', marginTop: '2%'}}>*Mandatory</h4>
          <Form.Item>
            <Button className='submit_Btn' shape='round' htmlType='submit'>
              submit
            </Button>
          </Form.Item>
        </Form>
        </div>
      );

      const contentReplace = (
        <div>
        <Form onSubmit={this.handleSubmit}>
          <h3> META Amount to be locked (New) {star}</h3>
          {formItemInput( defaultConfig('Please input ... '),
            {name: 'metaAmountToBeLockedNew', style: inputMarginStyle, onChange: this.handleChange, addonAfter: scale})}
          <h3> New Authority Address {star} </h3>
          {formItemInput (defaultConfig('Please input ...'),
            {name: 'newAuthorityAddress', style: inputMarginStyle, onChange: this.handleChange})}
          <h3> New Authority Node Description {star}</h3>
          {formItemInput (defaultConfig('Please input ...'),
            {name: 'newAuthorityNodeDescription', style: inputMarginStyle, onChange: this.handleChange})}
          <h3> META Amount to be unlocked (Old) {star}</h3>
          {formItemInput (defaultConfig('Please input ...'),
            {name: 'metaAmountToBeUnlockedOld', style: inputMarginStyle, onChange: this.handleChange, addonAfter: scale})}
          <h3> Old Authority Address {star}</h3>
          {formItemInput (defaultConfig('Please input ...'),
            {name: 'oldAuthorityAddress', style: inputMarginStyle, onChange: this.handleChange})}
          <h3> Old Authority Node Description {star}</h3>
          {formItemInput (defaultConfig('Please input ...'),
            {name: 'oldAuthorityNodeDescription', style: inputMarginStyle, onChange: this.handleChange})}

          <h3> Description </h3>
          <TextArea
            rows={4}
            placeholder='Max. 256 bytes'
            autosize={{ minRows: 2, maxRows: 4 }}
            name = 'description'
            onChange={this.handleChange}
          />

          <h4 style={{color: 'red', marginTop: '2%'}}>*Mandatory</h4>
          <Form.Item>
              <Button className='submit_Btn' shape='round' htmlType='submit'>
                submit
              </Button>
          </Form.Item>
        </Form>
        </div>
      );

      switch(this.data.selectedVoteTopic) {
        case 'add':
          return contentAdd;
          break;
        case 'replace':
          return contentReplace;
          break;
        default:
          return;
      }
    }

    render () {

      return (
        <div>
        {!this.state.isBack
          ?
          <div>
          <div style={{margin: '1% 2% 3% 16%'}}>
            <Button style={{float: 'left', marginRight: '2%'}} onClick={() => {this.setState({isBack: !this.state.isBack})}}>←</Button>
            <h2>Back to Voting</h2>
          </div>
          <div className='contentVotingDiv'>
            <div>
              <h2>New Proposal</h2><hr /><br />
              <h2>Topic for voting <span style={{color: 'red'}}>*</span></h2>
              <Select
                showArrow
                onChange={this.onSelectChange}
                style={{ width: '100%', marginBottom: '2%' }}
              >
                <Select.Option value='add'>Add Authority</Select.Option>
                <Select.Option value='replace'>Replace Authority</Select.Option>
              </Select><hr />
            </div><br></br><br></br>
            <div style={{marginTop: '2%'}}>
              {this.getProposalForm()}
            </div>
          </div>
          </div>
          :
          <div>
            <Voting contracts={contracts}/>
          </div>
        }
        </div>
      )
    }
}

ProposalForm  = Form.create()(ProposalForm)
export { ProposalForm }

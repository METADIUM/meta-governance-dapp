import React from 'react'
import { Button, Select, Input } from 'antd'
import './style/style.css'

const { TextArea } = Input

class ProposalForm extends React.Component {

    data = {
      selectedVoteTopic: '',
    }
    state = {
      isBack: false,
      selectedChange: false,
      metaAmountToBeLocked: null,
      metaAmountToBeLockedNew: null,
      newAuthorityAddress: null,
      newAuthorityNodeDescription: null,
      metaAmountToBeUnlockedOld: null,
      oldAuthorityAddress: null,
      oldAuthorityNodeDescription: null,
      description: null
    }

    resetInputStates() {
      document.getElementById('authorityForm').reset();
    }

    constructor (props) {
      super(props)
    }

    componentWillMount () {

    }

    onSelectChange = (value) => {
      if (this.state.selectedChange){
        this.resetInputStates();
      }
      console.log('onSelectChange: ', value)
      this.data.selectedVoteTopic = value
      this.setState({ selectedChange: true })
    }

    handleChange = (e) => {
      this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit = (e) => {
      /* Type casting for numerical values. */
      this.setState({
        metaAmountToBeLocked: Number(this.state.metaAmountToBeLocked),
        metaAmountToBeLockedNew: Number(this.state.metaAmountToBeLockedNew),
        newAuthorityAddress: Number(this.state.newAuthorityAddress),
        metaAmountToBeUnlockedOld: Number(this.state.metaAmountToBeUnlockedOld),
        oldAuthoirtyAddress: Number(this.state.oldAuthorityAddress)
      });

      /* Debugging. */
      alert(`${this.state.metaAmountToBeLocked}`)
      e.preventDefault()
    }

    getAuthorityForm () {

      if (!this.state.selectedChange) return

      let inputMarginStyle = {marginBottom: '2%'};
      let scale = 'META';
      let star = <span style={{color: 'red'}}>*</span>

      return (
        <div>
        <form onSubmit={this.handleSubmit} id='authorityForm'>
          {this.data.selectedVoteTopic === 'add'
            ? <div>
                <h3> META Amount to be locked {star}</h3>
                <Input style= {inputMarginStyle} addonAfter={scale} name = 'metaAmountToBeLocked' onChange={this.handleChange} />
              </div>
            : null
          }
          {this.data.selectedVoteTopic === 'replace'
            ? <div>
                <h3> META Amount to be locked (New) {star}</h3>
                <Input style= {inputMarginStyle} addonAfter={scale} name = 'metaAmountToBeLockedNew' onChange={this.handleChange}/>
              </div>
            : null
          }

          <h3> New Authority Address {star} </h3>
          <Input style= {inputMarginStyle} name = 'newAuthorityAddress' onChange={this.handleChange}/>
          <h3> New Authority Node Description {star}</h3>
          <Input style= {inputMarginStyle} name = 'newAuthorityNodeDescription' onChange={this.handleChange}/>

          {this.data.selectedVoteTopic === 'replace'
            ? <div>
                <h3> META Amount to be unlocked (Old) {star}</h3>
                <Input style= {inputMarginStyle} addonAfter={scale} name = 'metaAmountToBeUnlockedOld' onChange={this.handleChange}/>
                <h3> Old Authority Address {star}</h3>
                <Input style= {inputMarginStyle} name = 'oldAuthorityAddress' onChange={this.handleChange} />
                <h3> Old Authority Node Description {star}</h3>
                <Input style= {inputMarginStyle} name = 'oldAuthorityNodeDescription' onChange={this.handleChange}/>
              </div>
            : null
          }

          <h3> Description </h3>
          <TextArea
            rows={4}
            placeholder='Max. 256 bytes'
            autosize={{ minRows: 2, maxRows: 4 }}
            name = 'description'
            onChange={this.handleChange}
          />

          <h4 style={{color: 'red', marginTop: '2%'}}>*Mandatory</h4>
          <div>
            <Button
              className='submit_Btn'
              shape='round'
              htmlType='submit'>
              submit
            </Button>
          </div>
        </form>
        </div>
      )
    }

    render () {

      return (
        <div>
          <div style={{margin: '1% 2% 3% 16%'}}>
            <Button style={{float: 'left', marginRight: '2%'}}>←</Button>
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
              {this.getAuthorityForm()}
            </div>
          </div>
        </div>
      )
    }
}

export { ProposalForm }

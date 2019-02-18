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
    }

    constructor (props) {
      super(props)
    }

    componentWillMount () {

    }

    onSelectChange = (value) => {
      console.log('onSelectChange: ', value)
      this.data.selectedVoteTopic = value
      this.setState({ selectedChange: true })
    }

    getContent () {

      if (!this.state.selectedChange) return

      var inputMarginStyle = {marginBottom: '2%'};
      var scale = 'META';

      let list = [];

      return (
        <div>
          {this.data.selectedVoteTopic == 'add'
            ? <div>
                <h3> META Amount to be locked <span style={{color: 'red'}}>*</span></h3>
                <Input style= {inputMarginStyle} addonAfter={scale} />
              </div>
            : null
          }
          {this.data.selectedVoteTopic == 'replace'
            ? <div>
                <h3> META Amount to be locked (New) <span style={{color: 'red'}}>*</span></h3>
                <Input style= {inputMarginStyle} addonAfter={scale}/>
              </div>
            : null
          }

          <h3> New Authority Address <span style={{color: 'red'}}>*</span></h3>
          <Input style= {inputMarginStyle}/>
          <h3> New Authority Node Description <span style={{color: 'red'}}>*</span></h3>
          <Input style= {inputMarginStyle}/>

          {this.data.selectedVoteTopic == 'replace'
            ? <div>
                <h3> META Amount to be unlocked (Old) <span style={{color: 'red'}}>*</span></h3>
                <Input style= {inputMarginStyle} addonAfter={scale} />
                <h3> Old Authority Address <span style={{color: 'red'}}>*</span></h3>
                <Input style= {inputMarginStyle}/>
                <h3> Old Authority Node Description <span style={{color: 'red'}}>*</span></h3>
                <Input style= {inputMarginStyle}/>
              </div>
            : null
          }

          <h3> Description </h3>
          <TextArea
            rows={4}
            placeholder='Max. 256 bytes'
          />

          <h4 style={{color: 'red', marginTop: '2%'}}>&nbsp;&nbsp;&nbsp;&nbsp;*Mandatory</h4>
          <div>
            <Button
              className='submit_Btn'
              shape='round'>
              submit
            </Button>
          </div>
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
              {this.getContent()}
            </div>
          </div>
        </div>
      )
    }
}
export { ProposalForm }

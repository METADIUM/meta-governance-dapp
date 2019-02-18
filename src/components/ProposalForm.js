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
                <h3> META Amount to be locked *</h3>
                <Input style= {inputMarginStyle} addonAfter={scale} />
              </div>
            : null
          }
          {this.data.selectedVoteTopic == 'replace'
            ? <div>
                <h3> META Amount to be locked (New) *</h3>
                <Input style= {inputMarginStyle} addonAfter={scale}/>
              </div>
            : null
          }

          <h3> New Authority Address *</h3>
          <Input style= {inputMarginStyle}/>
          <h3> New Authority Node Description *</h3>
          <Input style= {inputMarginStyle}/>

          {this.data.selectedVoteTopic == 'replace'
            ? <div>
                <h3> META Amount to be unlocked (Old) *</h3>
                <Input style= {inputMarginStyle} addonAfter={scale} />
                <h3> Old Authority Address *</h3>
                <Input style= {inputMarginStyle}/>
                <h3> Old Authority Node Description *</h3>
                <Input style= {inputMarginStyle}/>
              </div>
            : null
          }

          <h3> Description </h3>
          <TextArea
            rows={4}
            placeholder='Max. 256 bytes'
          />

          <h4>&nbsp;&nbsp;&nbsp;&nbsp;*Mandatory</h4>
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
              <h2>Topic for voting *</h2>
              <Select
                showArrow
                onChange={this.onSelectChange}
                style={{ width: '100%', marginBottom: '2%' }}
              >
                <Select.Option value='add'>Add Authority</Select.Option>
                <Select.Option value='replace'>Replace Authority</Select.Option>
              </Select><hr />
            </div><br></br><br></br>

            <div>
                <div>
                  <h2>META Amount to be locked *</h2>
                  <Input addonAfter='META'/>
                </div>
                <div>
                  <h2>META Authority to be locked *</h2>
                  <Input />
                </div>
                <div>
                  <h2>New Authority Address *</h2>
                  <Input />
                </div>
                <div>
                  <h2>New Authority Node Description *</h2>
                  <Input />
                </div>
                <div>
                  <h2>Description</h2>
                  <TextArea placeholder='Max. 256 bytes' autosize={{ minRows: 2, maxRows: 4 }}/>
                  <p style={{color: 'red', marginTop: '2%'}}> * Mandatory</p>
                </div>
            </div>
            <div style={{marginTop: '2%'}}>
              {this.getContent()}
            </div>
          </div>
        </div>
      )
    }
}
export { ProposalForm }

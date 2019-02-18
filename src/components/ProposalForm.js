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
              
            <div>
            </div>
          </div>
        </div>
      )
    }
}
export { ProposalForm }

import React from 'react'
import { Button, Select } from 'antd'
import './style/style.css'

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
          <div style={{margin: '1% 2% 3% 11%'}}>
            <Button style={{float: 'left', marginRight: '2%'}}>←</Button>
            <h2>Back to Voting</h2>
          </div>
          <div className='contentDiv'>
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
            </div>
            <div>
            </div>
          </div>
        </div>
      )
    }
}
export { ProposalForm }

import React from 'react'
import { Button, List, Progress } from 'antd'
import './style/style.css'
import { testData } from './test/testData'

import { getGithubContents } from '../util'

class Authority extends React.Component {
    data = {
      authorityItems: []
    }

    state = {
      getAuthorityInfo: false
    }

    constructor (props) {
      super(props)
    }

    componentWillMount () {
      this.getAuthorityList()
    }

    onApplyBtnClick () {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSfpSAevry4nqjljMACD1DhVzP8oU9J0OgvN49bGakofcZa49w/viewform?fbzx=2570300132786392930', '_blank')
    }

    async getAuthorityList () {
      let list = []
      testData.govTestData = await getGithubContents('METADIUM', 'meta-authorities', 'master', 'authorities.json');

      console.log('getAuthorityList length: ', testData.govTestData.length)

      testData.govTestData.map((item) => {
        list.push(
          <div className='authorityComp'>
            <div style={{ float: 'left', width: '19%', backgroundColor: '#FFEAF6' }}>
              <img src='https://raw.githubusercontent.com/METADIUM/metadium-token-contract/master/misc/Metadium_Logo_Vertical_PNG.png' alt='' width='100%' height='auto' />
            </div>
            <div style={{ padding: 30, float: 'left', width: '81%' }}>
              <div style={{ height: '70px' }}>
                <h2 style={{ float: 'left' }}>{item.title}</h2>
                <h4 style={{ float: 'right' }}>Address: {item.addr}</h4>
              </div>
              <div style={{ height: '80px' }}><p>{item.description}</p></div>
              <div style={{ height: '80px' }}>
                <div><h3><a href='http://www.metadium.com' target='_blank'>{item.title} Web site</a></h3></div>
                <div>
                  {this.getSNSList(item.sns)}
                </div>
              </div>
            </div>
          </div>
        )
      })

      this.data.authorityItems = list
      this.setState({ getAuthorityInfo: true })
    }

    getSNSList (snsList) {
      let sns = []
      for (var key in snsList) {
        sns.push(<Button className='snsGroup'>{snsList[key]}</Button>)
      }
      return sns
    }

    render () {
      return (
        <div>
          <div className='contentDiv'>
            <div><Button className='apply_proposal_Btn' onClick={this.onApplyBtnClick}>Apply for Authority</Button></div>
            <div style={{ padding: 20, minHeight: 500 }}>
              {this.state.getAuthorityInfo
                ? this.data.authorityItems
                : <div>empty</div>
              }
            </div>
          </div>
        </div>
      )
    }
}
export { Authority }

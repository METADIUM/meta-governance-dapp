import React from 'react'
import { Button, List, Progress } from 'antd'
import './style/style.css'
import { testData } from './test/testData'
import { getGithubContents } from '../util'
import { githubConfig } from './config/githubConfig'

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
      testData.govTestData = await getGithubContents(githubConfig.org, githubConfig.repo, githubConfig.branch, githubConfig.source);
      console.log('getAuthorityList length: ', testData.govTestData.length)
      // authority.json에서 가져온 data들을 변수에 저장해서 foreach로 돌면 됨
      testData.govTestData.map(item => {
        list.push(
          <div className='authorityComp'>
            <div style={{ float: 'left', width: '19%', backgroundColor: '#FFEAF6' }}>
              <img src= {item.logo} alt='' width='100%' height='auto' />
            </div>
            <div style={{ padding: 30, paddingBottom: 0, float: 'left', width: '81%' }}>
              <div style={{ height: '70px' }}>
                <h2 style={{ float: 'left' }}>{item.title}</h2>
                <h4 style={{ float: 'right' }}>Address: {item.addr}</h4>
              </div>
              <div style={{ height: '80px' }}><p>{item.description}</p></div>

              <div style={{ height: '80px' }}>
                <div><h3><a href={item.homepage} target='_blank'>{item.title} Web site</a></h3></div>
                <div>
                  {this.getSNSList(item.sns)}
                  <Button
                    className='snsGroup'
                    href={item.homepage}
                    shape='circle'
                    ghost='true'
                    type='primary'
                  >
                    <i class="fas fa-home fa-2x"></i>
                  </Button>
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
        let icon = null;

        switch (key) {
          case 'twitter': icon = 'fab fa-twitter fa-2x'; break;
          case 'medium': icon = 'fab fa-medium fa-2x'; break;
          case 'facebook': icon = 'fab fa-facebook fa-2x'; break;
          case 'instagram': icon = 'fab fa-instagram fa-2x'; break;
          case 'telegram': icon = 'fab fa-telegram fa-2x'; break;
          case 'linkedin': icon = 'fab fa-linkedin fa-2x'; break;
        }

        sns.push(
          <Button
            className='snsGroup'
            href={snsList[key]}
            shape='circle'
            ghost='true'
            type='primary'>
            <i class={icon}></i>
          </Button>
        )
      }

      /* Reversed. */
      sns.reverse();

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

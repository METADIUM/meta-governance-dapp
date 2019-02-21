import React from 'react'
import { Button } from 'antd'
import './style/style.css'
import { getAuthorityLists } from '../util'
import { constants } from '../ethereum/constants'

class Authority extends React.Component {
    data = {
      authorityOriginData: [],
      authorityItems: []
    }

    state = {
      getAuthorityInfo: false
    }

    async componentDidMount () {
      this.data.ballotCnt = await this.props.contracts.gov.getBallotLength()
      this.getAuthorityList()
    }

    onApplyBtnClick () {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSfpSAevry4nqjljMACD1DhVzP8oU9J0OgvN49bGakofcZa49w/viewform?fbzx=2570300132786392930', '_blank')
    }

    async getAuthorityList () {
      let list = []
      this.data.authorityOriginData = await getAuthorityLists(constants.authorityRepo.org, constants.authorityRepo.repo, constants.authorityRepo.branch, constants.authorityRepo.source)

      this.data.authorityOriginData.map(item => {
        list.push(
          <div key={item.addr} className='authorityComp'>
            <div style={{ float: 'left', width: '19%', backgroundColor: '#FFEAF6' }}>
              <img src={item.logo} alt='' width='100%' height='auto' />
            </div>
            <div style={{ padding: 30, paddingBottom: 0, float: 'left', width: '81%' }}>
              <div style={{ height: '70px' }}>
                <h2 style={{ float: 'left' }}>{item.title}</h2>
                <h4 style={{ float: 'right' }}>Address: {item.addr}</h4>
              </div>
              <div style={{ height: '80px' }}><p>{item.description}</p></div>

              <div style={{ height: '80px' }}>
                <div>
                  {this.getSNSList(item.sns)}
                  <Button
                    className='snsGroup'
                    href={item.homepage}
                    shape='circle'
                    ghost='true'
                    type='primary'
                  >
                    <i className='fas fa-home fa-2x' />
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
        let icon = null

        switch (key) {
          case 'twitter': icon = 'fab fa-twitter fa-2x'; break
          case 'medium': icon = 'fab fa-medium fa-2x'; break
          case 'facebook': icon = 'fab fa-facebook fa-2x'; break
          case 'instagram': icon = 'fab fa-instagram fa-2x'; break
          case 'telegram': icon = 'fab fa-telegram fa-2x'; break
          case 'linkedin': icon = 'fab fa-linkedin fa-2x'; break
        }

        sns.push(
          <Button
            key={key}
            className='snsGroup'
            href={snsList[key]}
            shape='circle'
            ghost='true'
            type='primary'>
            <i className={icon} />
          </Button>
        )
      }

      /* Reversed. */
      sns.reverse()
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

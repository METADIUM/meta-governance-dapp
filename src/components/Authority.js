import React from 'react'
import { Button } from 'antd'
import './style/style.css'
import * as util from '../util'
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
      util.splitNodeDescription('6f8a80d14311c39f35f516fa664deaaaa13e85b2f7493f37f6144d86991ec012937307647bd3b9a82abe2974e1407241d54947bbb39763a4cac9f77166ad92a0@10.3.58.6:30303?discport=30301')
      this.data.ballotCnt = await this.props.contracts.gov.getBallotLength()
      this.getAuthorityList()
    }

    onApplyBtnClick () {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSfpSAevry4nqjljMACD1DhVzP8oU9J0OgvN49bGakofcZa49w/viewform?fbzx=2570300132786392930', '_blank')
    }

    breakLine (description) {
      var br = React.createElement('br')
      var regex = /(<br>)/g
      return description.split(regex).map((line, index) => line.match(regex) ? <br key={'key_' + index} /> : line)
    }

    onReadMoreClick (index) {
      console.log(index)
      this.getAuthorityList(index)
    }

    async getAuthorityList (index) {
      let list = []
      this.data.authorityOriginData = await util.getAuthorityLists(constants.authorityRepo.org, constants.authorityRepo.repo, constants.authorityRepo.branch, constants.authorityRepo.source)

      this.data.authorityOriginData.map((item, i) => {
        list.push(
          <div key={item.addr} className='authorityComp'>
            <div className='authorityComp_contnet'>
              <div className='img_container'>
                <img src={item.logo} alt='' />
              </div>
              <div className={i === index ? 'text_container long' : 'text_container short'}>
                <p className='title'>{item.title}</p>
                <p className='address'>Address: {item.addr}</p>
                <p className={'description'}>{this.breakLine(item.description)}</p>
                <div className='link_container'>
                  <a className='more' onClick={e => this.onReadMoreClick(i)}>+ Read More</a>
                  <div className='SNSList'>
                    {this.getSNSList(item.sns)}
                    <a
                      className='snsGroup'
                      href={item.homepage}>
                      <i className='fas fa-home fa-2x' />
                    </a>
                  </div>
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
          <a
            key={key}
            className='snsGroup'
            href={snsList[key]}>
            <i className={icon} />
          </a>
        )
      }

      /* Reversed. */
      sns.reverse()
      return sns
    }

    render () {
      return (
        <div className='background'>
          <div className='contentDiv'>
            <div className='apply_proposal_Btn_container'><Button className='apply_proposal_Btn' onClick={this.onApplyBtnClick}>Apply for Authority</Button></div>
            <div className='card_container'>
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

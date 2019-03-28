import React from 'react'

import { SubHeader } from './Nav'
import { AuthorityItem } from './AuthorityItem'
import { MiniLoader } from './BaseLoader'
import { constants } from '../constants'
import './style/style.css'

class Authority extends React.Component {
    data = {
      authorityItems: [],
      visibleAuthorityItems: []
    }

    state = {
      getAuthorityInfo: false
    }

    constructor (props) {
      super(props)
      this.onSearchBtnClick = this.onSearchBtnClick.bind(this)
      this.onReadMoreClick = this.onReadMoreClick.bind(this)
      this.getAuthorityList = this.getAuthorityList.bind(this)
      this.initAuthorityHeight = this.initAuthorityHeight.bind(this)

      this.descriptions = []
      this.readMoreBtns = []

      window.addEventListener('resize', this.initAuthorityHeight)
    }

    componentDidMount () {
      this.getAuthorityList()
    }

    componentDidUpdate () {
      this.initAuthorityHeight()
    }

    onSearchBtnClick (str) {
      str = str.toLowerCase()
      let authorityItems = []
      this.data.authorityItems.forEach((value) => {
        if ([value.props.item.title, value.props.item.addr].some(elem => elem.toLowerCase().indexOf(str) !== -1)) {
          authorityItems.push(value)
        }
      })
      this.data.visibleAuthorityItems = authorityItems
      this.setState({ getAuthorityInfo: true })
    }

    onApplyBtnClick () {
      // TODO: load URL from authorities.json
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSfpSAevry4nqjljMACD1DhVzP8oU9J0OgvN49bGakofcZa49w/viewform?fbzx=2570300132786392930', '_blank')
    }

    onReadMoreClick (index) {
      const element = this.descriptions[index]
      const btn = this.readMoreBtns[index]
      if (element.offsetHeight === constants.authoritieDescriptionHeight) {
        element.style.height = 'auto'
        btn.innerHTML = '- Read Less'
      } else {
        element.style.height = constants.authoritieDescriptionHeightToPixel
        btn.innerHTML = '+ Read More'
      }
    }

    breakLine (description) {
      var regex = /(<br>)/g
      return description.split(regex).map((line, index) => line.match(regex) ? <br key={'key_' + index} /> : line)
    }

    getSNSList (snsList) {
      let sns = []
      for (var key in snsList) {
        sns.push(<a key={key} className='snsGroup' href={snsList[key]}><i className={`fab fa-${key} fa-2x`} /></a>)
      }
      return sns
    }

    async getAuthorityList () {
      let list = []
      for (let i = 0; i < Object.keys(this.props.authorityOriginData).length; i++) {
        let item = this.props.authorityOriginData[i]
        let isMember = await this.props.contracts.governance.isMember(item.addr)
        if (isMember) {
          list.push(<AuthorityItem
            key={i}
            item={item}
            index={i}
            descriptions={this.descriptions}
            readMoreBtns={this.readMoreBtns}
            breakLine={this.breakLine}
            onReadMoreClick={this.onReadMoreClick}
            getSNSList={this.getSNSList} />
          )
        }
      }
      this.data.authorityItems = list
      this.data.visibleAuthorityItems = list
      await this.setState({ getAuthorityInfo: true })
    }

    initAuthorityHeight () {
      let index, description, readMoreBtn
      for (let i = 0; i < this.data.visibleAuthorityItems.length; i++) {
        index = this.data.visibleAuthorityItems[i].key
        description = this.descriptions[index]
        readMoreBtn = this.readMoreBtns[index]

        if (description.scrollHeight > constants.authoritieDescriptionHeight) {
          readMoreBtn.style.display = 'block'
        } else {
          readMoreBtn.style.display = 'none'
        }
      }
    }

    render () {
      return (
        <div className='background'>
          <SubHeader
            netName={this.props.netName}
            placeholder='Search by Authority Name, Adress'
            btnText='Apply for Authority'
            btnFunction={this.onApplyBtnClick}
            searchFunction={this.onSearchBtnClick}
          />

          <div className='contentDiv container'>
            <div className='card_container'>
              {this.state.getAuthorityInfo ? this.data.visibleAuthorityItems : <MiniLoader />}
            </div>
          </div>
        </div>
      )
    }
}
export { Authority }

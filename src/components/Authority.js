import React from 'react'

import { SubHeader, AuthorityItem, MiniLoader } from './'
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

  searchAuthority = (e) => {
    const str = e.target.value.toLowerCase()
    let authorityItems = []
    this.data.authorityItems.forEach((value) => {
      if ([value.props.item.title, value.props.item.addr].some(elem => elem.toLowerCase().indexOf(str) !== -1)) {
        authorityItems.push(value)
      }
    })
    this.data.visibleAuthorityItems = authorityItems
    this.setState({ getAuthorityInfo: true })
  }

  onApplyBtnClick = () => {
    // TODO: load URL from authorities.json
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfpSAevry4nqjljMACD1DhVzP8oU9J0OgvN49bGakofcZa49w/viewform?fbzx=2570300132786392930', '_blank')
  }

  onReadMoreClick = (index) => {
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
    return Object.keys(snsList)
      .map(key =>
        <a key={key} className='snsGroup' href={snsList[key]}>
          <i className={`fab fa-${key} fa-2x`} />
        </a>
      )
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
          getSNSList={this.getSNSList}
        />
        )
      }
    }
    this.data.authorityItems = list
    this.data.visibleAuthorityItems = list
    this.setState({ getAuthorityInfo: true })
  }

  initAuthorityHeight = () => {
    for (let i = 0; i < this.data.visibleAuthorityItems.length; i++) {
      let index = this.data.visibleAuthorityItems[i].key
      let description = this.descriptions[index]
      let readMoreBtn = this.readMoreBtns[index]

      if (!readMoreBtn || !readMoreBtn.style) {
        // Cannot modify style
      } else if (description.scrollHeight > constants.authoritieDescriptionHeight) {
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
          searchFunction={this.searchAuthority}
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

import React from 'react'
import { SubHeader } from './Nav'
import { AuthorityItem } from './AuthorityItem'
import './style/style.css'

class Authority extends React.Component {
    data = {
      authorityItems: new Map(),
      textContainers: new Map()
    }

    state = {
      visibleAuthorityItems: [],
      getAuthorityInfo: false
    }

    constructor (props) {
      super(props)
      this.onSearchBtnClick = this.onSearchBtnClick.bind(this)
      this.onReadMoreClick = this.onReadMoreClick.bind(this)
      this.getAuthorityList = this.getAuthorityList.bind(this)
    }

    componentDidMount () {
      this.getAuthorityList()
    }

    onSearchBtnClick(str) {
      str = str.toLowerCase()
      let authorityItems = []
      this.data.authorityItems.forEach((value) => {
        if(value.props.item.title.toLowerCase().indexOf(str) !== -1 || value.props.item.addr.toLowerCase().indexOf(str) !== -1) {
          authorityItems.push(value)
        }
      })
      this.setState({visibleAuthorityItems: authorityItems})
    }

    onApplyBtnClick () {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSfpSAevry4nqjljMACD1DhVzP8oU9J0OgvN49bGakofcZa49w/viewform?fbzx=2570300132786392930', '_blank')
    }

    onReadMoreClick(index) {
      if(!this.data.textContainers.get(index).className.includes('long')) this.data.textContainers.get(index).className = 'text_container flex-full flex-column long'
      else this.data.textContainers.get(index).className = 'text_container text_container flex-full flex-column'
    }

    breakLine(description) {
      var regex = /(<br>)/g
      return description.split(regex).map((line, index) => line.match(regex) ? <br key={'key_' + index} /> : line)
    }

    getSNSList(snsList) {
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
          default: break
        }
        sns.push(<a key={key} className='snsGroup' href={snsList[key]}> <i className={icon} /> </a>)
      }

      /* Reversed. */
      sns.reverse()
      return sns
    }

    async getAuthorityList() {
      let list = new Map()
      this.props.authorityOriginData.map(async (item, index) => {
        let isMember =  await this.props.contracts.gov.isMember(item.addr)
        if (isMember) {
          list.set(index, <AuthorityItem
            key={item.addr}
            item={item}
            index={index}
            textContainers={this.data.textContainers}
            breakLine={this.breakLine}
            onReadMoreClick={this.onReadMoreClick}
            getSNSList={this.getSNSList}/>
          )
        }

        this.data.authorityItems = new Map([...list.entries()].sort())
        this.setState({ getAuthorityInfo: true, visibleAuthorityItems: [...this.data.authorityItems.values()] })
      })
    }

    render() {
      return (
        <div className='background'>
          <SubHeader
            netid={this.props.netid}
            placeholder='Search by Authority Name, Adress'
            btnText='Apply for Authority'
            btnFunction={this.onApplyBtnClick}
            searchFunction={this.onSearchBtnClick} />
            
          <div className='contentDiv container'>
            <div className='card_container'>
              {this.state.getAuthorityInfo
                ? this.state.visibleAuthorityItems
                : <div>loading</div>
              }
            </div>
          </div>
        </div>
      )
    }
}
export { Authority }

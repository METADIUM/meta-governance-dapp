import React from 'react'
import './style/style.css'

const AuthorityItem = ({ item, index, textContainers, breakLine = f => f, onReadMoreClick = f => f, getSNSList = f => f }) =>
  <div className='authorityComp'>
    <div className='authorityComp_contnet flex'>
      <div className='img_container flex flex-center-horizontal'>
        <img src={item.logo} alt='' />
      </div>
      <div className='text_container flex-full flex-column' ref={ref => textContainers.set(index, ref)}>
        <p className='title text-exlarge text-heavy'>{item.title}</p>
        <p className='address text-small'>Address: {item.addr}</p>
        <p className='description flex-full'>{breakLine(item.description)}</p>
        <div className='link_container flex'>
          <a className='more' onClick={e => onReadMoreClick(index)}>+ Read More</a>
          <div className='SNSList flex-full flex'>
            {getSNSList(item.sns)}
            <a className='snsGroup' href={item.homepage}> <i className='fas fa-home fa-2x' /> </a>
          </div>
        </div>
      </div>
    </div>
  </div>

export { AuthorityItem }

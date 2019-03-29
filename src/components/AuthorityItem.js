import React from 'react'

import { shouldPass } from '../util'

import './style/style.css'

const AuthorityItem = ({
  item,
  index,
  descriptions,
  readMoreBtns,
  breakLine = shouldPass(),
  onReadMoreClick = shouldPass(),
  getSNSList = shouldPass()
}) =>
  <div className='authorityComp'>
    <div className='authorityComp_contnet flex'>
      <div className='img_container flex flex-center-horizontal'>
        <img src={item.logo} alt='' />
      </div>
      <div className='text_container flex-full flex-column'>
        <p className='title text-exlarge text-heavy'>{item.title}</p>
        <p className='address text-small'>Address: {item.addr}</p>
        <p className='description flex-full' ref={ref => { descriptions[index] = ref }}>{breakLine(item.description)}</p>
        <div className='link_container flex'>
          <span className='more' onClick={e => onReadMoreClick(index)} ref={ref => { readMoreBtns[index] = ref }}>+ Read More</span>
          <div className='SNSList flex-full flex'>
            {getSNSList(item.sns)}
            <a className='snsGroup' href={item.homepage}> <i className='fas fa-home fa-2x' /> </a>
          </div>
        </div>
      </div>
    </div>
  </div>

export { AuthorityItem }

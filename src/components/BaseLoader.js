import React from 'react'
import {Icon} from 'antd'

import './style/style.css'

const BaseLoader = () => {
  return (
    <div className='loading-container '>
      <div className='loading'>
        <div className='loading-i' />
        <div className='loading-i' />
        <div className='loading-i' />
        <div className='loading-i' />
        <div className='loading-i' />
        <div className='loading-i' />
      </div>
    </div>
  )
}

const MiniLoader = () =>
 <div className='mini-loader flex flex-center-vertical'>
   <Icon type="loading" />
 </div>


export { BaseLoader, MiniLoader }
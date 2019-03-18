import React from 'react'
import './style/style.css'

export const BaseLoader = () => {
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

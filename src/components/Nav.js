import React from 'react'
import { Button, Row, Menu, Input } from 'antd'
import './style/style.css'

const TopNav = ({ netid, nav, myBalance, myLockedBalance, onMenuClick = f => f, getStakingModal = f => f }) =>
  <Row className='container flex'>
    <div className='header-logo flex flex-center-horizontal'><img src={require(`../img/logo_header_${netid}.png`)} alt='' /></div>
    <div className={'header-menu center-vertical ' + netid}>
      <Menu
        className='flex flex-center-horizontal'
        onClick={onMenuClick}
        selectedKeys={[ nav ]}
        mode={'horizontal'}>
        <Menu.Item key='1' className={'text-large text-bold ' + netid}>Authority</Menu.Item>
        <Menu.Item key='2' className={'text-large text-bold ' + netid}>Voting</Menu.Item>
      </Menu>
    </div>
    <div className='header-staking flex flex-center-horizontal flex-end-vertical flex-full'>
      <div className='flex flex-full flex-column flex-center-vertical'>
        <p className={'staked ' + netid}>Staked {myBalance} META</p>
        <p className={'meta ' + netid}>(Locked {myLockedBalance} META)</p>
      </div>
      <Button className={'btn-grid-primary ' + netid} type='primary' onClick={getStakingModal}>META Staking</Button>
    </div>
  </Row>

const SubHeader = ({ netid, placeholder, condition = true, btnText, btnIcon = null, loading = false, searchFunction = f => f, btnFunction = f => f }) =>
  <div className='sub-header'>
    <div className={'functionDiv flex container ' + netid}>
      <Input.Search
        className='flex-full'
        placeholder={placeholder}
        onSearch={searchFunction}
        enterButton
      />
      <Button className='apply_proposal_Btn flex' disabled={!condition} onClick={e => btnFunction()} loading={loading}>
        <span>{btnIcon}</span>
        <span className='text_btn'>{btnText}</span>
      </Button>
    </div>
  </div>

const FootNav = ({ netid }) =>
  <Row className='container flex'>
    <p>Copyright © Since 2018 Metadium Technology, Inc. All rights reserved</p>
    <div className='flex flex-full'>
      <Button className='btn-img'><img src={require('../img/metadium_footer.png')} alt='' /></Button>
      <Button className='btn-img'><img src={require(`../img/explorer_footer_${netid}.png`)} alt='' /></Button>
      <Button className='btn-img'><img src={require('../img/github_footer.png')} alt='' /></Button>
    </div>
  </Row>

export { TopNav, SubHeader, FootNav }

import React from 'react'
import { Button, Row, Menu, Input, Affix } from 'antd'
import './style/style.css'

const TopNav = ({
  netName,
  nav,
  myBalance,
  myLockedBalance,
  onMenuClick = f => f,
  getStakingModal = f => f
}) =>
  <Row className='container flex'>
    <div className='header-logo flex flex-center-horizontal'>
      <img src={`/img/logo_header_${netName}.png`} alt='' />
    </div>
    <div className={'header-menu center-vertical ' + netName}>
      <Menu
        className='flex flex-center-horizontal'
        onClick={onMenuClick}
        selectedKeys={[ nav ]}
        mode={'horizontal'}>
        <Menu.Item key='1' className={'text-large text-bold ' + netName}>Authority</Menu.Item>
        <Menu.Item key='2' className={'text-large text-bold ' + netName}>Voting</Menu.Item>
      </Menu>
    </div>
    <div className='header-staking flex flex-center-horizontal flex-end-vertical flex-full'>
      <div className='flex flex-full flex-column flex-center-vertical'>
        <p className={'staked ' + netName}>Staked {myBalance} META</p>
        <p className={'meta ' + netName}>(Locked {myLockedBalance} META)</p>
      </div>
      <Button className={'btn-grid-primary ' + netName} type='primary' onClick={getStakingModal}>META Staking</Button>
    </div>
  </Row>

const SubHeader = ({
  netName,
  placeholder,
  condition = true,
  btnText,
  btnIcon = null,
  loading = false,
  searchFunction = f => f,
  btnFunction = f => f
}) =>
  <div className='sub-header'>
    <div className={'functionDiv flex container ' + netName}>
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

const SubNav = ({position, onClickSubMenu = f => f}) =>
  <Affix>
    <div className='sub-menu flex flex-center-vertical'>
      <Menu
        onClick={onClickSubMenu}
        selectedKeys={[position]}
        mode='horizontal'>
        <Menu.Item key='active'>Active</Menu.Item>
        <Menu.Item key='proposal'>Proposal</Menu.Item>
        <Menu.Item key='finalized'>Finalized</Menu.Item>
      </Menu>
    </div>
  </Affix>

const FootNav = ({ netName }) =>
  <Row className='container flex'>
    <p>Copyright © Since 2018 Metadium Technology, Inc. All rights reserved</p>
    <div className='flex flex-full'>
      <Button className='btn-img'><img src='/img/metadium_footer.png' alt='' /></Button>
      <Button className='btn-img'><img src={`/img/explorer_footer_${netName}.png`} alt='' /></Button>
      <Button className='btn-img'><img src='/img/github_footer.png' alt='' /></Button>
    </div>
  </Row>

export { TopNav, SubHeader, SubNav, FootNav }

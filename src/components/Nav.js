import React from 'react'
import { Button, Row, Menu } from 'antd'
import './style/style.css'

const TopNav = ({ nav, onMenuClick, showStakingModal=f=>f, balance, lockedBalance}) =>
    <Row>
        <div className="header-logo"><img src={require('../img/logo_header_white.png')} alt='' /><span>governance</span></div>
        <div className="header-menu">
        <Menu
            onClick={onMenuClick}
            selectedKeys={[ nav ]}
            mode={"horizontal"}>
            <Menu.Item key='1'>Authority</Menu.Item>
            <Menu.Item key='2'>Voting</Menu.Item>
        </Menu>
        </div>
        <div className="header-staking">
        <div>
            <p className="staked">Staked {balance} Meta</p>
            <p className="meta">(Locked {lockedBalance} META)</p>
        </div>
        <Button type="primary" onClick={ showStakingModal }>META Staking</Button>
        </div>
    </Row>

const FootNav = () =>
    <Row>
        <p>Copyright © Since 2018 Metadium Technology, Inc. All rights reserved</p>
        <div>
            <Button><img src={require('../img/logo_footer_black.png')} alt=''/></Button>
            <Button><img src={require('../img/block_footer_black.png')} alt=''/></Button>
            <Button><img src={require('../img/GitHub-Mark-32px.png')} alt=''/></Button>
        </div>
    </Row>

export { TopNav, FootNav }

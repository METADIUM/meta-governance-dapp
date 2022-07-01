import React from "react";
import { Button, Row, Menu, Input, Affix } from "antd";

import "./style/style.css";

const TopNav = ({
  netName,
  nav,
  isMember,
  myBalance,
  myLockedBalance,
  onMenuClick = (f) => f,
  getStakingModal = (f) => f,
}) => (
  <Row className="container flex">
    <div className="header-logo flex flex-center-horizontal">
      <img src={`/img/logo_header_${netName}.png`} alt="" />
    </div>
    <div className={"header-menu center-vertical " + netName}>
      <Menu
        className="flex flex-center-horizontal"
        onClick={onMenuClick}
        selectedKeys={[nav]}
        mode={"horizontal"}
      >
        <Menu.Item key="1" className={"text-large text-bold " + netName}>
          Authority
        </Menu.Item>
        <Menu.Item key="2" className={"text-large text-bold " + netName}>
          Voting
        </Menu.Item>
        {isMember && (
          <Menu.Item key="3" className={"text-large text-bold " + netName}>
            MyInfo
          </Menu.Item>
        )}
      </Menu>
    </div>
    <div className="header-staking flex flex-center-horizontal flex-end-vertical flex-full">
      <div className="flex flex-full flex-column flex-center-vertical">
        <p className={"staked " + netName}>Staked {myBalance} WEMIX</p>
        <p className={"wemix " + netName}>(Locked {myLockedBalance} WEMIX)</p>
      </div>
      <Button
        className={"btn-grid-primary " + netName}
        type="primary"
        onClick={getStakingModal}
      >
        WEMIX Staking
      </Button>
    </div>
  </Row>
);

// TODO Wemix apply form 생기면 추가할 예정
const SubHeader = ({
  netName,
  placeholder,
  condition = true,
  btnText,
  btnIcon = null,
  loading = false,
  searchFunction = (f) => f,
  btnFunction = (f) => f,
}) => (
  <div className="sub-header">
    <div className={"functionDiv flex container " + netName}>
      <Input.Search
        className="flex-full"
        placeholder={placeholder}
        onChange={searchFunction}
        enterButton
      />
      {/* <Button
        className="apply_proposal_Btn flex flex-center-horizontal"
        disabled={!condition}
        onClick={(e) => btnFunction()}
        loading={loading}
      >
        <span>{btnIcon}</span>
        <span className="text_btn">{btnText}</span>
      </Button> */}
    </div>
  </div>
);

const SubNav = ({ position, onClickSubMenu = (f) => f }) => (
  <Affix>
    <div className="sub-menu flex flex-center-vertical">
      <Menu
        onClick={onClickSubMenu}
        selectedKeys={[position]}
        mode="horizontal"
      >
        <Menu.Item key="active">Active</Menu.Item>
        <Menu.Item key="proposal">Proposal</Menu.Item>
        <Menu.Item key="finalized">Finalized</Menu.Item>
      </Menu>
    </div>
  </Affix>
);

const FootNav = ({ netName, onClickFootIcon }) => (
  <Row className="container flex">
    <p>WEMIX PTE. LTD. © WEMIX PTE. LTD. All Rights Reserved.</p>
    <div className="flex flex-full">
      <Button className="btn-img" onClick={onClickFootIcon}>
        <img src="/img/wemix_footer.png" alt="wemix" key="wemix" />
      </Button>
      <Button className="btn-img" onClick={onClickFootIcon}>
        <img
          src={`/img/explorer_footer_${netName}.png`}
          alt="explorer"
          key="explorer"
        />
      </Button>
      <Button className="btn-img" onClick={onClickFootIcon}>
        <img src="/img/github_footer.png" alt="github" key="github" />
      </Button>
    </div>
  </Row>
);

export { TopNav, SubHeader, SubNav, FootNav };

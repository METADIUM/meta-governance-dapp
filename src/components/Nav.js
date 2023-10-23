import React, { useEffect, useState } from "react";
import { Button, Row, Menu, Input, Affix } from "antd";

import "./style/style.css";
import WalletButton from "./WalletButton";
import { ConnectWalletModal, DisConnectWalletModal, ErrModal } from "./Modal";
// import { web3Modal } from '../web3Modal'
import { chainInfo, web3Instance } from "../web3";
import { walletTypes } from "../constants";
import ConnectWalletPage from "./ConnectWalletPage";
import { hexToNumberJs } from "../util";

// TODO Wemix apply form 생기면 아래 코드 수정 필요
const SubHeader = ({
  netName,
  placeholder,
  condition = true,
  btnText,
  selectedMenu,
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
      {selectedMenu !== "1" && (
        <Button
          className="apply_proposal_Btn flex flex-center-horizontal"
          disabled={!condition}
          onClick={(e) => btnFunction()}
          loading={loading}
        >
          <span>{btnIcon}</span>
          <span className="text_btn">{btnText}</span>
        </Button>
      )}
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

export { SubHeader, SubNav };

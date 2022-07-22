import React from "react";
import { Button, Modal, Input, Select, Icon, Slider } from "antd";

import { convertSecondsToDay } from "../util";

import "./style/style.css";

const Option = Select.Option;

const StakingModal = ({
  netName,
  isMember,
  accountBalance,
  stakingModalVisible,
  loading,
  stakingAmount,
  errStakging,
  stakingTopic,
  hideStakingModal = (f) => f,
  submitWemixStaking = (f) => f,
  handleInputChange = (f) => f,
  handleSelectChange = (f) => f,
}) => (
  <Modal
    className="stakingModal"
    title="WEMIX Staking"
    visible={stakingModalVisible}
    onCancel={hideStakingModal}
    footer={[
      <Button key="cancel" onClick={hideStakingModal}>
        cancel
      </Button>,
      <Button
        key="submit"
        className={"btn-fill-primary " + netName}
        type="primary"
        onClick={submitWemixStaking}
        loading={loading}
      >
        Submit
      </Button>,
    ]}
  >
    <Select
      value={stakingTopic}
      onChange={handleSelectChange}
      disabled={loading}
    >
      <Option value="deposit">
        {isMember ? "Additional" : "Deposit"} Staking
      </Option>
      <Option value="withdraw">Withdraw Staking</Option>
    </Select>
    <Input
      onChange={handleInputChange}
      placeholder="WEMIX Amount"
      addonAfter="WEMIX"
      value={stakingAmount}
      className={errStakging ? "errInput" : ""}
      disabled={loading}
    />
    <p className={errStakging ? "errHint" : "errHint-hide"}>Invalid Amount</p>
    <div className="text-container">
      <p className="staked">Staked {accountBalance.balance} WEMIX </p>
      <p className="locked text-small">
        (Locked {accountBalance.lockedBalance} WEMIX)
      </p>
    </div>
  </Modal>
);

const ErrModal = ({
  netName,
  title,
  err,
  link,
  visible,
  coloseErrModal = (f) => f,
}) => {
  const RPCErrorMSG = () => (
    <div>
      <p>Ensure the network has been added correctly.</p>
      <p>Ensure you have enough coins to pay for gas.</p>
      <p>
        Ensure you are using the latest version of the app or the extension.
      </p>
    </div>
  );

  return (
    <Modal
      className="errorModal"
      title={title}
      visible={visible}
      onCancel={coloseErrModal}
      footer={
        link
          ? [
              <a
                key="link"
                href={link}
                rel="noopener noreferrer"
                target="_blank"
                className="ant-btn"
              >
                Checking on the Explorer
              </a>,
              <Button
                type="primary"
                key="ok"
                className={"btn-fill-primary " + netName}
                onClick={coloseErrModal}
              >
                Okay
              </Button>,
            ]
          : [
              <Button
                type="primary"
                key="ok"
                className={"btn-fill-primary " + netName}
                onClick={coloseErrModal}
              >
                Okay
              </Button>,
            ]
      }
    >
      <p className="text-bold">Please revises the following information!</p>
      <div className="text-container">
        <div className="flex error-icon">
          <Icon type="exclamation-circle" />
          <div>{err === "RPC error" ? <RPCErrorMSG /> : err}</div>
        </div>
      </div>
    </Modal>
  );
};

const AccessFailedModal = ({ visible, message }) => (
  <Modal
    className="accessFail"
    title="Access Failed"
    visible={visible}
    footer={null}
  >
    <Icon type="close-circle" />
    <p className="text-bold">{message}</p>
  </Modal>
);

const ChangeModal = ({
  updateModal,
  ballotUpdateDuration,
  votingDurationMin,
  votingDurationMax,
  completeModal = (f) => f,
  hideChangeModal = (f) => f,
  sliderChange = (f) => f,
}) => {
  const min = convertSecondsToDay(votingDurationMin);
  const max = convertSecondsToDay(votingDurationMax);

  return (
    <Modal
      title="Voting Duration Change"
      visible={updateModal}
      onOk={completeModal}
      onCancel={hideChangeModal}
    >
      <p className="changeDay flex flex-center-vertical">
        {ballotUpdateDuration} days
      </p>
      <Slider
        marks={{
          [min]: min + " days",
          [ballotUpdateDuration]: ballotUpdateDuration + " days",
          [max]: max + " days",
        }}
        min={min}
        max={max}
        defaultValue={ballotUpdateDuration}
        tooltipVisible={false}
        onChange={sliderChange}
      />
    </Modal>
  );
};

const ConnectWalletModal = ({ children, visible, setWalletModal }) => {
  return (
    <Modal
      visible={visible}
      title={"Wallet Connect"}
      onCancel={setWalletModal}
      footer={null}
    >
      {children}
    </Modal>
  );
};

const DisConnectWalletModal = ({
  onDisConnect,
  visible,
  setDisConnectView,
}) => {
  return (
    <Modal
      className="dis-connect-foot"
      visible={visible}
      title={"Disconnect"}
      onCancel={() => setDisConnectView(false)}
      onOk={onDisConnect}
      footer={[
        <Button
          key="cancel"
          className="discon-cancel-btn"
          onClick={() => setDisConnectView(false)}
        >
          Cancel
        </Button>,
        <Button key="ok" className="discon-ok-btn" onClick={onDisConnect}>
          Okay
        </Button>,
      ]}
    >
      <p className="modal-disconnect-title">Disconnect your Wallet?</p>
    </Modal>
  );
};

export {
  StakingModal,
  ErrModal,
  AccessFailedModal,
  ChangeModal,
  ConnectWalletModal,
  DisConnectWalletModal,
};

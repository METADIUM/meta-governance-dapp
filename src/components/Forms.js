import React from "react";
import { Button, Input, Form, Icon, Select } from "antd";

import { shouldPass } from "../util";

const { TextArea } = Input;
const { Option } = Select;

// components for communicating common props
export const PassesCommonProps = ({
  netName,
  loading,
  handleSubmit,
  handleChange,
  votingDurationMax,
  votingDurationMin,
  children,
}) => {
  return (
    <>
      {React.cloneElement(children, {
        netName,
        loading,
        handleSubmit,
        handleChange,
        votingDurationMax,
        votingDurationMin,
      })}
    </>
  );
};

// voting duration and submit button
const ProposalFormFooter = ({
  netName,
  loading,
  disabled,
  votingDurationMin,
  votingDurationMax,
  handleChange = shouldPass(),
}) => {
  // option component
  const selectOption = () => {
    let comp = [];
    for (let op = votingDurationMin; op <= votingDurationMax; op++) {
      comp.push(
        <Select.Option key={op} value={`votDuration_${op}`}>
          {op}
        </Select.Option>
      );
    }
    return comp;
  };
  return (
    <>
      <div className="divider flex flex-end-vertical mt-16">
        <div className="flex-half flex-end-vertical flex-column mr-0">
          <Form.Item>
            <label className="subtitle mt-0 flex-align-self-center">
              Voting Duration
            </label>
            <Select
              defaultValue={votingDurationMin}
              name="votDuration"
              disabled={loading}
              className="mg-rl-15"
              style={{ width: 180 }}
              onChange={handleChange}
            >
              {selectOption()}
            </Select>
            <span>day</span>
          </Form.Item>
        </div>
      </div>
      <Form.Item>
        <div className="submitDiv flex">
          {disabled}
          <Button
            name="submit"
            htmlType="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            disabled={disabled}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </>
  );
};

// Add Authority Member
export const AddProposalForm = ({
  netName,
  loading,
  newAddrErr,
  newNameErr,
  stakingMin,
  newLockAmount,
  newLockAmountErr,
  newNodeErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <p className="subtitle">
        New Authority Address <span className="required">*</span>
      </p>
      <Form.Item>
        <Input
          name="newAddr"
          className={newAddrErr ? "errInput" : ""}
          disabled={loading}
          onChange={handleChange}
        />
        <p className={newAddrErr ? "errHint" : "errHint-hide"}>
          Invalid Address
        </p>
      </Form.Item>

      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>
          When registering the first Authority Address, the Staking Address,
          Voting Address, and Reward Address are the same.
        </p>
      </div>

      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            Node Name <span className="required">*</span>
          </p>
          <Form.Item>
            <Input
              name="newName"
              className={newNameErr ? "errInput" : ""}
              disabled={loading}
              onChange={handleChange}
            />
            <p className={newNameErr ? "errHint" : "errHint-hide"}>
              Invalid Name
            </p>
          </Form.Item>
        </div>
        <div className="flex-full">
          <p className="subtitle">
            WEMIX Amount to be locked <span className="required">*</span>
          </p>
          <Form.Item>
            <Input
              name="newLockAmount"
              addonAfter="WEMIX"
              defaultValue={stakingMin}
              value={newLockAmount || ""}
              className={newLockAmountErr ? "errInput" : ""}
              disabled={loading}
              onChange={handleChange}
            />
            <p className={newLockAmountErr ? "errHint" : "errHint-hide"}>
              Invalid Amount
            </p>
          </Form.Item>
        </div>
      </div>
      <p className="subtitle">
        New Authority Node Description <span className="required">*</span>
      </p>
      <Form.Item>
        <Input
          name="newNode"
          placeholder="6f8a80d1....66ad92a0@10.3.58.6:30303"
          className={newNodeErr ? "errInput" : ""}
          disabled={loading}
          onChange={handleChange}
        />
        <p className={newNodeErr ? "errHint" : "errHint-hide"}>Invalid Node</p>
      </Form.Item>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>
          The hexadecimal node ID is encoded in the username portion of the URL,
          separated from the host by an @ sign. The hostname can only be given
          as an IP address, DNS domain names are not allowed. The port in the
          host name section is the TCP listening port.
        </p>
      </div>
      <p className="subtitle">Description</p>
      <Form.Item>
        <TextArea
          name="memo"
          placeholder="Max. 256 bytes"
          rows={4}
          autoSize={{ minRows: 4, maxRows: 4 }}
          disabled={loading}
          onChange={handleChange}
        />
      </Form.Item>
      <ProposalFormFooter
        netName={netName}
        loading={loading}
        disabled={newLockAmountErr || newAddrErr || newNodeErr || newNameErr}
        votingDurationMin={votingDurationMin}
        votingDurationMax={votingDurationMax}
        handleChange={handleChange}
      />
    </Form>
  </div>
);

export const ReplaceProposalForm = ({
  netName,
  loading,
  stakingMin,
  votingAddrErr,
  stakingAddrErr,
  rewardAddrErr,
  newAddrErr,
  newNameErr,
  newLockAmountErr,
  newLockAmount,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <p className="subtitle">
        Old Authority Address <span className="required">*</span>
      </p>
      <div className="bor-box pd-rl-24 pd-tb-24 mt-16">
        <Form.Item className="mt-0">
          <p className="subtitle mt-0">Voting Address</p>
          <Input
            name="votingAddr"
            className={"mt-5" + (votingAddrErr ? " errInput" : "")}
            disabled={loading}
            onChange={handleChange}
          />
          <p className={votingAddrErr ? "errHint" : "errHint-hide"}>
            Invalid Address
          </p>
        </Form.Item>
        <Form.Item>
          <p className="subtitle mt-0">Staking Address</p>
          <Input
            name="stakingAddr"
            className={"mt-5" + (stakingAddrErr ? " errInput" : "")}
            disabled={loading}
            onChange={handleChange}
          />
          <p className={stakingAddrErr ? "errHint" : "errHint-hide"}>
            Invaild Address
          </p>
        </Form.Item>
        <Form.Item>
          <p className="subtitle mt-0">Reward Address</p>
          <Input
            name="rewardAddr"
            className={"mt-5" + (stakingAddrErr ? " errInput" : "")}
            disabled={loading}
            onChange={handleChange}
          />
          <p className={rewardAddrErr ? "errHint" : "errHint-hide"}>
            Invaild Address
          </p>
        </Form.Item>
      </div>
      <p className="subtitle">
        New Authority Address <span className="required">*</span>
      </p>
      <Form.Item>
        <Input
          name="newAddr"
          onChange={handleChange}
          className={newAddrErr ? "errInput" : ""}
          disabled={loading}
        />
        <p className={newAddrErr ? "errHint" : "errHint-hide"}>
          Invalid Address
        </p>
      </Form.Item>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            Node Name <span className="required">*</span>
          </p>
          <Form.Item>
            <Input
              name="newName"
              onChange={handleChange}
              className={newNameErr ? "errInput" : ""}
              disabled={loading}
            />
            <p className={newNameErr ? "errHint" : "errHint-hide"}>
              Invalid Name
            </p>
          </Form.Item>
        </div>
        <div className="flex-full">
          <p className="subtitle">
            Replace WEMIX Amount <span className="required">*</span>
          </p>
          <Form.Item>
            <Input
              addonAfter="WEMIX"
              name="newLockAmount"
              defaultValue={stakingMin}
              value={newLockAmount || ""}
              onChange={handleChange}
              className={newLockAmountErr ? "errInput" : ""}
              disabled={loading}
            />
            <p className={newLockAmountErr ? "errHint" : "errHint-hide"}>
              Invalid Amount
            </p>
          </Form.Item>
        </div>
      </div>
      <p className="subtitle">Description </p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder="Max. 256 bytes"
          autoSize={{ minRows: 4, maxRows: 4 }}
          name="memo"
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <ProposalFormFooter
        netName={netName}
        loading={loading}
        disabled={
          votingAddrErr ||
          stakingAddrErr ||
          rewardAddrErr ||
          newLockAmountErr ||
          newAddrErr ||
          newNameErr
        }
        votingDurationMin={votingDurationMin}
        votingDurationMax={votingDurationMax}
        handleChange={handleChange}
      />
    </Form>
  </div>
);

export const RmoveProposalForm = ({
  netName,
  loading,
  showLockAmount,
  stakingMin,
  stakingAddrErr,
  oldLockAmountErr,
  oldLockAmount,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
  getLockAmount = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <p className="subtitle">
        Address to be removed <span className="required">*</span>
      </p>
      <div className="bor-box pd-rl-24 pd-tb-24 mt-16">
        <Form.Item className="mt-0">
          <p className="subtitle mt-0">Staking Address</p>
          <Input.Search
            name="stakingAddr"
            onChange={handleChange}
            className={"mt-5" + (stakingAddrErr ? " errInput" : "")}
            disabled={loading}
            enterButton={
              <span>
                <Icon type="search" />
                <span> Check Balance</span>
              </span>
            }
            onSearch={(value) => getLockAmount(value)}
          />
          <p className={stakingAddrErr ? "errHint" : "errHint-hide"}>
            Invalid Address
          </p>
        </Form.Item>
      </div>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">Locked WEMIX Amount</p>
          <Form.Item>
            <Input
              name="showLockAmount"
              value={showLockAmount}
              addonAfter="WEMIX"
              disabled
            />
          </Form.Item>
        </div>
        <div className="flex-full">
          <p className="subtitle">
            WEMIX Amount to be unlocked <span className="required">*</span>
          </p>
          <Form.Item>
            <Input
              addonAfter="WEMIX"
              name="oldLockAmount"
              defaultValue={stakingMin}
              value={oldLockAmount || ""}
              onChange={handleChange}
              className={oldLockAmountErr ? "errInput" : ""}
              disabled={loading}
            />
            <p className={oldLockAmountErr ? "errHint" : "errHint-hide"}>
              Invalid Amount
            </p>
          </Form.Item>
        </div>
      </div>
      <p className="subtitle">Description</p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder="Max. 256 bytes"
          autoSize={{ minRows: 4, maxRows: 4 }}
          name="memo"
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <ProposalFormFooter
        netName={netName}
        loading={loading}
        disabled={stakingAddrErr}
        votingDurationMin={votingDurationMin}
        votingDurationMax={votingDurationMax}
        handleChange={handleChange}
      />
    </Form>
  </div>
);

// Governance Contract Address
export const GovernanceContractAddressForm = ({
  netName,
  loading,
  newGovAddrErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <p className="subtitle">
        New Governance Contract Address <span className="required">*</span>
      </p>
      <Form.Item>
        <Input
          type="primary"
          name="newGovAddr"
          className={newGovAddrErr ? "errInput" : ""}
          disabled={loading}
          onChange={handleChange}
        />
        <p className={newGovAddrErr ? "errHint" : "errHint-hide"}>
          Invalid Address
        </p>
      </Form.Item>
      <p className="subtitle">Description</p>
      <Form.Item>
        <TextArea
          name="memo"
          placeholder="Max. 256 bytes"
          rows={4}
          autoSize={{ minRows: 4, maxRows: 4 }}
          maxLength={256}
          disabled={loading}
          onChange={handleChange}
        />
      </Form.Item>
      <ProposalFormFooter
        netName={netName}
        loading={loading}
        disabled={newGovAddrErr}
        votingDurationMin={votingDurationMin}
        votingDurationMax={votingDurationMax}
        handleChange={handleChange}
      />
    </Form>
  </div>
);

export const VotingDurationSetting = ({
  netName,
  loading,
  votDurationErr,
  votDurationMin,
  votDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            Voting Duration Setting <span className="required">*</span>
          </p>
          <div className="flex-column">
            <div className="flex-full flex-row">
              <Form.Item>
                <label className="subtitle mt-0 flex-align-self-center w-25">
                  Min
                </label>
                <Input
                  name="votDurationMin"
                  defaultValue="1"
                  value={votDurationMin}
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15" + (votDurationErr ? " errInput" : "")
                  }
                  disabled={loading}
                />
                <span>day</span>
              </Form.Item>
            </div>
            <div className="flex-full flex-row mt-5">
              <Form.Item>
                <label className="subtitle mt-0 flex-align-self-center w-25">
                  Max
                </label>
                <Input
                  name="votDurationMax"
                  defaultValue="7"
                  value={votDurationMax}
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15" + (votDurationErr ? " errInput" : "")
                  }
                  disabled={loading}
                />
                <span>day</span>
              </Form.Item>
            </div>
            <p
              className={
                "mt-5 ml-40" + (votDurationErr ? " errHint" : " errHint-hide")
              }
            >
              {`${
                votDurationErr === "min"
                  ? "Invalid Min Date Setting"
                  : votDurationErr === "max"
                  ? "Invalid Max Date Setting"
                  : "Invalid Duration Setting"
              }`}
            </p>
          </div>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>The minimum value for Voting Duration is 1 day.</p>
      </div>
      <p className="subtitle">Description</p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder="Max. 256 bytes"
          autoSize={{ minRows: 4, maxRows: 4 }}
          name="memo"
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <div className="divider flex flex-end-vertical mt-16">
        <div className="flex-half flex-end-vertical flex-column mr-0">
          <Form.Item>
            <label className="subtitle mt-0 flex-align-self-center">
              Voting Duration
            </label>
            <Select
              defaultValue={3}
              name="votDuration"
              disabled={loading}
              className="mg-rl-15"
              style={{ width: 180 }}
              onChange={handleChange}
            >
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
            </Select>
            <span>day</span>
          </Form.Item>
        </div>
      </div>
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            name="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            htmlType="submit"
            disabled={votDurationErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

export const AuthorityMemberStakingAmount = ({
  netName,
  loading,
  AuthMemSkAmountErr,
  AuthMemSkAmountMin,
  AuthMemSkAmountMax,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            Staking Amount <span className="required">*</span>
          </p>
          <div className="flex-column">
            <div className="flex-full flex-row">
              <Form.Item>
                <label className="subtitle mt-0 flex-align-self-center w-25">
                  Min
                </label>
                <Input
                  name="AuthMemSkAmountMin"
                  value={AuthMemSkAmountMin}
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15" + (AuthMemSkAmountErr ? " errInput" : "")
                  }
                  disabled={loading}
                />
                <span>WEMIX</span>
              </Form.Item>
            </div>
            <div className="flex-full flex-row mt-5">
              <Form.Item>
                <label className="subtitle mt-0 flex-align-self-center w-25">
                  Max
                </label>
                <Input
                  name="AuthMemSkAmountMax"
                  value={AuthMemSkAmountMax}
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15" + (AuthMemSkAmountErr ? " errInput" : "")
                  }
                  disabled={loading}
                />
                <span>WEMIX</span>
              </Form.Item>
            </div>
          </div>
          <p
            className={
              "mt-5 ml-40" + (AuthMemSkAmountErr ? " errHint" : " errHint-hide")
            }
          >
            {`${
              AuthMemSkAmountErr === "min"
                ? "Invalid Min Amount"
                : AuthMemSkAmountErr === "max"
                ? "Invalid Max Amout"
                : "Invalid Staking Amount"
            }`}
          </p>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>The maximum amount of staking that can be set is 4,980,000 WEMIX.</p>
      </div>
      <p className="subtitle">Description</p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder="Max. 256 bytes"
          autoSize={{ minRows: 4, maxRows: 4 }}
          name="memo"
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <div className="divider flex flex-end-vertical mt-16">
        <div className="flex-half flex-end-vertical flex-column mr-0">
          <Form.Item>
            <label className="subtitle mt-0 flex-align-self-center">
              Voting Duration
            </label>
            <Select
              defaultValue={3}
              name="votDuration"
              disabled={loading}
              className="mg-rl-15"
              style={{ width: 180 }}
              onChange={handleChange}
            >
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
            </Select>
            <span>day</span>
          </Form.Item>
        </div>
      </div>
      <ProposalFormFooter
        netName={netName}
        loading={loading}
        disabled={AuthMemSkAmountErr}
        votingDurationMin={votingDurationMin}
        votingDurationMax={votingDurationMax}
        handleChange={handleChange}
      />
    </Form>
  </div>
);

export const BlockCreationTime = ({
  netName,
  loading,
  newBlockCreation,
  blockCreationErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            Block Creation Time <span className="required">*</span>
          </p>
          <Form.Item>
            <div className="flex-column">
              <div className="flex-full flex-row">
                <Input
                  name="newBlockCreation"
                  value={newBlockCreation}
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15 ml-0" +
                    (blockCreationErr ? " errInput" : "")
                  }
                  disabled={loading}
                />
                <span className="align-bottom-next-to-input">s</span>
              </div>
            </div>
            <p className={blockCreationErr ? "errHint" : "errHint-hide"}>
              Invalid Block Creation Time
            </p>
          </Form.Item>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>Block Creation time is possible from at least 0.1s.</p>
      </div>
      <p className="subtitle">Description</p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder="Max. 256 bytes"
          autoSize={{ minRows: 4, maxRows: 4 }}
          name="memo"
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <div className="divider flex flex-end-vertical mt-16">
        <div className="flex-half flex-end-vertical flex-column mr-0">
          <Form.Item>
            <label className="subtitle mt-0 flex-align-self-center">
              Voting Duration
            </label>
            <Select
              defaultValue={3}
              name="votDuration"
              disabled={loading}
              className="mg-rl-15"
              style={{ width: 180 }}
              onChange={handleChange}
            >
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
            </Select>
            <span>day</span>
          </Form.Item>
        </div>
      </div>
      <ProposalFormFooter
        netName={netName}
        loading={loading}
        disabled={blockCreationErr}
        votingDurationMin={votingDurationMin}
        votingDurationMax={votingDurationMax}
        handleChange={handleChange}
      />
    </Form>
  </div>
);

export const BlockRewardAmount = ({
  netName,
  loading,
  newBlockRewardAmount,
  blockRewardErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            Block Reward Amount <span className="required">*</span>
          </p>
          <Form.Item>
            <div className="flex-column">
              <div className="flex-full flex-row">
                <Input
                  name="newBlockRewardAmount"
                  value={newBlockRewardAmount}
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15 ml-0" + (blockRewardErr ? " errInput" : "")
                  }
                  disabled={loading}
                />
                <span>WEMIX/Block</span>
              </div>
            </div>
            <p className={blockRewardErr ? "errHint" : "errHint-hide"}>
              Invalid Block Reward Amount
            </p>
          </Form.Item>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>Block Rewards are available from at least 1WEMIX/Block.</p>
      </div>
      <p className="subtitle">Description</p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder="Max. 256 bytes"
          autoSize={{ minRows: 4, maxRows: 4 }}
          name="memo"
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <ProposalFormFooter
        netName={netName}
        loading={loading}
        disabled={blockRewardErr}
        votingDurationMin={votingDurationMin}
        votingDurationMax={votingDurationMax}
        handleChange={handleChange}
      />
    </Form>
  </div>
);

export const BlockRewardDistributionMethod = ({
  netName,
  loading,
  blockRate1,
  blockRate2,
  blockRate3,
  blockRate4,
  blockRateTotal,
  blockRewardDisMthErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <div className="divider flex">
        <div className="flex-full mr-0">
          <p className="subtitle">
            Distribution Rate <span className="required">*</span>
          </p>
          <div className="bor-box pd-rl-24 pd-tb-24">
            <div className="flex-full flex-row">
              <div className="flex-column w-15per">
                <Form.Item label="Block Producer">
                  <Input
                    name="blockRate1"
                    value={blockRate1}
                    addonAfter="%"
                    onChange={handleChange}
                    className={
                      "w-100 mg-rl-5 ml-0" +
                      (blockRewardDisMthErr ? " errInput" : "")
                    }
                    disabled={loading}
                  />
                </Form.Item>
              </div>
              <span className="sign pb-8">+</span>
              <div className="flex-column w-15per">
                <Form.Item label="Staking Reward">
                  <Input
                    name="blockRate2"
                    value={blockRate2}
                    addonAfter="%"
                    onChange={handleChange}
                    className={
                      "mg-rl-5" + (blockRewardDisMthErr ? " errInput" : "")
                    }
                    disabled={loading}
                  />
                </Form.Item>
              </div>
              <span className="sign pb-8">+</span>
              <div className="flex-column w-15per">
                <Form.Item label="Ecosystem">
                  <Input
                    name="blockRate3"
                    value={blockRate3}
                    addonAfter="%"
                    onChange={handleChange}
                    className={
                      "mg-rl-5" + (blockRewardDisMthErr ? " errInput" : "")
                    }
                    disabled={loading}
                  />
                </Form.Item>
              </div>
              <span className="sign pb-8">+</span>
              <div className="flex-column w-15per">
                <Form.Item label="Maintenance">
                  <Input
                    name="blockRate4"
                    value={blockRate4}
                    addonAfter="%"
                    onChange={handleChange}
                    className={
                      "mg-rl-5" + (blockRewardDisMthErr ? " errInput" : "")
                    }
                    disabled={loading}
                  />
                </Form.Item>
              </div>
              <span className="sign pb-8">=</span>
              <div className="flex-column w-auto">
                <Form.Item label="Sum">
                  <Input
                    name="blockRateTotal"
                    value={blockRateTotal}
                    addonAfter="%"
                    onChange={handleChange}
                    className={
                      "w-auto mg-rl-5" +
                      (blockRewardDisMthErr ? " errInput" : "")
                    }
                    disabled
                    readOnly
                  />
                </Form.Item>
              </div>
            </div>
            <p className={blockRewardDisMthErr ? "errHint" : "errHint-hide"}>
              Only numbers can be entered, and Sum must be 100.
            </p>
          </div>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>
          For the Block reward distribution rate, the sum of Default, Block
          Producer, Ecosystem, and Maintenance should be 100.
        </p>
      </div>
      <p className="subtitle">Description</p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder="Max. 256 bytes"
          autoSize={{ minRows: 4, maxRows: 4 }}
          name="memo"
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <ProposalFormFooter
        netName={netName}
        loading={loading}
        disabled={blockRewardDisMthErr}
        votingDurationMin={votingDurationMin}
        votingDurationMax={votingDurationMax}
        handleChange={handleChange}
      />
    </Form>
  </div>
);

export const ChangeOfMaxPriorityFeePerGas = ({
  netName,
  loading,
  maxPriorityFeePerGasErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            MaxPriorityFeePerGas <span className="required">*</span>
          </p>
          <Form.Item>
            <div className="flex-column">
              <div className="flex-full flex-row">
                <Input
                  name="maxPriorityFeePerGas"
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15 ml-0" +
                    (maxPriorityFeePerGasErr ? " errInput" : "")
                  }
                  disabled={loading}
                />
                <span>GWei</span>
              </div>
            </div>
            <p className={maxPriorityFeePerGasErr ? "errHint" : "errHint-hide"}>
              Invalid MaxPriorityFeePerGas
            </p>
          </Form.Item>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>Specifies the fee returned to the miner</p>
      </div>
      <p className="subtitle">Description</p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder="Max. 256 bytes"
          autoSize={{ minRows: 4, maxRows: 4 }}
          name="memo"
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <ProposalFormFooter
        netName={netName}
        loading={loading}
        disabled={maxPriorityFeePerGasErr}
        votingDurationMin={votingDurationMin}
        votingDurationMax={votingDurationMax}
        handleChange={handleChange}
      />
    </Form>
  </div>
);

export const GasLimitForm = ({
  netName,
  loading,
  gasLimitErr,
  baseFeeDenominatorErr,
  ElasticityErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            Gas Limit <span className="required">*</span>
          </p>
          <Form.Item>
            <div className="flex-column">
              <div className="flex-full flex-row">
                <Input
                  name="gasLimit"
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15 ml-0" + (gasLimitErr ? " errInput" : "")
                  }
                  disabled={loading}
                />
                <span>GWei</span>
              </div>
            </div>
            <p className={gasLimitErr ? "errHint" : "errHint-hide"}>
              Invalid Limit
            </p>
          </Form.Item>
          <p className="subtitle">
            BaseFee Max Change Denominator <span className="required">*</span>
          </p>
          <Form.Item>
            <div className="flex-column">
              <div className="flex-full flex-row">
                <Input
                  name="baseFeeDenominator"
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15 ml-0" +
                    (baseFeeDenominatorErr ? " errInput" : "")
                  }
                  disabled={loading}
                />
              </div>
            </div>
            <p className={baseFeeDenominatorErr ? "errHint" : "errHint-hide"}>
              Invalid value
            </p>
          </Form.Item>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>Specifies how full the block must ne to increase the basefee.</p>
      </div>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            Elasticity Multiplier <span className="required">*</span>
          </p>
          <Form.Item>
            <div className="flex-column">
              <div className="flex-full flex-row">
                <Input
                  name="Elasticity"
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15 ml-0" + (ElasticityErr ? " errInput" : "")
                  }
                  disabled={loading}
                />
              </div>
            </div>
            <p className={ElasticityErr ? "errHint" : "errHint-hide"}>
              Invalid value
            </p>
          </Form.Item>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>
          Determines what percentage to increase when baseFee is increased.
          <br />
          ex&#41; x&rarr; 1/8 = 12.5%
        </p>
      </div>
      <p className="subtitle">Description</p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder="Max. 256 bytes"
          autoSize={{ minRows: 4, maxRows: 4 }}
          name="memo"
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <ProposalFormFooter
        netName={netName}
        loading={loading}
        disabled={gasLimitErr | baseFeeDenominatorErr | ElasticityErr}
        votingDurationMin={votingDurationMin}
        votingDurationMax={votingDurationMax}
        handleChange={handleChange}
      />
    </Form>
  </div>
);

// ! legacy code -> remove <Update Authority>
export const UpdateProposalForm = ({
  netName,
  loading,
  newNameErr,
  newNodeErr,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <p className="subtitle">
        New Node Name <span className="required">*</span>
      </p>
      <Form.Item>
        <Input
          name="newName"
          onChange={handleChange}
          className={newNameErr ? "errInput" : ""}
          disabled={loading}
        />
        <p className={newNameErr ? "errHint" : "errHint-hide"}>Invalid Name</p>
      </Form.Item>
      <p className="subtitle">
        New Node Description <span className="required">*</span>
      </p>
      <Form.Item>
        <Input
          type="primary"
          name="newNode"
          onChange={handleChange}
          className={newNodeErr ? "errInput" : ""}
          disabled={loading}
          placeholder="6f8a80d1....66ad92a0@10.3.58.6:30303"
        />
        <p className={newNodeErr ? "errHint" : "errHint-hide"}>Invalid Node</p>
      </Form.Item>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>
          The hexadecimal node ID is encoded in the username portion of the URL,
          separated from the host by an @ sign. The hostname can only be given
          as an IP address, DNS domain names are not allowed. The port in the
          host name section is the TCP listening port.
        </p>
      </div>
      <p className="subtitle">Description</p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder="Max. 256 bytes"
          autoSize={{ minRows: 4, maxRows: 4 }}
          name="memo"
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            className={"submit_Btn btn-fill-primary text-large " + netName}
            htmlType="submit"
            disabled={newNodeErr || newNameErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

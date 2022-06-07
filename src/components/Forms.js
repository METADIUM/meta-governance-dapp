import React from "react";
import { Button, Input, Form, Icon, Select } from "antd";

import "./style/style.css";
import { shouldPass } from "../util";

const { TextArea } = Input;
const { Option } = Select;

const AddProposalForm = ({
  netName,
  loading,
  votingAddrErr,
  stakingAddrErr,
  stakingMin,
  newLockAmountErr,
  newLockAmount,
  newNodeErr,
  newNameErr,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <p className="subtitle">
        New Authority Address <span className="required">*</span>
      </p>
      <div className="bor-box pd-rl-24 pd-tb-24 mt-16">
        <Form.Item className="mt-0">
          <p className="subtitle mt-0">Voting Address</p>
          <Input
            name="votingAddr"
            onChange={handleChange}
            className={"mt-5 " + (votingAddrErr ? "errInput" : "")}
            disabled={loading}
          />
          <p className={votingAddrErr ? "errHint" : "errHint-hide"}>
            Invalid Address
          </p>
        </Form.Item>
        <Form.Item>
          <p className="subtitle mt-0">Staking Address</p>
          <Input
            name="stakingAddr"
            onChange={handleChange}
            className={"mt-5 " + (stakingAddrErr ? "errInput" : "")}
            disabled={loading}
          />
          <p className={stakingAddrErr ? "errHint" : "errHint-hide"}>
            Invaild Address
          </p>
        </Form.Item>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>
          Rewards for block generation will be given to the Staking account.
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
            WEMIX Amount to be locked <span className="required">*</span>
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
      <p className="subtitle">
        New Authority Node Description <span className="required">*</span>
      </p>
      <Form.Item>
        <Input
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
            name="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            htmlType="submit"
            disabled={
              newLockAmountErr ||
              votingAddrErr ||
              stakingAddrErr ||
              newNodeErr ||
              newNameErr
            }
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

const RmoveProposalForm = ({
  netName,
  loading,
  showLockAmount,
  stakingMin,
  votingAddrErr,
  stakingAddrErr,
  oldLockAmountErr,
  oldLockAmount,
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
          <p className="subtitle mt-0">Voting Address</p>
          <Input
            name="votingAddr"
            onChange={handleChange}
            className={"mt-5 " + (votingAddrErr ? "errInput" : "")}
            disabled={loading}
          />
          <p className={votingAddrErr ? "errHint" : "errHint-hide"}>
            Invalid Address
          </p>
        </Form.Item>
        <Form.Item>
          <p className="subtitle mt-0">Staking Address</p>
          <Input.Search
            name="stakingAddr"
            onChange={handleChange}
            className={"mt-5 " + (stakingAddrErr ? "errInput" : "")}
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
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            className={"submit_Btn btn-fill-primary text-large " + netName}
            htmlType="submit"
            disabled={votingAddrErr || stakingAddrErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

const ChangeOfGovernanceContractAddressForm = ({
  netName,
  loading,
  newGovAddrErr,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <p className="subtitle">
        New Governance Address <span className="required">*</span>
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
            htmlType="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            loading={loading}
            disabled={newGovAddrErr}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

const VotingDurationSetting = ({
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
                    "w-180 mg-rl-15 " + (votDurationErr ? "errInput" : "")
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
                    "w-180 mg-rl-15 " + (votDurationErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
                <span>day</span>
              </Form.Item>
            </div>
            <p
              className={
                "mt-5 ml-40 " + (votDurationErr ? "errHint" : "errHint-hide")
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

const AuthorityMemberStakingAmount = ({
  netName,
  loading,
  AuthMemSkAmountErr,
  AuthMemSkAmountMin,
  AuthMemSkAmountMax,
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
                    "w-180 mg-rl-15 " + (AuthMemSkAmountErr ? "errInput" : "")
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
                    "w-180 mg-rl-15 " + (AuthMemSkAmountErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
                <span>WEMIX</span>
              </Form.Item>
            </div>
          </div>
          <p
            className={
              "mt-5 ml-40 " + (AuthMemSkAmountErr ? "errHint" : "errHint-hide")
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
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            name="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            htmlType="submit"
            disabled={AuthMemSkAmountErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

const BlockCreationTime = ({
  netName,
  loading,
  newBlockCreation,
  blockCreationErr,
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
                    "w-180 mg-rl-15 ml-0 " +
                    (blockCreationErr ? "errInput" : "")
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
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            name="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            htmlType="submit"
            disabled={blockCreationErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

const BlockRewardAmount = ({
  netName,
  loading,
  newBlockRewardAmount,
  blockRewardErr,
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
                    "w-180 mg-rl-15 ml-0 " + (blockRewardErr ? "errInput" : "")
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
            disabled={blockRewardErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

const BlockRewardDistributionMethod = ({
  netName,
  loading,
  blockRate1,
  blockRate2,
  blockRate3,
  blockRate4,
  blockRateTotal,
  blockRewardDisMthErr,
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
                      "w-100 mg-rl-5 ml-0 " +
                      (blockRewardDisMthErr ? "errInput" : "")
                    }
                    disabled={loading}
                  />
                </Form.Item>
              </div>
              <span className="sign">+</span>
              <div className="flex-column w-15per">
                <Form.Item label="Staking Reward">
                  <Input
                    name="blockRate2"
                    value={blockRate2}
                    addonAfter="%"
                    onChange={handleChange}
                    className={
                      "mg-rl-5 " + (blockRewardDisMthErr ? "errInput" : "")
                    }
                    disabled={loading}
                  />
                </Form.Item>
              </div>
              <span className="sign">+</span>
              <div className="flex-column w-15per">
                <Form.Item label="Ecosystem">
                  <Input
                    name="blockRate3"
                    value={blockRate3}
                    addonAfter="%"
                    onChange={handleChange}
                    className={
                      "mg-rl-5 " + (blockRewardDisMthErr ? "errInput" : "")
                    }
                    disabled={loading}
                  />
                </Form.Item>
              </div>
              <span className="sign">+</span>
              <div className="flex-column w-15per">
                <Form.Item label="Maintenance">
                  <Input
                    name="blockRate4"
                    value={blockRate4}
                    addonAfter="%"
                    onChange={handleChange}
                    className={
                      "mg-rl-5 " + (blockRewardDisMthErr ? "errInput" : "")
                    }
                    disabled={loading}
                  />
                </Form.Item>
              </div>
              <span className="sign">=</span>
              <div className="flex-column w-auto">
                <Form.Item label="Sum">
                  <Input
                    name="blockRateTotal"
                    value={blockRateTotal}
                    addonAfter="%"
                    onChange={handleChange}
                    className={
                      "w-auto mg-rl-5 " +
                      (blockRewardDisMthErr ? "errInput" : "")
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
            disabled={blockRewardDisMthErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

const ChangeOfMaxPriorityFeePerGasForm = ({
  netName,
  loading,
  maxPriorityFeePerGasErr,
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
                  name="masPriorityFeePerGas"
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15 ml-0" +
                    (maxPriorityFeePerGasErr ? "errInput" : "")
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
        <p>The default gas price is 100GWei.</p>
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
            disabled={maxPriorityFeePerGasErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

const GasLimitForm = ({
  netName,
  loading,
  gasLimitErr,
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
                    "w-180 mg-rl-15 ml-0" + (gasLimitErr ? "errInput" : "")
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
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>The default gas limit is 10,000,000 GWei.</p>
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
            disabled={gasLimitErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

// ! legacy code -> remove <Replace Authority>
const ReplaceProposalForm = ({
  netName,
  loading,
  stakingMin,
  oldAddrErr,
  newAddrErr,
  newNameErr,
  newNodeErr,
  newLockAmountErr,
  newLockAmount,
  oldNodeErr,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <p className="subtitle">
        Old Authority Address <span className="required">*</span>
      </p>
      <Form.Item>
        <Input
          name="oldAddr"
          onChange={handleChange}
          className={oldAddrErr ? "errInput" : ""}
          disabled={loading}
        />
        <p className={oldAddrErr ? "errHint" : "errHint-hide"}>
          Invalid Address
        </p>
      </Form.Item>
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
      <p className="subtitle">
        New Authority Node Description <span className="required">*</span>
      </p>
      <Form.Item>
        <Input
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
      <p className="subtitle">
        Old Authority Node Description <span className="required">*</span>
      </p>
      <Form.Item>
        <Input
          name="oldNode"
          onChange={handleChange}
          className={oldNodeErr ? "errInput" : ""}
          disabled={loading}
          placeholder="6f8a80d1....66ad92a0@10.3.58.6:30303"
        />
        <p className={oldNodeErr ? "errHint" : "errHint-hide"}>Invalid Node</p>
      </Form.Item>
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
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            className={"submit_Btn btn-fill-primary text-large " + netName}
            htmlType="submit"
            disabled={
              newLockAmountErr ||
              newAddrErr ||
              newNodeErr ||
              newNameErr ||
              oldAddrErr ||
              oldNodeErr
            }
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

// ! legacy code -> remove <Update Authority>
const UpdateProposalForm = ({
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

export {
  AddProposalForm,
  RmoveProposalForm,
  ChangeOfGovernanceContractAddressForm,
  VotingDurationSetting,
  AuthorityMemberStakingAmount,
  BlockCreationTime,
  BlockRewardAmount,
  BlockRewardDistributionMethod,
  ChangeOfMaxPriorityFeePerGasForm,
  GasLimitForm,
  // ! legacy code -> remove <Replace Authority>
  ReplaceProposalForm,
  // ! legacy code -> remove <Update Authority>
  UpdateProposalForm,
};

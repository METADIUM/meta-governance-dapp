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
            className={"mt-5" + (votingAddrErr ? "errInput" : "")}
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
            className={"mt-5" + (stakingAddrErr ? "errInput" : "")}
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
            META Amount to be locked <span className="required">*</span>
          </p>
          <Form.Item>
            <Input
              addonAfter="META"
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
            Replace META Amount <span className="required">*</span>
          </p>
          <Form.Item>
            <Input
              addonAfter="META"
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
            className={"mt-5" + (votingAddrErr ? "errInput" : "")}
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
            className={"mt-5" + (stakingAddrErr ? "errInput" : "")}
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
            {/* <p className={votDurationErr ? "errHint" : "errHint-hide"}>
              Invalid Amount
            </p> */}
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
            {/* <p className={votDurationErr ? "errHint" : "errHint-hide"}>
              Invalid Amount
            </p> */}
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

const VotingDurationSetting = ({
  netName,
  loading,
  votingDurationErr,
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

          <Form.Item>
            <div className="flex-column">
              <div className="flex-full flex-row">
                <label className="subtitle mt-0 flex-align-self-center w-25">
                  Min
                </label>
                <Input
                  name="newMin"
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15" + (votingDurationErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
                <span>day</span>
              </div>
              <div className="flex-full flex-row mt-5">
                <label className="subtitle mt-0 flex-align-self-center w-25">
                  Max
                </label>
                <Input
                  name="newMax"
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15" + (votingDurationErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
                <span>day</span>
              </div>
            </div>
            <p className={votingDurationErr ? "errHint" : "errHint-hide"}>
              {`${
                votingDurationErr === "min"
                  ? "Invalid Min Date Setting"
                  : votingDurationErr === "max"
                  ? "Invalid Max Date Setting"
                  : "Invalid Duration Seting"
              }`}
            </p>
          </Form.Item>
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
            {/* <p className={votDurationErr ? "errHint" : "errHint-hide"}>
              Invalid Amount
            </p> */}
          </Form.Item>
        </div>
      </div>
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            name="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            htmlType="submit"
            disabled={votingDurationErr}
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

          <Form.Item>
            <div className="flex-column">
              <div className="flex-full flex-row">
                <label className="subtitle mt-0 flex-align-self-center w-25">
                  Min
                </label>
                <Input
                  name="newMin"
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15" + (AuthMemSkAmountErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
                <span>WEMIX</span>
              </div>
              <div className="flex-full flex-row mt-5">
                <label className="subtitle mt-0 flex-align-self-center w-25">
                  Max
                </label>
                <Input
                  name="newMax"
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15" + (AuthMemSkAmountErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
                <span>WEMIX</span>
              </div>
            </div>
            <p className={AuthMemSkAmountErr ? "errHint" : "errHint-hide"}>
              Invalid Staking Amount
            </p>
          </Form.Item>
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
            {/* <p className={votDurationErr ? "errHint" : "errHint-hide"}>
              Invalid Amount
            </p> */}
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
  BlockCreationErr,
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
                  name="newblockcreation"
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15 ml-0" + (BlockCreationErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
                <span className="align-bottom-next-to-input">s</span>
              </div>
            </div>
            <p className={BlockCreationErr ? "errHint" : "errHint-hide"}>
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
            {/* <p className={votDurationErr ? "errHint" : "errHint-hide"}>
              Invalid Amount
            </p> */}
          </Form.Item>
        </div>
      </div>
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            name="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            htmlType="submit"
            disabled={BlockCreationErr}
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
  BlockRewardErr,
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
                  name="newblockcreation"
                  onChange={handleChange}
                  className={
                    "w-180 mg-rl-15 ml-0" + (BlockRewardErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
                <span>WEMIX/Block</span>
              </div>
            </div>
            <p className={BlockRewardErr ? "errHint" : "errHint-hide"}>
              Invalid Block Reward Amount
            </p>
          </Form.Item>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>Block Rewards are available from at least 1WEMIX/Block</p>
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
            {/* <p className={votDurationErr ? "errHint" : "errHint-hide"}>
              Invalid Amount
            </p> */}
          </Form.Item>
        </div>
      </div>
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            name="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            htmlType="submit"
            disabled={BlockRewardErr}
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
  BlockRewardDisMthErr,
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
          <Form.Item className="bor-box pd-rl-24 pd-tb-24">
            <div className="flex-full flex-row">
              <div className="flex-column w-15per">
                <label>Block Producer</label>
                <Input
                  name="newBlockprod"
                  addonAfter="%"
                  onChange={handleChange}
                  className={
                    "w-100 mg-rl-5 ml-0" +
                    (BlockRewardDisMthErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
              </div>
              <span className="sign">+</span>
              <div className="flex-column w-15per">
                <label>Staking Reward</label>
                <Input
                  name="newStakingRew"
                  addonAfter="%"
                  onChange={handleChange}
                  className={
                    "mg-rl-5" + (BlockRewardDisMthErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
              </div>
              <span className="sign">+</span>
              <div className="flex-column w-15per">
                <label>Ecosystem</label>
                <Input
                  name="newEcosys"
                  addonAfter="%"
                  onChange={handleChange}
                  className={
                    "mg-rl-5" + (BlockRewardDisMthErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
              </div>
              <span className="sign">+</span>
              <div className="flex-column w-15per">
                <label>Maintenance</label>
                <Input
                  name="newMaintain"
                  addonAfter="%"
                  onChange={handleChange}
                  className={
                    "mg-rl-5" + (BlockRewardDisMthErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
              </div>
              <span className="sign">=</span>
              <div className="flex-column w-auto">
                <label>Sum</label>
                <Input
                  name="newSum"
                  addonAfter="%"
                  onChange={handleChange}
                  className={
                    "w-auto mg-rl-5" + (BlockRewardDisMthErr ? "errInput" : "")
                  }
                  disabled={loading}
                />
              </div>
            </div>
            <p className={BlockRewardDisMthErr ? "errHint" : "errHint-hide"}>
              Invalid Block Reward Distribution Rate
            </p>
          </Form.Item>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>
          For the Block reward distribution rate, the sum of Default, Block
          Producer, Ecosystem, and Maintenance should be 100
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
            {/* <p className={votDurationErr ? "errHint" : "errHint-hide"}>
              Invalid Amount
            </p> */}
          </Form.Item>
        </div>
      </div>
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            name="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            htmlType="submit"
            disabled={BlockRewardDisMthErr}
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
  // ! legacy code -> remove <Replace Authority>
  ReplaceProposalForm,
  RmoveProposalForm,
  // ! legacy code -> remove <Update Authority>
  UpdateProposalForm,
  ChangeOfGovernanceContractAddressForm,
  VotingDurationSetting,
  AuthorityMemberStakingAmount,
  BlockCreationTime,
  BlockRewardAmount,
  BlockRewardDistributionMethod,
  ChangeOfMaxPriorityFeePerGasForm,
  GasLimitForm,
};

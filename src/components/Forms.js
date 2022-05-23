import React from "react";
import { Button, Input, Form, Icon, Select } from "antd";

import "./style/style.css";
import { shouldPass } from "../util";

const { TextArea } = Input;
const { Option } = Select;

const AddProposalForm = ({
  netName,
  loading,
  stakingMin,
  newAddrErr,
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
              newLockAmountErr || newAddrErr || newNodeErr || newNameErr
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
  oldAddrErr,
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
      <Form.Item className="bor-box pd-rl-24 pd-tb-24">
        <p className="subtitle mt-0">Voting Address</p>
        <Input></Input>
        <p className="subtitle">Staking Address</p>
        <Input.Search
          name="oldAddr"
          onChange={handleChange}
          className={oldAddrErr ? "errInput" : ""}
          disabled={loading}
          enterButton={
            <span>
              <Icon type="search" />
              <span> Check Balance</span>
            </span>
          }
          onSearch={(value) => getLockAmount(value)}
        />
        <p className={oldAddrErr ? "errHint" : "errHint-hide"}>
          Voting Address is invalid
        </p>
      </Form.Item>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">Locked META Amount</p>
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
            META Amount to be unlocked <span className="required">*</span>
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
            disabled={oldAddrErr}
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
               style={{width: 180}}
               onChange={handleChange}
            >
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
            </Select>
            <span>day</span>
            {/* <p className={newLockAmountErr ? "errHint" : "errHint-hide"}>
              Invalid Amount
            </p> */}
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

// ! legacy code -> remove <Gas Price>
const GasPriceForm = ({
  netName,
  loading,
  gasPriceErr,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <p className="subtitle">
        Gas Price <span className="required">*</span>
      </p>
      <Form.Item>
        <Input
          addonAfter="GWei"
          name="gasPrice"
          className={gasPriceErr ? "errInput" : ""}
          disabled={loading}
          onChange={handleChange}
        />
        <p className={gasPriceErr ? "errHint" : "errHint-hide"}>
          Invalid Price
        </p>
      </Form.Item>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>The default gas price is 800Wei.</p>
      </div>
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
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            htmlType="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            loading={loading}
            disabled={gasPriceErr}
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
                  className={"w-180 mg-rl-15" + (votingDurationErr ? "errInput" : "")}
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
                  className={"w-180 mg-rl-15" + (votingDurationErr ? "errInput" : "")}
                  disabled={loading}
                />
                <span>day</span>
              </div>
            </div>
            <p className={votingDurationErr ? "errHint" : "errHint-hide"}>
              Invalid Duration Setting
            </p>
          </Form.Item>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>
          The minimum value for Voting Duration is 1 day.
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
               style={{width: 180}}
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
            disabled={
              votingDurationErr
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
                  className={"w-180 mg-rl-15" + (AuthMemSkAmountErr ? "errInput" : "")}
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
                  className={"w-180 mg-rl-15" + (AuthMemSkAmountErr ? "errInput" : "")}
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
        <p>
          The maximum amount of staking that can be set is 4,980,000 WEMIX.
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
               style={{width: 180}}
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
            disabled={
              AuthMemSkAmountErr
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

export {
  AddProposalForm,
  // ! legacy code -> remove <Replace Authority>
  ReplaceProposalForm,
  RmoveProposalForm,
  // ! legacy code -> remove <Update Authority>
  UpdateProposalForm,
  ChangeOfGovernanceContractAddressForm,
  // ! legacy code -> remove <Gas Price>
  GasPriceForm,
  VotingDurationSetting,
  AuthorityMemberStakingAmount,
};

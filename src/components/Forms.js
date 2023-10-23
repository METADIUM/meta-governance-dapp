import React from "react";
import { Button, Input, Form, Icon, Select } from "antd";
import VotingButton from "../components/voting/Button";

import { convertSecondsToDay, shouldPass } from "../util";
import VotingInputArea from "./voting/VotingInputArea";
import { ReactComponent as IconArrowDown } from "../assets/images/ico_select_arrow_drop_down.svg";
import cn from "classnames/bind";
import GovButton from "./voting/GovButton";

const { TextArea } = Input;

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
  useVotingDuration = true,
  votingDurationMin,
  votingDurationMax,
  handleChange = shouldPass(),
  // handleSubmit = shouldPass(),
}) => {
  const min = convertSecondsToDay(votingDurationMin);
  const max = convertSecondsToDay(votingDurationMax);

  // option component
  const selectOption = () => {
    let comp = [];
    for (let op = min; op <= max; op++) {
      comp.push(
        <Select.Option key={op} value={`votDuration_${op}`}>
          {op} {op === 1 ? "day" : "days"}
        </Select.Option>,
      );
    }
    return comp;
  };
  return (
    <>
      <div className="voting-duration">
        <div className="voting-duration-wrap">
          {useVotingDuration && (
            <>
              <strong>
                Voting Duration<span className={cn("required")}>*</span>
              </strong>
              <Select
                defaultValue={"1day"}
                name="votDuration"
                disabled={loading}
                className="voting-filter proposal"
                suffixIcon={<IconArrowDown />}
                onChange={handleChange}
              >
                {selectOption()}
              </Select>
            </>
          )}
        </div>
      </div>
      <div>
        {/* <VotingButton
          text="Submit"
          disabled={loading || disabled}
          type="bg"
          loading={loading}
        /> */}
        <GovButton
          text="Submit"
          disabled={loading || disabled}
          type="bg"
          loading={loading}
          onClick={() => {
            console.log(1);
          }}
        />
      </div>
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
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        New Authority Address <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        name="newAddr"
        inputType={"default"}
        placeholder={"Enter Address"}
        disabled={loading}
        onChange={handleChange}
        errType={newAddrErr}
        errText="Invalid Address"
      />
      <div className={cn("description")}>
        When registering the first Authority Address, the Stking Address, Voting
        Address, and Reward Address are the same.
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Node Name <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        name="newName"
        inputType={"default"}
        placeholder={"Enter node name"}
        disabled={loading}
        onChange={handleChange}
        errType={newNameErr}
        errText="Invalid Name"
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        META Amount to be locked <span className={cn("required")}>*</span>
      </strong>
      {console.log(
        newLockAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      )}
      {console.log(stakingMin)}
      {console.log(handleChange)}
      <VotingInputArea
        inputType="suffix"
        fixText={"META"}
        name="newLockAmount"
        value={newLockAmount || ""}
        defaultValue={stakingMin}
        disabled={loading}
        onChange={handleChange}
        errType={newLockAmountErr}
        errText="Invalid Amount"
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        New Authority Node Description <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        name="newNode"
        // placeholder="6f8a80d1....66ad92a0@10.3.58.6:30303"
        placeholder={"Enter Address"}
        disabled={loading}
        onChange={handleChange}
        errType={newNodeErr}
        errText="Invalid Node"
      />
      <div className={cn("description")}>
        The hexadecimal node ID is encoded in the username portion of the URL,
        separated from the host by an @ sign. The hostname can only be given as
        an IP address, DNS domain names are not allowed. The port in the host
        name section is the TCP listening port.
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Description</strong>
      <VotingInputArea
        inputType="multiline"
        name="memo"
        maxLength={256}
        placeholder="Enter desc. max 256"
        disabled={loading}
        onChange={handleChange}
      />
    </div>
    <ProposalFormFooter
      netName={netName}
      loading={loading}
      disabled={newLockAmountErr || newAddrErr || newNameErr || newNodeErr}
      votingDurationMin={votingDurationMin}
      votingDurationMax={votingDurationMax}
      handleChange={handleChange}
    />
  </Form>
);

// Replace Authority Member
export const ReplaceProposalForm = ({
  netName,
  loading,
  stakingAddrErr,
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
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Old Authority Address <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        name="stakingAddr"
        placeholder={"Staking Address"}
        disabled={loading}
        onChange={handleChange}
        errType={stakingAddrErr}
        errText="Invalid Address"
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        New Authority Address <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        name="newAddr"
        placeholder={"Enter Address"}
        disabled={loading}
        onChange={handleChange}
        errType={newAddrErr}
        errText="Invalid Address"
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Node Name <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        name="newName"
        placeholder={"Enter node name"}
        disabled={loading}
        onChange={handleChange}
        errType={newNameErr}
        errText="Invalid Name"
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Replace META Amount <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        inputType="suffix"
        fixText={"META"}
        name="newLockAmount"
        value={newLockAmount}
        disabled={loading}
        onChange={handleChange}
        errType={newLockAmountErr}
        errText="Invalid Amount"
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        New Authority Node Description <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        name="newNode"
        // placeholder="6f8a80d1....66ad92a0@10.3.58.6:30303"
        placeholder={"Enter Address"}
        disabled={loading}
        onChange={handleChange}
        errType={newNodeErr}
        errText="Invalid Node"
      />
      <div className={cn("description")}>
        The hexadecimal node ID is encoded in the username portion of the URL,
        separated from the host by an @ sign. The hostname can only be given as
        an IP address, DNS domain names are not allowed. The port in the host
        name section is the TCP listening port.
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Description</strong>
      <VotingInputArea
        inputType="multiline"
        name="memo"
        maxLength={256}
        placeholder="Enter desc. max 256"
        disabled={loading}
        onChange={handleChange}
      />
    </div>
    <ProposalFormFooter
      netName={netName}
      loading={loading}
      disabled={
        stakingAddrErr ||
        newLockAmountErr ||
        newAddrErr ||
        newNameErr ||
        newNodeErr
      }
      votingDurationMin={votingDurationMin}
      votingDurationMax={votingDurationMax}
      handleChange={handleChange}
    />
  </Form>
);

// Remove Authority Member
export const RemoveProposalForm = ({
  netName,
  loading,
  stakingAddrErr,
  showLockAmount,
  showLockAmountErr,
  stakingMin,
  oldLockAmount,
  oldLockAmountErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
  getLockAmount = shouldPass(),
}) => (
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Address to be removed <span className={cn("required")}>*</span>
      </strong>
      <div className={cn("button-input-box")}>
        <VotingInputArea
          name="stakingAddr"
          placeholder="Enter Staking Address"
          disabled={loading}
          onChange={handleChange}
          errType={stakingAddrErr}
          errText="Invalid Address"
          enterButton="Check Balance"
          onClick={(addr) => {
            getLockAmount(addr);
          }}
        />
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        <p className="subtitle">Locked META Amount</p>
      </strong>
      <VotingInputArea
        inputType="suffix"
        fixText={"META"}
        name="showLockAmount"
        value={showLockAmount || ""}
        errType={showLockAmountErr}
        errText={"Click the Check Balance button"}
        readonly={true}
        disabled={loading}
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        <p className="subtitle">META Amount to be unlocked</p>
      </strong>
      <VotingInputArea
        inputType="suffix"
        fixText="META"
        name="oldLockAmount"
        value={oldLockAmount}
        disabled={loading}
        onChange={handleChange}
        errType={oldLockAmountErr}
        errText="Invalid Amount"
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Description</strong>
      <VotingInputArea
        inputType="multiline"
        name="memo"
        maxLength={256}
        placeholder="Enter desc. max 256"
        disabled={loading}
        onChange={handleChange}
      />
    </div>
    <ProposalFormFooter
      netName={netName}
      loading={loading}
      disabled={stakingAddrErr || oldLockAmountErr}
      votingDurationMin={votingDurationMin}
      votingDurationMax={votingDurationMax}
      handleChange={handleChange}
    />
  </Form>
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
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        New Governance Contract Address
        <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        name="newGovAddr"
        placeholder={"Enter Address"}
        disabled={loading}
        onChange={handleChange}
        errType={newGovAddrErr}
        errText="Invalid Address"
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Description</strong>
      <VotingInputArea
        inputType="multiline"
        name="memo"
        maxLength={256}
        placeholder="Enter desc. max 256"
        disabled={loading}
        onChange={handleChange}
      />
    </div>
    <ProposalFormFooter
      netName={netName}
      loading={loading}
      disabled={newGovAddrErr}
      votingDurationMin={votingDurationMin}
      votingDurationMax={votingDurationMax}
      handleChange={handleChange}
    />
  </Form>
);

// Voting Duration Setting
export const VotingDurationSettingForm = ({
  netName,
  loading,
  votDurationMin,
  votDurationMax,
  votDurationErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Voting Duration Setting <span className={cn("required")}>*</span>
      </strong>
      <div className={"double-input-box"}>
        <div className={"box-wrap"}>
          <VotingInputArea
            inputType="suffix"
            fixText="day"
            prefix={"MIN"}
            name="votDurationMin"
            value={votDurationMin || ""}
            placeholder={"Enter day"}
            disabled={loading}
            onChange={handleChange}
            errType={
              votDurationErr === "min" ||
              (votDurationErr && votDurationErr !== "max")
            }
          />
          {votDurationErr === "min" && (
            <p className={"error-massage"}>Invalid Min Date Setting</p>
          )}
          <div>&nbsp;</div>
          <VotingInputArea
            inputType={"suffix"}
            fixText="day"
            prefix="MAX"
            name="votDurationMax"
            value={votDurationMax || ""}
            placeholder={"Enter day"}
            onChange={handleChange}
            disabled={loading}
            errType={
              votDurationErr === "max" ||
              (votDurationErr && votDurationErr !== "min")
            }
          />
        </div>
        {votDurationErr && (
          <p className={"error-massage"}>
            {`${
              votDurationErr === "max"
                ? "Invalid Max Date Setting"
                : votDurationErr !== "min"
                ? "Invalid Duration Setting"
                : ""
            }`}
          </p>
        )}
      </div>
      <div className={cn("description")}>
        The minimum value for Voting Duration is 1 day.
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Description</strong>
      <VotingInputArea
        inputType="multiline"
        name="memo"
        maxLength={256}
        placeholder="Enter desc. max 256"
        disabled={loading}
        onChange={handleChange}
      />
    </div>
    <ProposalFormFooter
      netName={netName}
      loading={loading}
      disabled={votDurationErr}
      votingDurationMin={votingDurationMin}
      votingDurationMax={votingDurationMax}
      handleChange={handleChange}
    />
  </Form>
);

// Authority Member Staking Amount
export const AuthorityMemberStakingAmountForm = ({
  netName,
  loading,
  authMemSkAmountMin,
  authMemSkAmountMax,
  authMemSkAmountErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Staking Amount <span className={cn("required")}>*</span>
      </strong>
      <div className={"double-input-box"}>
        <div className={"box-wrap"}>
          <VotingInputArea
            inputType="suffix"
            fixText="META"
            prefix={"MIN"}
            name="authMemSkAmountMin"
            value={authMemSkAmountMin || ""}
            placeholder={"Enter amount"}
            onChange={handleChange}
            disabled={loading}
            errType={
              authMemSkAmountErr === "min" ||
              (authMemSkAmountErr && authMemSkAmountErr !== "max")
            }
          />
          {authMemSkAmountErr === "min" && (
            <p className={"error-massage"}>{"Invalid Min Amount"}</p>
          )}
          <div>&nbsp;</div>
          <VotingInputArea
            inputType={"suffix"}
            fixText="META"
            prefix={"MAX"}
            name="authMemSkAmountMax"
            value={authMemSkAmountMax || ""}
            placeholder={"Enter amount"}
            onChange={handleChange}
            disabled={loading}
            errType={
              authMemSkAmountErr === "max" ||
              (authMemSkAmountErr && authMemSkAmountErr !== "min")
            }
          />
        </div>
        {authMemSkAmountErr && (
          <p className={"error-massage"}>
            {`${
              authMemSkAmountErr === "max"
                ? "Invalid Max Amout"
                : authMemSkAmountErr !== "min"
                ? "Invalid Staking Amount"
                : ""
            }`}
          </p>
        )}
      </div>
      <div className={cn("description")}>
        The maximum amount of staking that can be set is 4,980,000 META.
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Description</strong>
      <VotingInputArea
        inputType="multiline"
        name="memo"
        maxLength={256}
        placeholder="Enter desc. max 256"
        disabled={loading}
        onChange={handleChange}
      />
    </div>
    <ProposalFormFooter
      netName={netName}
      loading={loading}
      disabled={authMemSkAmountErr}
      votingDurationMin={votingDurationMin}
      votingDurationMax={votingDurationMax}
      handleChange={handleChange}
    />
  </Form>
);

// Block Creation Time
export const BlockCreationTime = ({
  netName,
  loading,
  blockCreation,
  blockCreationErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Block Creation Time <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        inputType="suffix"
        fixText={"s"}
        name="blockCreation"
        value={blockCreation || ""}
        placeholder={"Enter time"}
        onChange={handleChange}
        disabled={loading}
        errType={blockCreationErr}
        errText="Invalid Block Creation Time"
      />
      <div className={cn("description")}>
        Block Creation time is possible from at least 1s.
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Description</strong>
      <VotingInputArea
        inputType="multiline"
        name="memo"
        maxLength={256}
        placeholder="Enter desc. max 256"
        disabled={loading}
        onChange={handleChange}
      />
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
);

// Block Reward Amount
export const BlockRewardAmount = ({
  netName,
  loading,
  blockRewardAmount,
  blockRewardAmountErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Block Reward Amount <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        inputType="suffix"
        fixText="META/Block"
        name="blockRewardAmount"
        value={blockRewardAmount || ""}
        placeholder={"Enter block reward amount"}
        onChange={handleChange}
        disabled={loading}
        errType={blockRewardAmountErr}
        errText="Invalid Block Reward Amount"
      />
      <div className={cn("description")}>
        Block Rewards are available from at least 1META/Block.
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Description</strong>
      <VotingInputArea
        inputType="multiline"
        name="memo"
        maxLength={256}
        placeholder="Enter desc. max 256"
        disabled={loading}
        onChange={handleChange}
      />
    </div>
    <ProposalFormFooter
      netName={netName}
      loading={loading}
      disabled={blockRewardAmountErr}
      votingDurationMin={votingDurationMin}
      votingDurationMax={votingDurationMax}
      handleChange={handleChange}
    />
  </Form>
);

// Block Reward Distribution Method
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
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Distribution Rate<span className={cn("required")}>*</span>
      </strong>
      <div className={cn("box-wrap")}>
        {/* !! input 갯수, 하이픈 갯수 css 변수로 추가 필요 */}
        <div
          className={cn("multi-input-box")}
          style={{ "--input-count": 5, "--hyphen-count": 4 }}
        >
          <div className={cn("input-cell")}>
            <strong className={cn("input-cell-title")}>Block Producer</strong>
            <VotingInputArea
              inputType={"suffix"}
              fixText={"%"}
              placeholder={"0 %"}
              name="blockRate1"
              value={blockRate1 || ""}
              onChange={handleChange}
              disabled={loading}
              errType={blockRewardDisMthErr}
            />
          </div>
          <span className={cn("hyphen")}>+</span>
          <div className={cn("input-cell")}>
            <strong className={cn("input-cell-title")}>Staking Reward</strong>
            <VotingInputArea
              inputType={"suffix"}
              fixText={"%"}
              placeholder={"0 %"}
              name="blockRate2"
              value={blockRate2 || ""}
              onChange={handleChange}
              disabled={loading}
              errType={blockRewardDisMthErr}
            />
          </div>
          <span className={cn("hyphen")}>+</span>
          <div className={cn("input-cell")}>
            <strong className={cn("input-cell-title")}>Ecosystem</strong>
            <VotingInputArea
              inputType={"suffix"}
              fixText={"%"}
              placeholder={"0 %"}
              name="blockRate3"
              value={blockRate3 || ""}
              onChange={handleChange}
              disabled={loading}
              errType={blockRewardDisMthErr}
            />
          </div>
          <span className={cn("hyphen")}>+</span>
          <div className={cn("input-cell")}>
            <strong className={cn("input-cell-title")}>Maintenance</strong>
            <VotingInputArea
              inputType={"suffix"}
              fixText={"%"}
              placeholder={"0 %"}
              name="blockRate4"
              value={blockRate4 || ""}
              onChange={handleChange}
              disabled={loading}
              errType={blockRewardDisMthErr}
            />
          </div>
          <span className={cn("hyphen")}>=</span>
          <div className={cn("input-cell")}>
            <strong className={cn("input-cell-title")}>Sum</strong>
            <VotingInputArea
              inputType={"suffix"}
              fixText={"%"}
              placeholder={"0 %"}
              name="blockRateTotal"
              value={blockRateTotal || ""}
              onChange={handleChange}
              disabled={true}
              errType={blockRewardDisMthErr}
              readonly={true}
            />
          </div>
        </div>
        {blockRewardDisMthErr && (
          <p className={"error-massage"}>
            Only numbers can be entered, and Sum must be 100.
          </p>
        )}
      </div>
      <span className={cn("description")}>
        For the Block reward distribution rate, the sum of Default, Block
        Producer, Ecosystem, and Maintenance should be 100.
      </span>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Description</strong>
      <VotingInputArea
        inputType="multiline"
        name="memo"
        maxLength={256}
        placeholder="Enter desc. max 256"
        disabled={loading}
        onChange={handleChange}
      />
    </div>
    <ProposalFormFooter
      netName={netName}
      loading={loading}
      disabled={blockRewardDisMthErr}
      votingDurationMin={votingDurationMin}
      votingDurationMax={votingDurationMax}
      handleChange={handleChange}
    />
  </Form>
);

// MaxPriorityFeePerGas
export const MaxPriorityFeePerGasForm = ({
  netName,
  loading,
  maxPriorityFeePerGas,
  maxPriorityFeePerGasErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        MaxPriorityFeePerGas <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        inputType="suffix"
        fixText={"GWei"}
        name="maxPriorityFeePerGas"
        value={maxPriorityFeePerGas || ""}
        placeholder={"Enter fee"}
        onChange={handleChange}
        disabled={loading}
        errType={maxPriorityFeePerGasErr}
        errText="Invalid MaxPriorityFeePerGas"
      />
      <div className={cn("description")}>
        Specifies the fee returned to the miner
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Description</strong>
      <VotingInputArea
        inputType="multiline"
        name="memo"
        maxLength={256}
        placeholder="Enter desc. max 256"
        disabled={loading}
        onChange={handleChange}
      />
    </div>
    <ProposalFormFooter
      netName={netName}
      loading={loading}
      disabled={maxPriorityFeePerGasErr}
      votingDurationMin={votingDurationMin}
      votingDurationMax={votingDurationMax}
      handleChange={handleChange}
    />
  </Form>
);

// Gas Limit & baseFee
export const GasLimitBaseFeeForm = ({
  netName,
  loading,
  gasLimit,
  gasLimitErr,
  maxBaseFee,
  maxBaseFeeErr,
  baseFeeMaxChangeRate,
  baseFeeMaxChangeRateErr,
  gasTargetPercentage,
  gasTargetPercentageErr,
  votingDurationMin,
  votingDurationMax,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Gas Limit <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        inputType={"suffix"}
        fixText="GWei"
        name="gasLimit"
        value={gasLimit || ""}
        placeholder={"Enter gas limit"}
        onChange={handleChange}
        disabled={loading}
        errType={gasLimitErr}
        errText="Invalid Gas Limit"
      />
      <div className={cn("description")}>
        Gas Limit is the maximum amount of gas to be consumed when processing a
        transaction.
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Max base Fee <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        inputType={"suffix"}
        fixText="Gwei"
        name="maxBaseFee"
        value={maxBaseFee || ""}
        placeholder={"Enter max base fee"}
        onChange={handleChange}
        disabled={loading}
        errType={maxBaseFeeErr}
        errText="Invalid Max baseFee"
      />
      <div className={cn("description")}>
        MAX baseFee is the maximum to which baseFee can be increased.
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        BaseFee Max Change Rate <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        inputType={"suffix"}
        fixText="%"
        name="baseFeeMaxChangeRate"
        value={baseFeeMaxChangeRate || ""}
        placeholder={"Enter change rate"}
        onChange={handleChange}
        disabled={loading}
        errType={baseFeeMaxChangeRateErr}
        errText="Invalid BaseFee Max Change Rate"
      />
      <div className={cn("description")}>
        Specifies how full the block must be to increase the baseFee.
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Gas Target Percentage <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        inputType={"suffix"}
        fixText="%"
        name="gasTargetPercentage"
        value={gasTargetPercentage || ""}
        placeholder={"Enter gas target percentage"}
        onChange={handleChange}
        disabled={loading}
        errType={gasTargetPercentageErr}
        errText="Invalid Gas Target Percentage"
      />
      <div className={cn("description")}>
        Determines what percentage to increase when baseFee is increased.
        <br />
        ex&#41; 8&rarr; 1/8 = 12.5%
      </div>
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Description</strong>
      <VotingInputArea
        inputType="multiline"
        name="memo"
        maxLength={256}
        placeholder="Enter desc. max 256"
        disabled={loading}
        onChange={handleChange}
      />
    </div>
    <ProposalFormFooter
      netName={netName}
      loading={loading}
      disabled={
        gasLimitErr ||
        maxBaseFeeErr ||
        baseFeeMaxChangeRateErr ||
        gasTargetPercentageErr
      }
      votingDurationMin={votingDurationMin}
      votingDurationMax={votingDurationMax}
      handleChange={handleChange}
    />
  </Form>
);

// Wait Proposal
export const AddWaitProposalForm = ({
  netName,
  loading,
  companyNameErr,
  companyAddressErr,
  investmentAmount,
  investmentAmountErr,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
}) => (
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Company Name <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        name="companyName"
        inputType={"default"}
        maxLength={50}
        placeholder={"Enter company name"}
        disabled={loading}
        onChange={handleChange}
        errType={companyNameErr}
        errText="Invalid Name"
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Company Wallet Address <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        name="companyAddress"
        inputType={"default"}
        placeholder={"Enter company wallet address"}
        disabled={loading}
        onChange={handleChange}
        errType={companyAddressErr}
        errText="Invalid Address"
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Investment Amount <span className={cn("required")}>*</span>
      </strong>
      <VotingInputArea
        inputType="suffix"
        fixText={"META"}
        name="investmentAmount"
        value={investmentAmount || ""}
        placeholder={"Enter investment amount"}
        disabled={loading}
        onChange={handleChange}
        errType={investmentAmountErr}
        errText="Invalid Investment Amount"
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Description</strong>
      <VotingInputArea
        inputType="multiline"
        name="memo"
        maxLength={8000}
        placeholder="Enter desc. max 8000"
        disabled={loading}
        onChange={handleChange}
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>Link </strong>
      <VotingInputArea
        name="link"
        inputType={"default"}
        placeholder={"Enter link"}
        disabled={loading}
        onChange={handleChange}
        errText="Invalid link"
      />
    </div>
    <ProposalFormFooter
      netName={netName}
      loading={loading}
      disabled={companyNameErr || companyAddressErr || investmentAmountErr}
      useVotingDuration={false}
      handleChange={handleChange}
    />
  </Form>
);

import React from "react";
import { Input, Form, Icon } from "antd";

import { SubmitForm } from "./Forms";
import { shouldPass } from "../util";

// Voting Address
export const VotingAddress = ({
  netName,
  loading,
  oldVotingAddr,
  newVotingAddrErr,
  handleChange = shouldPass(),
  handleSubmit = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            Old Voting Address <span className="required">*</span>
          </p>
          <Form.Item>
            <Input name="oldVotingAddr" value={oldVotingAddr} disabled />
          </Form.Item>
          <p className="subtitle">
            New Voting Address <span className="required">*</span>
          </p>
          <Form.Item>
            <Input
              name="newVotingAddr"
              className={newVotingAddrErr ? "errInput" : ""}
              disabled={loading}
              onChange={handleChange}
            />
            <p className={newVotingAddrErr ? "errHint" : "errHint-hide"}>
              Invalid Address
            </p>
          </Form.Item>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>
          Enter the old Voting Address and the new Voting Address to change the
          Voting Address.
        </p>
      </div>
      <SubmitForm
        netName={netName}
        disabled={newVotingAddrErr}
        loading={loading}
        handleSubmit={handleSubmit}
      />
    </Form>
  </div>
);

// Reward Address
export const RewardAddress = ({
  netName,
  loading,
  oldRewardAddr,
  newRewardAddrErr,
  handleChange = shouldPass(),
  handleSubmit = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form onSubmit={handleSubmit}>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            Old Reward Address <span className="required">*</span>
          </p>
          <Form.Item>
            <Input name="oldRewardAddr" value={oldRewardAddr} disabled />
          </Form.Item>
          <p className="subtitle">
            New Reward Address <span className="required">*</span>
          </p>
          <Form.Item>
            <Input
              name="newRewardAddr"
              className={newRewardAddrErr ? "errInput" : ""}
              disabled={loading}
              onChange={handleChange}
            />
            <p className={newRewardAddrErr ? "errHint" : "errHint-hide"}>
              Invalid Address
            </p>
          </Form.Item>
        </div>
      </div>
      <div className="helpDescription">
        <Icon type="question-circle" />
        <p>
          Enter the old Reward Address and the new Reward Address to change the
          Reward Address.
        </p>
      </div>
      <SubmitForm
        netName={netName}
        disabled={newRewardAddrErr}
        loading={loading}
        handleSubmit={handleSubmit}
      />
    </Form>
  </div>
);

import React from "react";
import { Input, Form, Icon, Button } from "antd";

import { shouldPass } from "../util";

// components for communicating common props
export const PassesCommonProps = ({
  netName,
  loading,
  handleSubmit,
  handleChange,
  children,
}) => {
  return (
    <>
      {React.cloneElement(children, {
        netName,
        loading,
        handleChange,
        handleSubmit,
      })}
    </>
  );
};

export const VotingAddress = ({
  netName,
  loading,
  oldVotingAddrErr,
  newVotingAddrErr,
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            Old Voting Address <span className="required">*</span>
          </p>
          <Form.Item>
            <Input
              name="oldVotingAddr"
              className={oldVotingAddrErr ? "errInput" : ""}
              disabled={loading}
              onChange={handleChange}
            />
            <p className={oldVotingAddrErr ? "errHint" : "errHint-hide"}>
              Invalid Address
            </p>
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
          Reward Address.
        </p>
      </div>
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            name="submit"
            htmlType="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            disabled={oldVotingAddrErr || newVotingAddrErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

export const RewardAddress = ({
  netName,
  loading,
  oldRewardAddrErr,
  newRewardAddrErr,
  handleChange = shouldPass(),
}) => (
  <div className="proposalBody">
    <Form>
      <div className="divider flex">
        <div className="flex-full">
          <p className="subtitle">
            Old Reward Address <span className="required">*</span>
          </p>
          <Form.Item>
            <Input
              name="oldRewardAddr"
              className={oldRewardAddrErr ? "errInput" : ""}
              disabled={loading}
              onChange={handleChange}
            />
            <p className={oldRewardAddrErr ? "errHint" : "errHint-hide"}>
              Invalid Address
            </p>
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
      <Form.Item>
        <div className="submitDiv flex">
          <Button
            name="submit"
            htmlType="submit"
            className={"submit_Btn btn-fill-primary text-large " + netName}
            disabled={oldRewardAddrErr || newRewardAddrErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
);

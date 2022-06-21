import React from "react";
import { Input, Form, Icon, Button } from "antd";

import { shouldPass } from "../util";

const { TextArea } = Input;

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
  disabled,
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

export const RewardAddress = ({ netName, loading }) => (
  <div>reward Address</div>
);

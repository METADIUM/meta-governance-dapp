import React from "react";
import { Select } from "antd";

import { web3Instance } from "../web3";

import * as MComponent from "./MyForm";
import * as util from "../util";

class Myinfo extends React.Component {
  data = {
    formData: {},
  };
  state = {
    selectedTopic: "",
    oldVotingAddrErr: false,
    newVotingAddrErr: false,
    oldRewardAddrErr: false,
    newRewardAddrErr: false,
  };

  // only, when the topic has changed
  handleSelectTopicChange = (topic) => {
    // this.data.selectedTopic = topic;
    // this.data.formData = {};
    this.resetForm();
    console.log(this.state);

    this.setState({ selectedTopic: topic });

    Object.keys(this.state)
      .filter((key) => key.indexOf("Err") > 0)
      .forEach((key) => {
        this.setState({ [key]: false });
      });
  };

  resetForm() {
    if (window.document.forms[0]) {
      const elements = window.document.forms[0].elements;
      Object.keys(elements).forEach((key) => {
        elements[key].value = "";
      });
    }
  }

  handleChange = (e) => {
    if (typeof e === "string") {
      this.handleSelectTopicChange(e);
      return;
    }
    // const originStr = this.data.formData[e.target.name];
    this.data.formData[e.target.name] = e.target.value;
    switch (e.target.name) {
      case "oldVotingAddr":
        this.setState({ oldVotingAddrErr: !util.checkAddress(e.target.value) });
        break;
      case "newVotingAddr":
        this.setState({ newVotingAddrErr: !util.checkAddress(e.target.value) });
        break;
      case "oldRewardAddr":
        this.setState({ oldRewardAddrErr: !util.checkAddress(e.target.value) });
        break;
      case "newRewardAddr":
        this.setState({ newRewardAddrErr: !util.checkAddress(e.target.value) });
        break;
      default:
        break;
    }
  };

  showMyForm() {
    const { selectedTopic } = this.state;
    const TopicComponent = (topic) => {
      switch (topic) {
        case "VotingAddress":
          return (
            <MComponent.VotingAddress
              oldVotingAddrErr={this.state.oldVotingAddrErr}
              newVotingAddrErr={this.state.newVotingAddrErr}
            />
          );
        case "RewardAddress":
          return (
            <MComponent.RewardAddress
              oldRewardAddrErr={this.state.oldRewardAddrErr}
              newRewardAddrErr={this.state.newRewardAddrErr}
            ></MComponent.RewardAddress>
          );
        default:
          return <></>;
      }
    };

    return (
      <MComponent.PassesCommonProps
        netName={web3Instance.netName}
        loading={this.props.loading}
        handleChange={this.handleChange}
      >
        {TopicComponent(selectedTopic)}
      </MComponent.PassesCommonProps>
    );
  }

  render() {
    const { buttonLoading } = this.props;
    const { selectedTopic } = this.data;

    return (
      <div>
        <div className="contentDiv container pt-40">
          <div className="contentVotingDiv">
            <div className="proposalHead">
              <div className="title flex">
                <p className="flex-full text-heavy">MyInfo</p>
                <p>* Mandatory</p>
              </div>
              <p className="subtitle">
                Replace List <span className="required">*</span>
              </p>
              <Select
                showArrrow
                onChange={this.handleSelectTopicChange}
                disabled={buttonLoading}
              >
                <Select.Option value="VotingAddress">
                  Voting Address
                </Select.Option>
                <Select.Option value="RewardAddress">
                  Reward Address
                </Select.Option>
              </Select>
            </div>
            {selectedTopic !== "" && <div>{this.showMyForm()}</div>}
          </div>
        </div>
      </div>
    );
  }
}

export { Myinfo };

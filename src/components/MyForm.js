import { Form } from 'antd';
import cn from 'classnames/bind';
import React from 'react';


import GovButton from './voting/GovButton';
import VotingInputArea from './voting/VotingInputArea';
import { shouldPass } from '../util';

// Voting Address
export const VotingAddress = ({
  netName,
  loading,
  oldVotingAddr,
  newVotingAddrErr,
  handleChange = shouldPass(),
  handleSubmit = shouldPass(),
}) => (
  <Form onSubmit={handleSubmit}>
    <div className={cn('voting-input-wrap')}>
      <strong>
        Old Voting Address <span className='required'>*</span>
      </strong>
      <VotingInputArea
        myForm={true}
        inputType={'multiline'}
        name='oldVotingAddr'
        value={oldVotingAddr}
        disabled
      />
    </div>
    <div className={cn('voting-input-wrap')}>
      <strong>
        New Voting Address <span className='required'>*</span>
      </strong>
      <VotingInputArea
        name='newVotingAddr'
        disabled={loading}
        onChange={handleChange}
        errType={newVotingAddrErr}
        errText='Invalid Address'
      />
    </div>
    <GovButton
      text={'Submit'}
      disabled={loading || newVotingAddrErr}
      type='bg'
      loading={loading}
    />
  </Form>
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
  <Form onSubmit={handleSubmit}>
    <div className={cn("voting-input-wrap")}>
      <strong>
        Old Reward Address <span className="required">*</span>
      </strong>
      <VotingInputArea
        myForm={true}
        inputType={"multiline"}
        name="oldRewardAddr"
        value={oldRewardAddr}
        disabled
      />
    </div>
    <div className={cn("voting-input-wrap")}>
      <strong>
        New Reward Address <span className="required">*</span>
      </strong>
      <VotingInputArea
        name="newRewardAddr"
        disabled={loading}
        onChange={handleChange}
        errType={newRewardAddrErr}
        errText="Invalid Address"
      />
    </div>
    <GovButton
      text={"Submit"}
      disabled={loading || newRewardAddrErr}
      type="bg"
      loading={loading}
    />
  </Form>
);

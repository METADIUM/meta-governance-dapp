import React from 'react';
import { Input, Form, Icon, Button } from 'antd';

import { shouldPass } from '../util';
import VotingInputArea from './voting/VotingInputArea';
import VotingButton from '../components/voting/Button';
import cn from 'classnames/bind';
import GovButton from './voting/GovButton';

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
      {/* <div className={cn("description")}>
        Enter the old Voting Address and the new Voting Address to change the
        Voting Address.
      </div> */}
    </div>
    {/* <div className="myinfo-footer">
      <VotingButton
        text="Submit"
        disabled={loading || newVotingAddrErr}
        type="bg"
        loading={loading}
      />
    </div> */}
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
    <div className={cn('voting-input-wrap')}>
      <strong>
        Old Reward Address <span className='required'>*</span>
      </strong>
      <VotingInputArea name='oldRewardAddr' value={oldRewardAddr} disabled />
    </div>
    <div className={cn('voting-input-wrap')}>
      <strong>
        New Reward Address <span className='required'>*</span>
      </strong>
      <VotingInputArea
        name='newRewardAddr'
        disabled={loading}
        onChange={handleChange}
        errType={newRewardAddrErr}
        errText='Invalid Address'
      />
      {/* <div className={cn('description')}>
        Enter the old Reward Address and the new Reward Address to change the
        Reward Address.
      </div> */}
    </div>
    {/* <div className="myinfo-footer">
      <VotingButton
        text="Submit"
        disabled={loading || newRewardAddrErr}
        type="bg"
        loading={loading}
      />
    </div> */}
    <GovButton
      text={'Submit'}
      disabled={loading || newRewardAddrErr}
      type='bg'
      loading={loading}
    />
  </Form>
);

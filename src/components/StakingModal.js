import React from 'react'
import { Button, Modal, Input, Select } from 'antd'
import './style/style.css'

const Option = Select.Option

const StakingModal = ({ accountBalance, stakingModalVisible, submitMetaStaking, hideStakingModal, handleSelectChange, handleInputChange = f => f, stakingLoading, amount, selectedStakingTopic, stakingInvalidErr }) =>
  <Modal
    className='stakingModal'
    title='META Staking'
    visible={stakingModalVisible}
    onCancel={hideStakingModal}
    footer={[
      <Button key='cancle' onClick={hideStakingModal}>cancle</Button>,
      <Button key='submit' type='primary' onClick={submitMetaStaking} loading={stakingLoading}>
                Submit
      </Button>
    ]}>
    <p>staked { accountBalance.balance } META </p> <p>(Locked { accountBalance.lockedBalance } META)</p>
    <Select value={selectedStakingTopic} onChange={handleSelectChange} disabled={stakingLoading}>
      <Option value='deposit'>Deposit Staking</Option>
      <Option value='withdraw'>Withdraw Staking</Option>
    </Select>
    <Input onChange={handleInputChange} type='number' placeholder='META Amount' addonAfter='META' value={amount} className={stakingInvalidErr ? 'errInput' : ''} disabled={stakingLoading}/>
    <p className={stakingInvalidErr ? 'errHint' : ''}>Invalid Amount</p>
  </Modal>

export { StakingModal }

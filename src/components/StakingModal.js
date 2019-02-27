import React from 'react'
import { Button, Modal, Input, Select } from 'antd'
import './style/style.css'

const Option = Select.Option

const StakingModal = ({ accountBalance, stakingModalVisible, submitMetaStaking, hideStakingModal, handleSelectChange, handleInputChange = f => f }) =>
  <Modal
    className='stakingModal'
    title='META Staking'
    visible={stakingModalVisible}
    onCancel={hideStakingModal}
    footer={[
      <Button key='cancle' onClick={hideStakingModal}>cancle</Button>,
      <Button key='submit' type='primary' onClick={submitMetaStaking}>
                Submit
      </Button>
    ]}>
    <p>staked { accountBalance.balance } META </p> <p>(Locked { accountBalance.lockedBalance } META)</p>
    <Select defaultValue='deposit' onChange={handleSelectChange}>
      <Option value='deposit'>Deposit Staking</Option>
      <Option value='withdraw'>Withdraw Staking</Option>
    </Select>
    <Input onChange={handleInputChange} type='number' placeholder='META Amount' addonAfter='META' />
  </Modal>

export { StakingModal }

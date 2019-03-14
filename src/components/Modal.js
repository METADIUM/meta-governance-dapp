import React from 'react'
import { Button, Modal, Input, Select, Icon } from 'antd'
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


const ErrModal = ({title, err, link, visible, coloseErrModal=f => f}) => 
  <Modal
      className='errorModal'
      title={title}
      visible={visible}
      onCancel={coloseErrModal}
      footer={link ? 
          [<a key="link" href={link} target="_blank" className="ant-btn">Checking on the Explore</a>,
          <Button type='primary' key="ok" onClick={coloseErrModal}>Okay</Button>]
          : [<Button type='primary' key="ok" onClick={coloseErrModal}>Okay</Button>]}>
      <p>Please revises the following information!</p>
      <div>
          <div><Icon type="exclamation-circle" /><p>{err}</p></div>
      </div>
  </Modal>

export { StakingModal, ErrModal }

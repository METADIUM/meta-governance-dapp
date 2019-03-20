import React from 'react'
import { Button, Modal, Input, Select, Icon, Slider } from 'antd'
import './style/style.css'

const Option = Select.Option

const StakingModal = ({
  netName,
  accountBalance,
  stakingModalVisible,
  loading,
  stakingAmount,
  stakingTopic,
  stakingInvalidErr,
  hideStakingModal = f => f,
  submitMetaStaking = f => f,
  handleInputChange = f => f,
  handleSelectChange = f => f
}) =>
  <Modal
    className='stakingModal'
    title='META Staking'
    visible={stakingModalVisible}
    onCancel={hideStakingModal}
    footer={[
      <Button key='cancle' onClick={hideStakingModal}>cancle</Button>,
      <Button
        key='submit'
        className={'btn-fill-primary ' + netName}
        type='primary'
        onClick={submitMetaStaking}
        loading={loading}
      >
        Submit
      </Button>
    ]}>
    <Select value={stakingTopic} onChange={handleSelectChange} disabled={loading}>
      <Option value='deposit'>Deposit Staking</Option>
      <Option value='withdraw'>Withdraw Staking</Option>
    </Select>
    <Input
      onChange={handleInputChange}
      type='number'
      placeholder='META Amount'
      addonAfter='META'
      value={stakingAmount}
      className={stakingInvalidErr ? 'errInput' : ''}
      disabled={loading}
    />
    <p className={stakingInvalidErr ? 'errHint' : 'errHint-hide'}>Invalid Amount</p>
    <div className='text-container'>
      <p className='staked'>staked { accountBalance.balance } META </p>
      <p className='locked text-small'>(Locked { accountBalance.lockedBalance } META)</p>
    </div>
  </Modal>

const ErrModal = ({ netName, title, err, link, visible, coloseErrModal = f => f }) =>
  <Modal
    className='errorModal'
    title={title}
    visible={visible}
    onCancel={coloseErrModal}
    footer={link
      ? [<a key='link' href={link} rel='noopener noreferrer' target='_blank' className='ant-btn'>Checking on the Explore</a>,
        <Button type='primary' key='ok' className={'btn-fill-primary ' + netName} onClick={coloseErrModal}>Okay</Button>]
      : [<Button type='primary' key='ok' className={'btn-fill-primary ' + netName} onClick={coloseErrModal}>Okay</Button>]}>
    <p className='text-bold'>Please revises the following information!</p>
    <div className='text-container'>
      <div className='flex error-icon'><Icon type='exclamation-circle' /><p>{err}</p></div>
    </div>
  </Modal>

const ChangeModal = ({
  updateModal,
  ballotUpdateDuration,
  completeModal = f => f,
  hideChangeModal = f => f,
  sliderChange = f => f
}) =>
  <Modal
    title='Voting Duration Change'
    visible={updateModal}
    onOk={completeModal}
    onCancel={hideChangeModal} >
    <p className='changeDay flex flex-center-vertical'>{ballotUpdateDuration}days</p>
    <Slider
      marks={{ 0: '0 days', 60: '3 days', 100: '5days' }}
      step={20}
      value={ballotUpdateDuration * 20}
      tooltipVisible={false}
      onChange={sliderChange}
    />
  </Modal>

export { StakingModal, ErrModal, ChangeModal }

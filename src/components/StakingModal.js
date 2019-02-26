import React from 'react'
import { Button, Modal, Input, Select } from 'antd'
import './style/style.css'

const Option = Select.Option

const StakingModal = ({stakingModalVisible, hideStakingModal=f=>f, submitMetaStaing=f=>f}) =>
    <Modal
        className="stakingModal"
        title="META Staking"
        visible={ stakingModalVisible }
        onCancel={ hideStakingModal }
        footer={[
            <Button key="cancle" onClick={hideStakingModal}>cancle</Button>,
            <Button key="submit" type="primary" onClick={submitMetaStaing}>
                Submit
            </Button>,
        ]}>
        <p>staked 000,000,000 META (Locked 000,000,000 META)</p>
        <Select defaultValue="Deposit">
            <Option value="Deposit">Deposit Staking</Option>
            <Option value="Withdraw">Withdraw Staking</Option>
        </Select>
        <Input type="number" placeholder="META Amount" addonAfter="META"></Input>
    </Modal>

export { StakingModal }
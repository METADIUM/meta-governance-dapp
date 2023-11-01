import { Button, Modal, Select, Icon, Slider } from 'antd'
import React, { useContext, useState } from 'react'
import { useSendTransaction } from 'wagmi'

import VotingInputArea from './voting/VotingInputArea'
import { AuthCtx } from '../contexts/AuthContext'
import { ModalContext } from '../contexts/ModalContext'
import { removeCommasFromNumber } from '../util'
import { convertSecondsToDay, addCommasToNumber } from '../util'
import * as util from '../util'
import {
  encodeABIValueInMethod,
  encodeABIValueInTrx,
  web3Instance
} from '../web3'

// import "./style/style.css";
import '../assets/scss/modal.scss'
import '../assets/scss/proposal.scss'
// 2023.02.24 수정 voting 페이지 팝업 추가 관련코드 추가
import cn from 'classnames/bind'
// import { ReactComponent as IconPopupClose } from '../assets/images/ico_popup_close.svg';
// import { use } from 'i18next';

// 2023.07.04 App.js의 Staking 관련 로직 Modal로 이동

const Option = Select.Option

const StakingModal = ({
  isMember,
  defaultAccount,
  accountBalance,
  setStakingModalVisible,
  stakingModalVisible,
  setStakingEventsWatch,
  scrollType,
  getErrModal
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [stakingTopic, setStakingTopic] = useState('deposit')
  const [stakingAmount, setStakingAmount] = useState('')
  const [errStaking, setErrStaking] = useState(false)

  const { sendTransactionAsync } = useSendTransaction()
  const { lockedBalance, myBalance } = useContext(AuthCtx)

  const submitMetaStaking = () => {
    if (!/^[1-9]\d*$/.test(stakingAmount)) {
      setErrStaking(true)
      return
    }
    if (stakingTopic === 'withdraw') {
      const checkBalance = Number(myBalance) - Number(lockedBalance)
      if (checkBalance <= 0) {
        getErrModal(
          'There is no amount available for withdrawal.',
          'Staking Submit Error'
        )
        return
      }
      if (checkBalance < Number(stakingAmount)) {
        getErrModal(
          'The amount entered must be smaller than the amount that can be withdrawn.',
          'Staking Submit Error'
        )
        return
      }
    }

    let trx = {}
    const amount = util.convertEtherToWei(stakingAmount)

    if (stakingTopic === 'deposit') {
      trx = encodeABIValueInTrx(web3Instance, 'Staking', 'deposit', amount)
    } else {
      trx = encodeABIValueInMethod(web3Instance, 'Staking', 'withdraw', amount)
    }
    setIsLoading(true)
    sendStakingTransaction(trx)
  }

  const waitForReceipt = (hash, cb) => {
    web3Instance.web3.eth.getTransactionReceipt(hash, (err, receipt) => {
      if (err) console.log('err: ', err)
      if (util.checkUndefined(receipt) || receipt === null) {
        // Try again in 1 second
        window.setTimeout(() => {
          waitForReceipt(hash, cb)
        }, 1000)
      } else {
        // Transaction went through
        if (cb) cb(receipt)
      }
    })
  }

  const sendStakingTransaction = async (trx) => {
    try {
      trx.from = defaultAccount
      trx.gasPrice = 110000000000
      // trx.maxFeePerGas = 101000000000;
      // trx.maxPriorityFeePerGas = 100000000000;
      await sendTransactionAsync(trx).then(({ hash }) => {
        waitForReceipt(hash, async (receipt) => {
          if (receipt.status) {
            await setStakingEventsWatch()
            setIsLoading(false)
            setStakingModalVisible(false)
            setStakingAmount('')
          } else {
            getErrModal(
              'The transaction could not be sent normally.',
              'Proposal Submit Error',
              receipt.transactionHash
            )
            setIsLoading(false)
            setStakingModalVisible(false)
            setStakingAmount('')
          }
        })
      })
    } catch (err) {
      let message = err?.details || 'Unknown Error'
      // 어떠한 경우에 JSON-RPC error가 메세지에 들어있는지 확인 불가.
      // Error 객체의 기본 형이 {code : any, message : any} 인데 sendTransactionAsync를 사용하면 기본 에러를 감싸서 details 에 내려줍니다.
      if (err.message.includes('JSON-RPC error')) message = 'RPC error'
      setIsLoading(false)
      getErrModal(message, 'Staking Error')
      setStakingAmount('')
    }
  }

  const handleSelectChange = (topic) => {
    console.log(topic)
    setStakingTopic(topic)
    setStakingAmount('')
  }

  const handleInputChange = (event) => {
    const value = removeCommasFromNumber(event.target.value)
    if (/^([0-9]*)$/.test(value)) {
      setStakingAmount(value)
      setErrStaking(false)
    }
  }

  return (
    <Modal
      className={cn('staking-modal', scrollType && 'scroll')}
      title='META Staking'
      visible={stakingModalVisible}
      onCancel={() => {
        setStakingAmount('')
        if (!isLoading) {
          setStakingModalVisible(false)
        }
      }}
      footer={[
        <Button
          key='cancel'
          onClick={() => {
            if (!isLoading) {
              setStakingModalVisible(false)
            }
          }}>
          Cancel
        </Button>,
        <Button
          key='submit'
          className='gov_btn'
          onClick={submitMetaStaking}
          loading={isLoading}
          disabled={errStaking}>
          Submit
        </Button>
      ]}>
      <div className={cn('staking-wrap')}>
        <Select
          defaultValue={stakingTopic}
          onChange={handleSelectChange}
          disabled={isLoading}
          className={cn('voting-filter')}>
          <Option value='deposit'>
            {isMember ? 'Additional' : 'Deposit'} Staking
          </Option>
          <Option value='withdraw'>Withdraw Staking</Option>
        </Select>

        <VotingInputArea
          inputType='suffix'
          suffixCoin='META'
          fixText={'META'}
          defaultValue={addCommasToNumber(stakingAmount)}
          value={addCommasToNumber(stakingAmount) || ''}
          superPrefix={'META Amount'}
          onChange={handleInputChange}
          className={errStaking ? 'errInput' : ''}
          disabled={isLoading}
          errType={errStaking}
          errText='Invalid Amount'
        />
      </div>
      <div className='sub-info'>
        <div className='sub-info-detail'>
          <span>Staked</span>
          <span>
            <p>{addCommasToNumber(accountBalance.balance)}</p> META
          </span>
        </div>
        <div className='sub-info-detail'>
          <span>Locked</span>
          <span>
            <p>{addCommasToNumber(accountBalance.lockedBalance)}</p>
            META
          </span>
        </div>
      </div>
    </Modal>
  )
}

const ErrModal = () => {
  const { setIsModalOpened, isModalOpened, title, content, errLink } =
    useContext(ModalContext)
  const RPCErrorMSG = () => (
    <div>
      <p>Ensure the network has been added correctly.</p>
      <p>Ensure you have enough coins to pay for gas.</p>
      <p>
        Ensure you are using the latest version of the app or the extension.
      </p>
    </div>
  )

  return (
    <Modal
      className={cn('staking-modal')}
      title={
        <div className='staking-modal-wrapper'>
          <span className='staking-modal-title'>{title}</span>
        </div>
      }
      visible={isModalOpened}
      onCancel={() => setIsModalOpened(false)}
      // closeIcon={<IconPopupClose />}
      footer={
        errLink
          ? [
            <a
              key='link'
              href={errLink}
              rel='noopener noreferrer'
              target='_blank'
              className='ant-btn'>
                Checking on the Explorer
            </a>,
            <Button
              key='ok'
              className='gov_btn'
              onClick={() => setIsModalOpened(false)}>
                Okay
            </Button>
          ]
          : [
            <Button key='ok' onClick={() => setIsModalOpened(false)}>
                Okay
            </Button>
          ]
      }>
      <div className='error-wrap'>
        {/* <p className={cn('sub-title')} style={{ color: 'black' }}>
          Please revises the following i
        nformation!
        </p> */}
        <div className='error-wrap-image' />

        <div className='modal-info-wrapper'>
          {/* <Icon type='exclamation-circle' /> */}
          <div>{content === 'RPC error' ? <RPCErrorMSG /> : content}</div>
        </div>
      </div>
    </Modal>
  )
}

const AccessFailedModal = ({ visible, message }) => (
  <Modal
    className='accessFail'
    title='Access Failed'
    visible={visible}
    footer={null}>
    <Icon type='close-circle' />
    <p className='text-bold'>{message}</p>
  </Modal>
)

const ChangeModal = ({
  updateModal,
  ballotUpdateDuration,
  votingDurationMin,
  votingDurationMax,
  completeModal = (f) => f,
  hideChangeModal = (f) => f,
  sliderChange = (f) => f
}) => {
  const min = convertSecondsToDay(votingDurationMin)
  const max = convertSecondsToDay(votingDurationMax)

  return (
    <Modal
      title='Voting Duration Change'
      visible={updateModal}
      onOk={completeModal}
      onCancel={hideChangeModal}>
      <p className='changeDay flex flex-center-vertical'>
        {ballotUpdateDuration} days
      </p>
      <Slider
        marks={{
          [min]: min + ' days',
          [ballotUpdateDuration]: ballotUpdateDuration + ' days',
          [max]: max + ' days'
        }}
        min={min}
        max={max}
        defaultValue={ballotUpdateDuration}
        tooltipVisible={false}
        onChange={sliderChange}
      />
    </Modal>
  )
}

const ConnectWalletModal = ({ children, visible, setWalletModal }) => {
  return (
    <Modal
      visible={visible}
      title={'Wallet Connect'}
      onCancel={setWalletModal}
      footer={null}>
      {children}
    </Modal>
  )
}

const DisConnectWalletModal = ({
  onDisConnect,
  visible,
  setDisConnectView
}) => {
  return (
    <Modal
      className='dis-connect-foot'
      visible={visible}
      title={'Disconnect'}
      onCancel={() => setDisConnectView(false)}
      onOk={onDisConnect}
      footer={[
        <Button key='cancel' onClick={() => setDisConnectView(false)}>
          Cancel
        </Button>,
        <Button key='ok' className='gov_btn' onClick={onDisConnect}>
          Okay
        </Button>
      ]}>
      <p className='modal-disconnect-title'>Disconnect your Wallet?</p>
    </Modal>
  )
}

// 2023.02.24 수정 voting 페이지 팝업 추가 작업
const VotingModal = ({
  onOk,
  visible,
  isVotingModal,
  btn,
  children,
  scrollType,
  title,
  subTitle
}) => {
  return (
    <Modal
      className={cn('staking-modal', scrollType && 'scroll')}
      visible={visible}
      title={
        <div>
          {title}
          {subTitle && <p className={cn('sub-title')}>{subTitle}</p>}
        </div>
      }
      onCancel={() => isVotingModal(false)}
      transitionName='voting'
      // closeIcon={<IconPopupClose />}
      footer={[
        btn.cancel && (
          <Button
            key='cancel'
            className='voting-cancel-btn'
            onClick={() => isVotingModal(false)}>
            Cancel
          </Button>
        ),
        <Button key='ok' className='gov_btn' onClick={() => onOk()}>
          {btn.btnName}
        </Button>
      ]}>
      {children}
    </Modal>
  )
}

// 2023.04.20 수정: TxHashAddModal 팝업 추가
const TxHashAddModal = ({
  onApply,
  visible,
  children,
  scrollType,
  disabled,
  onCancel
}) => {
  return (
    <Modal
      className={cn('tx-hash-add-modal', scrollType && 'scroll')}
      visible={visible}
      title={<div>Update Tx Hash</div>}
      onCancel={() => onCancel()}
      transitionName='tx-hash-add'
      // closeIcon={<IconPopupClose />}
      footer={[
        <Button
          key='cancel'
          className='tx-hash-add-cancel-btn'
          onClick={() => onCancel()}>
          Cancel
        </Button>,
        <Button
          key='apply'
          className='tx-hash-add-apply-btn'
          onClick={() => onApply()}
          disabled={disabled}>
          Apply
        </Button>
      ]}>
      {children}
    </Modal>
  )
}

export {
  StakingModal,
  ErrModal,
  AccessFailedModal,
  ChangeModal,
  ConnectWalletModal,
  DisConnectWalletModal,
  // 2023.02.24 수정 voting 페이지 팝업 추가 작업
  VotingModal,
  TxHashAddModal // 2023.04.20 수정 TxHashAddModal 팝업 추가
}

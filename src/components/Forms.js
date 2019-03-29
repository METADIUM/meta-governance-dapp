import React from 'react'
import { Button, Input, Form, Icon } from 'antd'

import './style/style.css'
import { shouldPass } from '../util'

const { TextArea } = Input

const AddProposalForm = ({
  netName,
  loading,
  stakingMin,
  newAddrErr,
  newLockAmountErr,
  newNodeErr,
  newNameErr,
  handleSubmit = shouldPass(),
  handleChange = shouldPass()
}) =>
  <div className='proposalBody'>
    <Form onSubmit={handleSubmit}>
      <p className='subtitle'>New Authority Address <span className='required'>*</span></p>
      <Form.Item>
        <Input
          name='newAddr'
          onChange={handleChange}
          className={newAddrErr ? 'errInput' : ''}
          disabled={loading}
        />
        <p className={newAddrErr ? 'errHint' : 'errHint-hide'}>Invalid Address</p>
      </Form.Item>
      <div className='divider flex'>
        <div className='flex-full'>
          <p className='subtitle'>Node Name <span className='required'>*</span></p>
          <Form.Item>
            <Input
              name='newName'
              onChange={handleChange}
              className={newNameErr ? 'errInput' : ''}
              disabled={loading}
            />
            <p className={newNameErr ? 'errHint' : 'errHint-hide'}>Invalid Name</p>
          </Form.Item>
        </div>
        <div className='flex-full'>
          <p className='subtitle'>META Amount to be locked <span className='required'>*</span></p>
          <Form.Item>
            <Input
              type='number'
              addonAfter='META'
              name='newLockAmount'
              defaultValue={stakingMin}
              onChange={handleChange}
              className={newLockAmountErr ? 'errInput' : ''}
              disabled={loading}
            />
            <p className={newLockAmountErr ? 'errHint' : 'errHint-hide'}>Invalid Amount</p>
          </Form.Item>
        </div>
      </div>
      <p className='subtitle'>New Authority Node Description <span className='required'>*</span></p>
      <Form.Item>
        <Input
          name='newNode'
          onChange={handleChange}
          className={newNodeErr ? 'errInput' : ''}
          disabled={loading}
          placeholder='6f8a80d1....66ad92a0@10.3.58.6:30303'
        />
        <p className={newNodeErr ? 'errHint' : 'errHint-hide'}>Invalid Node</p>
      </Form.Item>
      <div className='helpDescription'>
        <Icon type='question-circle' />
        <p>
          The hexadecimal node ID is encoded in the username portion of the URL, separated from the host by an @ sign. The hostname can only be given as an IP address, DNS domain names are not allowed. The port in the host name section is the TCP listening port.
        </p>
      </div>
      <p className='subtitle'>Description</p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder='Max. 256 bytes'
          autosize={{ minRows: 4, maxRows: 4 }}
          name='memo'
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item>
        <div className='submitDiv flex'>
          <Button
            name='submit'
            className={'submit_Btn btn-fill-primary text-large ' + netName}
            htmlType='submit'
            disabled={newLockAmountErr || newAddrErr || newNodeErr || newNameErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>

const ReplaceProposalForm = ({
  netName,
  loading,
  stakingMin,
  oldAddrErr,
  newAddrErr,
  newNameErr,
  newNodeErr,
  newLockAmountErr,
  oldNodeErr,
  handleSubmit = shouldPass(),
  handleChange = shouldPass()
}) =>
  <div className='proposalBody'>
    <Form onSubmit={handleSubmit}>
      <p className='subtitle'>Old Authority Address <span className='required'>*</span></p>
      <Form.Item>
        <Input
          name='oldAddr'
          onChange={handleChange}
          className={oldAddrErr ? 'errInput' : ''}
          disabled={loading}
        />
        <p className={oldAddrErr ? 'errHint' : 'errHint-hide'}>Invalid Address</p>
      </Form.Item>
      <p className='subtitle'>New Authority Address <span className='required'>*</span></p>
      <Form.Item>
        <Input
          name='newAddr'
          onChange={handleChange}
          className={newAddrErr ? 'errInput' : ''}
          disabled={loading}
        />
        <p className={newAddrErr ? 'errHint' : 'errHint-hide'}>Invalid Address</p>
      </Form.Item>
      <div className='divider flex'>
        <div className='flex-full'>
          <p className='subtitle'>Node Name <span className='required'>*</span></p>
          <Form.Item>
            <Input
              name='newName'
              onChange={handleChange}
              className={newNameErr ? 'errInput' : ''}
              disabled={loading}
            />
            <p className={newNameErr ? 'errHint' : 'errHint-hide'}>Invalid Name</p>
          </Form.Item>
        </div>
        <div className='flex-full'>
          <p className='subtitle'>Replace META Amount <span className='required'>*</span></p>
          <Form.Item>
            <Input
              type='number'
              addonAfter='META'
              name='newLockAmount'
              defaultValue={stakingMin}
              onChange={handleChange}
              className={newLockAmountErr ? 'errInput' : ''}
              disabled={loading}
            />
            <p className={newLockAmountErr ? 'errHint' : 'errHint-hide'}>Invalid Amount</p>
          </Form.Item>
        </div>
      </div>
      <p className='subtitle'>New Authority Node Description <span className='required'>*</span></p>
      <Form.Item>
        <Input
          name='newNode'
          onChange={handleChange}
          className={newNodeErr ? 'errInput' : ''}
          disabled={loading}
          placeholder='6f8a80d1....66ad92a0@10.3.58.6:30303'
        />
        <p className={newNodeErr ? 'errHint' : 'errHint-hide'}>Invalid Node</p>
      </Form.Item>
      <div className='helpDescription'>
        <Icon type='question-circle' />
        <p>
          The hexadecimal node ID is encoded in the username portion of the URL, separated from the host by an @ sign. The hostname can only be given as an IP address, DNS domain names are not allowed. The port in the host name section is the TCP listening port.
        </p>
      </div>
      <p className='subtitle'>Old Authority Node Description <span className='required'>*</span></p>
      <Form.Item>
        <Input
          name='oldNode'
          onChange={handleChange}
          className={oldNodeErr ? 'errInput' : ''}
          disabled={loading}
          placeholder='6f8a80d1....66ad92a0@10.3.58.6:30303'
        />
        <p className={oldNodeErr ? 'errHint' : 'errHint-hide'}>Invalid Node</p>
      </Form.Item>
      <p className='subtitle'>Description </p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder='Max. 256 bytes'
          autosize={{ minRows: 4, maxRows: 4 }}
          name='memo'
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item>
        <div className='submitDiv flex'>
          <Button
            className={'submit_Btn btn-fill-primary text-large ' + netName}
            htmlType='submit'
            disabled={newLockAmountErr || newAddrErr || newNodeErr || newNameErr || oldAddrErr || oldNodeErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>

const RmoveProposalForm = ({
  netName,
  loading,
  showLockAmount,
  stakingMin,
  oldAddrErr,
  oldLockAmountErr,
  handleSubmit = shouldPass(),
  handleChange = shouldPass(),
  getLockAmount = shouldPass()
}) =>
  <div className='proposalBody'>
    <Form onSubmit={handleSubmit}>
      <p className='subtitle'>Address to be removed <span className='required'>*</span></p>
      <Form.Item>
        <Input.Search
          name='oldAddr'
          onChange={handleChange}
          className={oldAddrErr ? 'errInput' : ''}
          disabled={loading}
          enterButton={<span><Icon type='search' /><span> Check Balance</span></span>}
          onSearch={value => getLockAmount(value)}
        />
        <p className={oldAddrErr ? 'errHint' : 'errHint-hide'}>Invalid Address</p>
      </Form.Item>
      <div className='divider flex'>
        <div className='flex-full'>
          <p className='subtitle'>Locked META Amount</p>
          <Form.Item>
            <Input
              name='showLockAmount'
              value={showLockAmount}
              addonAfter='META'
              disabled
            />
          </Form.Item>
        </div>
        <div className='flex-full'>
          <p className='subtitle'>META Amount to be unlocked <span className='required'>*</span></p>
          <Form.Item>
            <Input
              type='number'
              addonAfter='META'
              name='oldLockAmount'
              defaultValue={stakingMin}
              onChange={handleChange}
              className={oldLockAmountErr ? 'errInput' : ''}
              disabled={loading}
            />
            <p className={oldLockAmountErr ? 'errHint' : 'errHint-hide'}>Invalid Amount</p>
          </Form.Item>
        </div>
      </div>
      <p className='subtitle'>Description</p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder='Max. 256 bytes'
          autosize={{ minRows: 4, maxRows: 4 }}
          name='memo'
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item>
        <div className='submitDiv flex'>
          <Button
            className={'submit_Btn btn-fill-primary text-large ' + netName}
            htmlType='submit'
            disabled={oldLockAmountErr || oldAddrErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>

const UpdateProposalForm = ({
  netName,
  loading,
  newNameErr,
  newNodeErr,
  handleSubmit = shouldPass(),
  handleChange = shouldPass()
}) =>
  <div className='proposalBody'>
    <Form onSubmit={handleSubmit}>
      <p className='subtitle'>New Node Name <span className='required'>*</span></p>
      <Form.Item>
        <Input
          name='newName'
          onChange={handleChange}
          className={newNameErr ? 'errInput' : ''}
          disabled={loading}
        />
        <p className={newNameErr ? 'errHint' : 'errHint-hide'}>Invalid Name</p>
      </Form.Item>
      <p className='subtitle'>New Node Description <span className='required'>*</span></p>
      <Form.Item>
        <Input
          type='primary'
          name='newNode'
          onChange={handleChange}
          className={newNodeErr ? 'errInput' : ''}
          disabled={loading}
          placeholder='6f8a80d1....66ad92a0@10.3.58.6:30303'
        />
        <p className={newNodeErr ? 'errHint' : 'errHint-hide'}>Invalid Node</p>
      </Form.Item>
      <div className='helpDescription'>
        <Icon type='question-circle' />
        <p>
          The hexadecimal node ID is encoded in the username portion of the URL, separated from the host by an @ sign. The hostname can only be given as an IP address, DNS domain names are not allowed. The port in the host name section is the TCP listening port.
        </p>
      </div>
      <p className='subtitle'>Description</p>
      <Form.Item>
        <TextArea
          rows={4}
          placeholder='Max. 256 bytes'
          autosize={{ minRows: 4, maxRows: 4 }}
          name='memo'
          onChange={handleChange}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item>
        <div className='submitDiv flex'>
          <Button
            className={'submit_Btn btn-fill-primary text-large ' + netName}
            htmlType='submit'
            disabled={newNodeErr || newNameErr}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  </div>

export {
  AddProposalForm,
  ReplaceProposalForm,
  RmoveProposalForm,
  UpdateProposalForm
}

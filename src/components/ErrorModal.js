import React from 'react'
import { Button, Modal, Icon } from 'antd'
import './style/style.css'

const ErrModal = ({title, err, link, visible, coloseErrModal=f => f}) => {
    return <Modal
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
}

export { ErrModal }
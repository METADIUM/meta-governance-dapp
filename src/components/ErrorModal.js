import React from 'react'
import { Button, Modal, Icon } from 'antd'
import './style/style.css'

const ErrModal = ({title, err, visible, coloseErrModal=f => f}) => {
    console.log(err)
    return <Modal
        className='errorModal'
        title={title}
        visible={visible}
        onCancel={coloseErrModal}
        footer={[<Button key="ok" onClick={coloseErrModal}>Okay</Button>]}>
        <p>Please revises the following information!</p>
        <div>
            <div><Icon type="exclamation-circle" /><p>{err}</p></div>
        </div>
    </Modal>
}

export { ErrModal }
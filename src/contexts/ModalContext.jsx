import React, { createContext } from 'react'

import { ErrModal } from '../components'
import { useModal } from '../hooks/useModal'

const ModalContext = createContext()

const ModalProvider = ({ children }) => {
  const {
    setIsModalOpened,
    getErrModal,
    isModalOpened,
    title,
    content,
    errLink
  } = useModal()
  return (
    <ModalContext.Provider
      value={{
        setIsModalOpened,
        getErrModal,
        isModalOpened,
        title,
        content,
        errLink
      }}
    >
      {children}
      <ErrModal />
    </ModalContext.Provider>
  )
}

export { ModalContext, ModalProvider }

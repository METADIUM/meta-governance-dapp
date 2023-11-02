import { Layout } from 'antd'
import React, { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { AccessFailedModal } from './components'
import { AuthCtx } from './contexts/AuthContext'
import { GovInitCtx } from './contexts/GovernanceInitContext'
import { ModalContext } from './contexts/ModalContext'
import { usePrevious } from './hooks/usePrevious'
import Loading from './Loading'
import { web3Instance } from './web3'

import './App.css'
import './components/style/style.css'
import './assets/scss/common.scss'

const { Content } = Layout

export const withLocation = (Component) => {
  return (props) => <Component {...props} location={useLocation()} />
}

const App = ({ children }) => {
  const { getErrModal } = useContext(ModalContext)
  const { isWeb3Loaded, isContractReady, accessFailMsg } =
    useContext(GovInitCtx)
  const { address, chain, onLogout, updateAccountData } = useContext(AuthCtx)
  const { pathname } = useLocation()
  const prev = usePrevious(chain)

  const _chainId = chain?.id
  const _prevChainId = prev.current?.id

  useEffect(() => {
    const isChanged = _chainId !== _prevChainId
    if (!!_chainId && !!_prevChainId && isChanged) {
      onLogout()
    }
  }, [_chainId, _prevChainId, onLogout])

  useEffect(() => {
    if (address && web3Instance) {
      updateAccountData(address)
    }
  }, [address, updateAccountData])

  const checkPath =
    pathname === '/wait' ||
    pathname === '/governance' ||
    pathname === '/wait/' ||
    pathname === '/governance/' ||
    pathname === '/governance/detail' ||
    pathname === '/history' ||
    pathname === '/history/'

  return (
    <>
      <AccessFailedModal visible={!!accessFailMsg} message={accessFailMsg} />
      {(isContractReady && isWeb3Loaded) ||
      window.navigator.userAgent === 'ReactSnap' ? (
          checkPath ? (
          <>
            {React.cloneElement(children, {
              getErrModal,
              address
            })}
          </>
          ) : (
          <>
            {/* <div className='flex-column voting-wrap'> */}
            <Content>
              {isWeb3Loaded ? (
                <div>
                  {React.cloneElement(children, {
                    getErrModal,
                    address
                  })}
                </div>
              ) : (
                getErrModal(
                  'This is an unknown network. Please connect to METADIUM network',
                  'Connecting Error'
                )
              )}
            </Content>
          </>
          )
        ) : (
          <Loading />
        )}
    </>
  )
}

export default withLocation(App)

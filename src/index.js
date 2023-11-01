import React from 'react'
import { hydrate, render } from 'react-dom'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import App from './App'
import './index.css'
import './i18n'
import Footer from './components/Footer'
import Header from './components/Header'
import WalletConnector from './components/WalletConnector'
import { AuthProvider } from './contexts/AuthContext'
import { GovInitProvider } from './contexts/GovernanceInitContext'
import { ModalProvider } from './contexts/ModalContext'
import Home from './Home'
import Loading from './Loading'
import VotingDetail from './pages/voting/detail'
import VotingList from './pages/voting/list'
import Proposal from './pages/voting/proposal'
import * as serviceWorker from './serviceWorker'

const renderApp = () => (
  <BrowserRouter>
    <ModalProvider>
      <GovInitProvider>
        <WalletConnector>
          <AuthProvider>
            <Header />
            <App>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/voting/list' element={<VotingList />} />
                <Route path='/voting/detail' element={<VotingDetail />} />
                <Route path='/voting/proposal' element={<Proposal />} />
                <Route path='/my-info' element={<Proposal />} />
                <Route path='/loading' element={<Loading />} />
                <Route path='/*' element={<Navigate replace to='/' />} />
              </Routes>
            </App>
            <Footer />
          </AuthProvider>
        </WalletConnector>
      </GovInitProvider>
    </ModalProvider>
  </BrowserRouter>
)

const rootElement = document.getElementById('root')
if (rootElement.hasChildNodes()) {
  hydrate(renderApp(), rootElement)
} else {
  render(renderApp(), rootElement)
}
serviceWorker.unregister()

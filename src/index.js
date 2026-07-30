import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import App from "./App";
import "./index.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import WalletConnector from "./components/WalletConnector";
import { AuthProvider } from "./contexts/AuthContext";
import { GovInitProvider } from "./contexts/GovernanceInitContext";
import { ModalProvider } from "./contexts/ModalContext";
import Home from "./Home";
import Loading from "./Loading";
import VotingDetail from "./pages/voting/detail";
import VotingList from "./pages/voting/list";
import Proposal from "./pages/voting/proposal";
import * as serviceWorker from "./serviceWorker";

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
);

const rootElement = document.getElementById("root");
// react-snap 이 프리렌더한 마크업이 있으면 hydrate, 없으면 새로 렌더한다.
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, renderApp());
} else {
  createRoot(rootElement).render(renderApp());
}
serviceWorker.unregister();

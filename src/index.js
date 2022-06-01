import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const renderApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      {/* Replace route when entering a different route */}
      <Route path="/*" element={<Navigate replace to="/" />}></Route>
    </Routes>
  </BrowserRouter>
);

ReactDOM.render(renderApp(), document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

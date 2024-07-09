import React from "react";
import { ArweaveWalletKit } from "arweave-wallet-kit";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Monitor from "./pages/Monitor";
import MonitorDetail from "./pages/MonitorDetail";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <ArweaveWalletKit>
      <Router>
        <Navbar />
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/monitor/:id" element={<MonitorDetail />} />
          </Routes>
      </Router>
    </ArweaveWalletKit>
  );
};

export default App;

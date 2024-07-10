import React from "react";
import { ArweaveWalletKit } from "arweave-wallet-kit";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Monitor from "./pages/Monitor";
import MonitorDetail from "./pages/MonitorDetail";
import Navbar from "./components/Navbar";
import Analyzer from "./pages/Analyzer";

const App = () => {
  return (
    <ArweaveWalletKit>
      <Router>
        <Navbar />
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/monitor/:id" element={<MonitorDetail />} />
          <Route path="/analyze/:id" element={<Analyzer />} />

          
          </Routes>
      </Router>
    </ArweaveWalletKit>
  );
};

export default App;

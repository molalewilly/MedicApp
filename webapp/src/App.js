// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/loginsignup/login";
import Signup from "./components/loginsignup/signup";
import Dashboard from "./components/Dashboard/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/*" element={<Dashboard />} /> {/* updated */}
      </Routes>
    </Router>
  );
}

export default App;

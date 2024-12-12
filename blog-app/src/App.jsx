import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Views/Register";
import Login from "./Views/Login";
import Home from "./Views/Home";
import Perfil from "./Views/Perfil";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/perfil" element={<Perfil />} />
    </Routes>
  </Router>
);

export default App;

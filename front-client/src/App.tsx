import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Main from "./components/Main/Main";
import SignUp from "./components/SignUp/Signup";
import Login from "./components/Login/Login";
import MainCreateRoom from "./components/Main/MainCreateRoom";
import LayoutPage from "./components/Common/LayoutPage";
function App() {
  return (
    <div className="App bg-black">
      <Routes>
        <Route path="/" element={<Login />} />       
        <Route path="/main" element={<Main />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;

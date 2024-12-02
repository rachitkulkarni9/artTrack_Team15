import React from "react";
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Test from "./components/Test";
import UseCase1 from "./components/UseCase1";
import UseCase2 from "./components/UseCase2";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="/use-case-1" element={<UseCase1 />} />
        <Route path="/use-case-2" element={<UseCase2 />} />
      </Routes>
    </Router>
  );
};

export default App;

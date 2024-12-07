import React from "react";
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Test from "./components/Test";
import UseCase1 from "./components/FilterAndFind";
import UseCase2 from "./components/ArtThroughTime";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="/filter-and-find" element={<UseCase1 />} />
        <Route path="/art-through-time" element={<UseCase2 />} />
      </Routes>
    </Router>
  );
};

export default App;

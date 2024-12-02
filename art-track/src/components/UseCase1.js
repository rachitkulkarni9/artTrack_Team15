import React from "react";
import { Link } from "react-router-dom";
import "../styles/UseCase1.css";

const UseCase1 = () => {
  return (
    <div className="use-case-page">
      <h2>Use Case 1</h2>
      <p>This page explains the details and functionalities for Use Case 1.</p>
      <Link to="/" className="home-button">
        <button>Home</button>
      </Link>
    </div>
  );
};

export default UseCase1;

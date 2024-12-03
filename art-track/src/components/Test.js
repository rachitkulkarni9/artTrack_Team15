import React from "react";
import { Link } from "react-router-dom";
import "../styles/test.css";
import logo from "../assets/arttrack.png"; 

const Test = () => {
  return (
    <div className="home-page">
      <header>
        <img src={logo} alt="ArtTrack Logo" className="logo" />
        <h1>ArtTrack</h1>
      </header>
      <p className="intro">
        Uncover the stories behind the art. ArtTrack simplifies the exploration of artwork histories, from ownership and transfers to cultural connections. Built on advanced semantic web technologies, our platform provides a seamless way to trace provenance, verify authenticity, and discover the broader narratives that give art its significance.
      </p>
      <div className="card-container">
        <Link to="/use-case-1" className="card">
          <h3>Use Case 1</h3>
          <p>Explore the first scenario to dive deep into art provenance and history.</p>
        </Link>
        <Link to="/use-case-2" className="card">
          <h3>Use Case 2</h3>
          <p>Analyze the second use case for understanding art connections.</p>
        </Link>
      </div>
      <footer className="footer">
        <p>Made with ❤️ by Team 15</p>
      </footer>
    </div>
  );
};


export default Test;

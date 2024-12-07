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
      Ready to unleash your inner art detective? ArtTrack is your one-stop shop for exploring the details of art history, from who made it to the cultural vibes it brings to the table. With smart tech working behind the scenes (don’t worry, we won’t bore you with the nerdy details… unless you ask), you can filter, sort, and dive into artworks like a pro. Want to explore the Renaissance or just find out how big a painting really is? We've got you covered. So grab your virtual magnifying glass and let’s make some epic art discoveries—because who said art history can’t be fun?
      </p>
      <div className="card-container">
        <Link to="/filter-and-find" className="card">
          <h3>Filter And Find</h3>
          <p>Find artworks with dynamic filters tailored to your preferences.</p>
        </Link>
        <Link to="/art-through-time" className="card">
          <h3>Art Through Time</h3>
          <p>Explore artworks from specific cultural periods with customizable filters.</p>
        </Link>
      </div>
      <footer className="footer">
        <p>Made with ❤️ by Team 15</p>
      </footer>
    </div>
  );
};


export default Test;

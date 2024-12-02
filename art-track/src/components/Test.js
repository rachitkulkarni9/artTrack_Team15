import React from "react";
import { Link } from "react-router-dom";

const Test = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>ArtTrack</h1>
      <div style={{ margin: "20px" }}>
        <Link to="/use-case-1">
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            Use Case 1
          </button>
        </Link>
      </div>
      <div style={{ margin: "20px" }}>
        <Link to="/use-case-2">
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            Use Case 2
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Test;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/UseCase2.css";

const ArtThroughTime = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedSubperiods, setSelectedSubperiods] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const periods = {
    "Renaissance and Baroque": [
      "Early Renaissance",
      "High Renaissance",
      "Mannerism",
      "Baroque",
      "Rococo",
    ],
    "Modern Art Movements": [
      "Neoclassicism",
      "Romanticism",
      "Realism",
      "Impressionism",
      "Post-Impressionism",
      "Symbolism",
    ],
    "20th Century Movements": [
      "Fauvism",
      "Expressionism",
      "Cubism",
      "Futurism",
      "Constructivism",
      "Dada",
      "Surrealism",
      "Abstract Expressionism",
      "Pop Art",
      "Minimalism",
      "Postmodernism",
    ],
    "Contemporary Art": [
      "Conceptual Art",
      "Performance Art",
      "Digital Art",
    ],
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/art-through-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedPeriod, selectedSubperiods }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "An unknown error occurred.");
      }
    } catch (err) {
      setError("Error submitting form: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedPeriod("");
    setSelectedSubperiods([]);
    setResults([]);
    setError(null);
  };

  return (
    <div className="use-case-page">
      <Link to="/" className="home-button">
        <button>Home</button>
      </Link>
      <h2>Art Through Time...</h2>
      <p className="description">Step into the past with Art Through Time, where you can explore the art vibes of your favorite cultural periods. Whether you’re all about the Renaissance, Baroque, or something a bit more modern, this page lets you fetch all the juicy artwork details from across datasets. Once you’ve picked a period, we throw in extra filters so you can narrow things down to exactly what you’re looking for. Think of it as a guided art tour—but you’re the boss, and the guide takes your orders. Let’s make some history, one filter at a time!</p>

      <div className="form-section">
        <h3>Period:</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => {
            setSelectedPeriod(e.target.value);
            setSelectedSubperiods([]);
          }}
        >
          <option value="">Select Period</option>
          {Object.keys(periods).map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>

        {selectedPeriod && (
          <>
            <h3>Subperiods:</h3>
            <div className="checkbox-group">
              {periods[selectedPeriod].map((subperiod) => (
                <label key={subperiod}>
                  <input
                    type="checkbox"
                    value={subperiod}
                    checked={selectedSubperiods.includes(subperiod)}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setSelectedSubperiods((prev) =>
                        checked ? [...prev, value] : prev.filter((sp) => sp !== value)
                      );
                    }}
                  />
                  {subperiod}
                </label>
              ))}
            </div>
          </>
        )}

        <div className="form-buttons">
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
          <button className="reset-button" onClick={handleReset}>
            Reset Filters
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div>
        <h3>Results</h3>
        <ul>
          {results.map((item, index) => (
            <li key={index}>
              <p>Title: {item.title}</p>
              <p>Culture: {item.culture}</p>
              <p>Date Created: {item.dateCreated}</p>
              <p>Medium: {item.medium}</p>
              <p>Museum: {item.musuem}</p>
              <p>Dimensions: {item.dimensions}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArtThroughTime;

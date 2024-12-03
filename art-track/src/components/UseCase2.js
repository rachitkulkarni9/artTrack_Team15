import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/UseCase2.css";

const UseCase2 = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedSubperiods, setSelectedSubperiods] = useState([]);

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
    "Contemporary Art": ["Conceptual Art", "Performance Art", "Digital Art"],
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
    setSelectedSubperiods([]); // Clear subperiods when the period changes
  };

  const handleSubperiodChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSubperiods((prev) =>
      checked ? [...prev, value] : prev.filter((subperiod) => subperiod !== value)
    );
  };

  const handleReset = () => {
    setSelectedPeriod("");
    setSelectedSubperiods([]);
  };

  const handleSubmit = () => {
    console.log("Selected Period:", selectedPeriod);
    console.log("Selected Subperiods:", selectedSubperiods);
  };

  return (
    <div className="use-case-page">
      <Link to="/" className="home-button">
        <button>Home</button>
      </Link>
      <h2>Use Case 2</h2>
      <p className="description">
        Explore artworks by selecting an art period and its subperiods.
      </p>

      <div className="form-section">
        {/* Period Selection */}
        <h3>Select Period:</h3>
        <select
          className="dropdown"
          value={selectedPeriod}
          onChange={handlePeriodChange}
          required
        >
          <option value="" disabled>
            Select an Art Period
          </option>
          {Object.keys(periods).map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>

        {/* Subperiods Checkboxes */}
        {selectedPeriod && (
          <div className="subperiods-section">
            <h3>Subperiods:</h3>
            {periods[selectedPeriod].map((subperiod) => (
              <label key={subperiod} className="checkbox-label">
                <input
                  type="checkbox"
                  value={subperiod}
                  checked={selectedSubperiods.includes(subperiod)}
                  onChange={handleSubperiodChange}
                />
                {subperiod}
              </label>
            ))}
          </div>
        )}

        {/* Form Buttons */}
        <div className="form-buttons">
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
          <button className="reset-button" onClick={handleReset}>
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default UseCase2;

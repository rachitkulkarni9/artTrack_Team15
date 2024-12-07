import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/UseCase1.css";

const FIlterAndFind = () => {
  const [formData, setFormData] = useState({
    selectedMuseums: [],
    medium: "",
    startYear: "",
    endYear: "",
    minSize: "",
    maxSize: "",
  });

  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const handleMuseumChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      selectedMuseums: checked
        ? [...prev.selectedMuseums, value]
        : prev.selectedMuseums.filter((museum) => museum !== value),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "startYear" || name === "endYear") {
      if (/^\d{0,4}$/.test(value)) { 
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      selectedMuseums: [],
      medium: "",
      startYear: "",
      endYear: "",
      minSize: "",
      maxSize: "",
    });
    setResults([]); 
    setError(null); 
  };

  const handleSubmit = async () => {
    
    if (
      formData.selectedMuseums.length === 0 &&
      !formData.medium.trim() &&
      !formData.startYear.trim() &&
      !formData.endYear.trim() &&
      !formData.minSize.trim() &&
      !formData.maxSize.trim()
    ) {
      setError("Please provide at least one input before submitting.");
      return;
    }
  
    setLoading(true); 
    setError(null); 
    try {
      const response = await fetch("http://localhost:5000/api/filter-and-find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Backend Response:", data);
  
        if (data.results && data.results.length > 0) {
          setResults(data.results); 
        } else {
          setResults([])
          setError("No results found or invalid response structure.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "An unknown error occurred.");
        setResults([])
      }
    } catch (error) {
      setError("Error submitting form: " + error.message);
    } finally {
      setLoading(false); 
    }
  };
  

  return (
    <div className="use-case-page">
      <Link to="/" className="home-button">
        <button>Home</button>
      </Link>
      <h2>Filter And Find...</h2>
      <p className="description">
      Ever wished you could swipe right on artworks? Filter And Find is here to make your art-hunting dreams come true! Pick and choose your filters—museums, mediums, year ranges, dimensions—you name it, we’ve got it. This page lets you be as picky as you want while fetching exactly what you’re looking for from our datasets. With a smooth interface and results served up just right, it’s like matchmaking for art enthusiasts. Who knows? Your next masterpiece obsession might just be a filter away!
      </p>

      <div className="form-section">
        <h3>Museums (Select at least one):</h3>
        <div className="museum-group">
          {/* Museum checkboxes */}
          {["Boston", "Fine Arts Boston", "Harvard Art Museums website", "Kimbell Art Museum", "NGA", "Nelson Atkins Museum", "Renaissance Art", "Yale Univesity Art Gallery"].map((museum) => (
            <label key={museum}>
              <input
                type="checkbox"
                value={museum}
                checked={formData.selectedMuseums.includes(museum)}
                onChange={handleMuseumChange}
              />
              {museum}
            </label>
          ))}
        </div>

        {/* Other input fields */}
        <h3>Medium:</h3>
        <input
          type="text"
          className="medium-input"
          placeholder="Enter medium"
          name="medium"
          value={formData.medium}
          onChange={handleInputChange}
        />

        <h3>Year Range:</h3>
        <div className="size-range">
          <input
            type="number"
            step="1"
            className="size-input"
            placeholder="Start Year"
            name="startYear"
            value={formData.startYear}
            onChange={handleInputChange}
            min="1000"
            max="9999"
          />
          <span> - </span>
          <input
            type="number"
            step="1"
            className="size-input"
            placeholder="End Year"
            name="endYear"
            value={formData.endYear}
            onChange={handleInputChange}
            min="1000"
            max="9999"
          />
        </div>

        <h3>Size Range:</h3>
        <div className="size-range">
          <input
            type="number"
            step="any"
            className="size-input"
            placeholder="Min Size"
            name="minSize"
            value={formData.minSize}
            onChange={handleInputChange}
          />
          <span> - </span>
          <input
            type="number"
            step="any"
            className="size-input"
            placeholder="Max Size"
            name="maxSize"
            value={formData.maxSize}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-buttons">
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
          <button className="reset-button" onClick={handleReset}>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Error Display */}
      {error && <p className="error-message">{error}</p>}

      {/* Results Display */}
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

export default FIlterAndFind;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/UseCase1.css";

const UseCase1 = () => {
  const [formData, setFormData] = useState({
    selectedMuseums: [],
    medium: "",
    startYear: "",
    endYear: "",
    minSize: "",
    maxSize: "",
  });

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
      if (/^\d{0,4}$/.test(value)) { // Enforce 4-digit limit
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
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="use-case-page">
      <Link to="/" className="home-button">
        <button>Home</button>
      </Link>
      <h2>Use Case 1</h2>
      <p className="description">
        This page allows you to explore artworks based on selected filters, such as museums, medium, years, and size.
      </p>

      <div className="form-section">
        <h3>Museums (Select at least one):</h3>
        <div className="museum-group">
          <div>
            <label>
              <input
                type="checkbox"
                value="Boston"
                checked={formData.selectedMuseums.includes("Boston")}
                onChange={handleMuseumChange}
              />
              Boston
            </label>
            <label>
              <input
                type="checkbox"
                value="Fine Arts Boston"
                checked={formData.selectedMuseums.includes("Fine Arts Boston")}
                onChange={handleMuseumChange}
              />
              Fine Arts Boston
            </label>
            <label>
              <input
                type="checkbox"
                value="Harvard"
                checked={formData.selectedMuseums.includes("Harvard")}
                onChange={handleMuseumChange}
              />
              Harvard
            </label>
            <label>
              <input
                type="checkbox"
                value="Kimbell"
                checked={formData.selectedMuseums.includes("Kimbell")}
                onChange={handleMuseumChange}
              />
              Kimbell
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="NGA"
                checked={formData.selectedMuseums.includes("NGA")}
                onChange={handleMuseumChange}
              />
              NGA
            </label>
            <label>
              <input
                type="checkbox"
                value="Nelson"
                checked={formData.selectedMuseums.includes("Nelson")}
                onChange={handleMuseumChange}
              />
              Nelson
            </label>
            <label>
              <input
                type="checkbox"
                value="RenArt"
                checked={formData.selectedMuseums.includes("RenArt")}
                onChange={handleMuseumChange}
              />
              RenArt
            </label>
            <label>
              <input
                type="checkbox"
                value="Yale"
                checked={formData.selectedMuseums.includes("Yale")}
                onChange={handleMuseumChange}
              />
              Yale
            </label>
          </div>
        </div>

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
    </div>
  );
};

export default UseCase1;

import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="App">
      <h1 style={{ textAlign: "center" }}>CSV Data Visualization</h1>

      {/* File Input Section */}
      <div
        style={{
          border: "2px dashed gray",
          padding: "20px",
          margin: "20px auto",
          textAlign: "center",
          width: "60%",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Click to choose your CSV file or drop it here</p>
        <input
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          id="fileInput"
          onChange={handleFileChange}
        />
        <label
          htmlFor="fileInput"
          style={{
            display: "inline-feature_block",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Choose File
        </label>
        {file && (
          <p style={{ marginTop: "10px" }}>Selected File: {file.name}</p>
        )}
      </div>

      {/* Feature Buttons and Dropdowns */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div>
          <div class="feature_block">Feature 1</div>
          <select
            style={{
              display: "feature_block",
              marginTop: "10px",
              width: "110px",
              height: "30px",
              borderRadius: "5px",
            }}
          >
            <option value="">Select Type</option>
            <option value="numerical">Numerical</option>
            <option value="categorical">Categorical</option>
          </select>
        </div>
        <div>
          <div class="feature_block">Feature 2</div>
          <select
            style={{
              display: "feature_block",
              marginTop: "10px",
              width: "110px",
              height: "30px",
              borderRadius: "5px",
            }}
          >
            <option value="">Select Type</option>
            <option value="numerical">Numerical</option>
            <option value="categorical">Categorical</option>
          </select>
        </div>
        <div>
          <div class="feature_block">Feature 3</div>
          <select
            style={{
              display: "feature_block",
              marginTop: "10px",
              width: "110px",
              height: "30px",
              borderRadius: "5px",
            }}
          >
            <option value="">Select Type</option>
            <option value="numerical">Numerical</option>
            <option value="categorical">Categorical</option>
          </select>
        </div>
        <div className="visualize-container">
          <button class="visualize-button">Visualize</button>
        </div>
      </div>

      {/* Graph Section */}
      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
          border: "2px dashed gray",
          width: "90%",
          minHeight: "300px",
          maxHeight: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>Graph here</h2>
      </div>
      <div>
        <select
          style={{
            display: "feature_block",
            marginTop: "10px",
            width: "150px",
            height: "40px",
            fontSize: 14,
            display: "inline-feature_block",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <option value="">Select Type</option>
          <option value="Pie Chart">Pie Chart</option>
          <option value="Bar Chart">Bar Chart</option>
        </select>
      </div>
    </div>
  );
}

export default App;

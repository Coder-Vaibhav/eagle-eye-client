import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "./utils";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {RandomDots} from "./components/RandomDots";
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App() {
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [optionChecked, setOptionChecked] = useState(false);
  const [futureChecked, setFutureChecked] = useState(false); 
  const [optQty, setOptQty] = useState('');
  const [futQty, setFutQty] = useState('');
  const [transactionMode, setTransactionMode] = useState('');
  const [active, setActive] = useState('');
  const [updateDisabled, setUpdateDisabled] = useState(true);
  const [showDetails, setShowDetails] = useState(false); // New state to control visibility of details section

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleGetJson = async () => {
    try {
      const { data } = await axios.get(API_URL+"/"+name);
      const foundItem = data.find(item => item.name === name);
      if (foundItem) {
        const configjson = JSON.parse(foundItem.configjson);
        setClientId(configjson.CLIENT_ID || "");
        setAccessToken(configjson.ACCESS_TOKEN || "");
        setOptionChecked(configjson.SECURITY.includes("opt"));
        setFutureChecked(configjson.SECURITY.includes("fut"));
        setOptQty(configjson.OPT_QTY || 0);
        setFutQty(configjson.FUT_QTY || 0);
        setTransactionMode(configjson.OPTION_TRANSACTION_MODE || "");
        setActive(configjson.ACTIVE || 0);
        setUpdateDisabled(false);
        setShowDetails(true); // Show details section if data is found
      } else {
        alert('User not found!');
      }
    } catch (error) {
      console.error('Error fetching JSON:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      // Validation for Option Quantity and Future Quantity
      if (parseInt(optQty) % 25 !== 0) {
        alert("Option Quantity must be a multiple of 25.");
        return;
      }
      if (parseInt(futQty) % 25 !== 0) {
        alert("Future Quantity must be a multiple of 25.");
        return;
      }
      
      const security = []; 
      if (optionChecked) security.push("opt"); 
      if (futureChecked) security.push("fut");
      const updatedConfig = {
        CLIENT_ID: clientId,
        ACCESS_TOKEN: accessToken,
        SECURITY: security.join(", "),
        OPT_QTY: parseInt(optQty),
        FUT_QTY: parseInt(futQty),
        OPTION_TRANSACTION_MODE: transactionMode,
        ACTIVE: parseInt(active),
      };
      await axios.post(API_URL, { name, configjson: JSON.stringify(updatedConfig) });
      alert('Updated successfully!');
    } catch (error) {
      console.error('Error updating JSON:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (e.target.id === 'nameInput') {
        handleGetJson();
      } 
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RandomDots />
      <div className="container mt-1 md-5">
        <h1 className="text-center text-warning md-3">Dhan Algo Trading</h1>

        <div className="input-container mt-3">
          <input
            id="nameInput"
            type="text"
            value={name}
            disabled={showDetails}
            onKeyPress={handleKeyPress}
            onChange={handleNameChange}
            placeholder="Enter Username"
            className="form-control mb-3"
          />
          <button onClick={handleGetJson} disabled={showDetails} className="btn btn-primary mb-3">
            Get Details
          </button>

          {showDetails && (
            <div id="details">
              <div className="mb-3">
                <label htmlFor="clientIdInput">Dhan Client ID:</label>
                <input
                  id="clientIdInput"
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Enter Client ID"
                  className="form-control mb-3"
                />
                <label htmlFor="accessTokenInput">Dhan Access Token:</label>
                <textarea
                  id="accessTokenInput"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  rows="4"
                  placeholder="Enter Access Token"
                  className="form-control mb-3"
                />
                <div className="mb-3">
                  <label className="mb-0">Security:</label>
                  <div className="form-check form-check-inline">
                    <input
                      type="checkbox"
                      id="optionCheckbox"
                      className="form-check-input"
                      checked={optionChecked}
                      onChange={() => setOptionChecked(!optionChecked)}
                    />
                    <label htmlFor="optionCheckbox" className="form-check-label">Option</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="checkbox"
                      id="futureCheckbox"
                      className="form-check-input"
                      checked={futureChecked}
                      onChange={() => setFutureChecked(!futureChecked)}
                    />
                    <label htmlFor="futureCheckbox" className="form-check-label">Future</label>
                  </div>
                </div>
                <div className="mb-3">
                  <label>Option Transaction Mode:</label>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      id="buyerRadio"
                      className="form-check-input"
                      value="b"
                      checked={transactionMode === "b"}
                      onChange={() => setTransactionMode("b")}
                    />
                    <label htmlFor="buyerRadio" className="form-check-label">Buyer</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      id="sellerRadio"
                      className="form-check-input"
                      value="s"
                      checked={transactionMode === "s"}
                      onChange={() => setTransactionMode("s")}
                    />
                    <label htmlFor="sellerRadio" className="form-check-label">Seller</label>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="optQtyInput">Option Quantity:</label>
                  <input
                    id="optQtyInput"
                    type="number"
                    value={optQty}
                    onChange={(e) => setOptQty(e.target.value)}
                    placeholder="Enter Option Quantity (Multiple of 25)"
                    className="form-control mb-3"
                  />
                  <label htmlFor="futQtyInput">Future Quantity:</label>
                  <input
                    id="futQtyInput"
                    type="number"
                    value={futQty}
                    onChange={(e) => setFutQty(e.target.value)}
                    placeholder="Enter Future Quantity"
                    className="form-control mb-3"
                  />
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      id="activeSwitch"
                      className="form-check-input"
                      checked={active === 1}
                      onChange={() => setActive(active === 1 ? 0 : 1)}
                    />
                    <label htmlFor="activeSwitch" className="form-check-label">Active</label>
                  </div>
                </div>
                <button onClick={handleUpdate} disabled={updateDisabled} className="btn btn-primary mb-3">Update</button>
              </div>
            </div>
          )}
        </div>
      </div>

    </ThemeProvider>
  );
}

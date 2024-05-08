import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "./utils";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
// import {RandomDots} from "./components/RandomDots";
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
  const [limitExitActive, setLimitExitActive] = useState(0);
  const [limitExitPoints, setLimitExitPoints] = useState(40);
  const [optionBuyerItmDistance, setOptionBuyerItmDistance] = useState(0);
  const [optionSellerOtmDistance, setOptionSellerOtmDistance] = useState(0);

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
        setLimitExitActive(configjson.CAN_DO_LIMIT_EXIT || 0);
        setLimitExitPoints(configjson.LIMIT_EXIT_POINTS || 40);
        setOptionBuyerItmDistance(configjson.OPTION_BUYER_ITM_DISTANCE || 0);
        setOptionSellerOtmDistance(configjson.OPTION_SELLER_OTM_DISTANCE || 0);
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
        CAN_DO_LIMIT_EXIT: parseInt(limitExitActive),
        LIMIT_EXIT_POINTS: parseInt(limitExitPoints),
        OPTION_BUYER_ITM_DISTANCE: parseInt(optionBuyerItmDistance),
        OPTION_SELLER_OTM_DISTANCE: parseInt(optionSellerOtmDistance),
        ACTIVE: parseInt(active),
      };
      await axios.post(API_URL, { name, configjson: JSON.stringify(updatedConfig) });
      alert('Updated successfully!');
    } catch (error) {
      console.error('Error updating JSON:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.id === 'nameInput') {
        handleGetJson();
      } 
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* <RandomDots /> */}
        <h1 className="text-center text-info bg-dark py-1">Eagle Algo Trading</h1>
      <div className="container mb-5 mt-3">
        <div class="form-floating mb-3">
          <input
            id="nameInput"
            type="text"
            value={name}
            disabled={showDetails}
            onKeyDown={handleKeyDown}
            onChange={handleNameChange}
            className="form-control"
          />
          <label for="nameInput">Username</label>
        </div>
        <button onClick={handleGetJson} disabled={showDetails} className="btn btn-outline-success">
          Get Details
        </button>

        {showDetails && (
          <div id="details" className="mt-4">
            <div className="card mb-3 custom-card">
              <div className="card-header fw-bold">
                Dhan Account Details
              </div>
              <div className="card-body">
                <div class="form-floating mb-3">
                  <input
                    id="clientIdInput"
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Enter Client ID"
                    className="form-control text-danger"
                  />
                  <label for="clientIdInput">Client ID</label>
                </div>
                <div class="form-floating">
                  <textarea
                    id="accessTokenInput"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    style={{"height" : "100px"}}
                    placeholder="Enter Access Token"
                    className="form-control text-danger"
                  />
                  <label for="accessTokenInput">Access Token</label>
                </div>
              </div>
            </div>
            
            <div className="card mb-3 custom-card">
              <div className="card-header fw-bold">
                Security
              </div>
              <div className="card-body">
                <div className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    id="optionCheckbox"
                    className="form-check-input"
                    checked={optionChecked}
                    onChange={() => setOptionChecked(!optionChecked)}
                  />
                  <label for="optionCheckbox" className="form-check-label">Option</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    id="futureCheckbox"
                    className="form-check-input"
                    checked={futureChecked}
                    onChange={() => setFutureChecked(!futureChecked)}
                  />
                  <label for="futureCheckbox" className="form-check-label">Future</label>
                </div>
              </div>
            </div>

            {optionChecked && (
              <div className="card mb-3 custom-card">
                <div className="card-header fw-bold">
                  Option Security Details
                </div>
                <div className="card-body">
                  <div class="form-floating">
                    <input
                      id="optQtyInput"
                      type="number"
                      value={optQty}
                      disabled={!optionChecked}
                      onChange={(e) => setOptQty(e.target.value)}
                      placeholder="Enter Option Quantity (Multiple of 25)"
                      className="form-control "
                    />
                    <label for="optQtyInput">Quantity</label>
                  </div>

                  <div className="card my-3">
                    <div className="card-header">
                      Transaction Mode
                    </div>
                    <div className="card-body">
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          id="buyerRadio"
                          className="form-check-input"
                          value="b"
                          disabled={!optionChecked}
                          checked={transactionMode === "b"}
                          onChange={() => setTransactionMode("b")}
                        />
                        <label for="buyerRadio" className="form-check-label">Buyer</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          id="sellerRadio"
                          className="form-check-input"
                          value="s"
                          disabled={!optionChecked}
                          checked={transactionMode === "s"}
                          onChange={() => setTransactionMode("s")}
                        />
                        <label for="sellerRadio" className="form-check-label">Seller</label>
                      </div>
                    </div>
                  </div>

                  {transactionMode === "b" && (
                    <div className="form-floating">
                      <select className="form-select" id="optionBuyerItmDistanceInput" 
                        disabled={!optionChecked || transactionMode === "s"}
                        value={optionBuyerItmDistance}
                        onChange={(e) => setOptionBuyerItmDistance(e.target.value)}
                      >
                        <option value="" selected>Select</option>
                        {[...Array(11)].map((_, index) => (
                          <option key={index} value={(index-1 + 1) * 50}>{(index-1 + 1) * 50}</option>
                        ))}
                      </select>
                      <label for="optionBuyerItmDistanceInput">ITM Distance From Current Spot</label>
                    </div>
                  )}
                  {transactionMode === "s" && (
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="optionSellerOtmDistanceInput"
                        disabled={!optionChecked || transactionMode === "b"}
                        value={optionSellerOtmDistance}
                        onChange={(e) => setOptionSellerOtmDistance(e.target.value)}
                      >
                        <option value="">Select</option>
                        {[...Array(11)].map((_, index) => (
                          <option key={index} value={(index-1 + 1) * 50}>{(index-1 + 1) * 50}</option>
                        ))}
                      </select>
                      <label for="optionSellerOtmDistanceInput">OTM Distance From Current Spot</label>
                    </div>
                  )}
                  
                  <div className="input-group my-3">
                    <span className="input-group-text bg-secondary">
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          id="limitExitActiveSwitch"
                          className="form-check-input"
                          disabled={!optionChecked}
                          checked={limitExitActive === 1}
                          onChange={() => setLimitExitActive(limitExitActive === 1 ? 0 : 1)}
                        />
                      </div>
                    </span>
                    <div className="form-floating">
                      <input
                        id="limitExitPointsInput"
                        type="number"
                        value={limitExitPoints}
                        disabled={limitExitActive !== 1 || !optionChecked}
                        onChange={(e) => setLimitExitPoints(e.target.value)}
                        placeholder="Limit Exit Points"
                        className="form-control "
                      />
                      <label for="limitExitPointsInput">Limit Exit Points</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {futureChecked && (
              <div className="card mb-3 custom-card">
                <div className="card-header fw-bold">
                  Future Security Details
                </div>
                <div className="card-body">
                  <div className="form-floating">
                    <input
                      id="futQtyInput"
                      type="number"
                      value={futQty}
                      disabled={!futureChecked}
                      onChange={(e) => setFutQty(e.target.value)}
                      placeholder="Enter Future Quantity"
                      className="form-control "
                    />
                    <label for="futQtyInput">Quantity</label>
                  </div>
                </div>
              </div>
            )}

            <div className="form-check form-switch">
              <input
                type="checkbox"
                id="activeSwitch"
                className="form-check-input"
                checked={active === 1}
                onChange={() => setActive(active === 1 ? 0 : 1)}
              />
              <label for="activeSwitch" className="form-check-label text-warning fw-bold">Trading Engine</label>
            </div>
            <button onClick={handleUpdate} disabled={updateDisabled} className="btn btn-success btn-lg mt-4 mb-5">Update</button>
          </div>
        )}
      </div>

      <footer class="footer bg-dark text-center">
        <span class="text-white">Copyright &copy; 2024 Eagle Algo Trading <br></br>Developed with ❤️ by Vaibhav D. Raut.</span>
      </footer>
      
    </ThemeProvider>
  );
}

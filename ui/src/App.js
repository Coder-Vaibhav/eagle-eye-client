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

  const formatAmountToRupees = (amount) => {
    // Convert amount to string and split into integer and decimal parts
    const [integerPart, decimalPart] = amount.toFixed(2).toString().split(".");
    // Add commas as thousand separators to the integer part
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // Concatenate the integer and decimal parts with the Rupee symbol
    const formattedAmount = `₹${formattedIntegerPart}.${decimalPart}`;
    return formattedAmount;
  };

  const getMinAmount = () => {
    let minAmount = 0;
    let optMinAmount = 0;
    let futMinAmount = 0;
    let optQuantity = parseInt(optQty || 0) / 25;
    let futQuantity = parseInt(futQty || 0) / 25;
    let oneOptLotPrice = 7500;
    let oneFutLotPrice = 65000;
    if(transactionMode === "s"){
      optMinAmount = oneFutLotPrice * optQuantity;
    }else{
      optMinAmount = oneOptLotPrice * optQuantity;
    }
    futMinAmount = oneFutLotPrice * futQuantity;
    minAmount = optMinAmount + futMinAmount;
    return formatAmountToRupees(minAmount);
  };

  const getMaxAmount = () => {
    let maxAmount = 0;
    let optMaxAmount = 0;
    let futMaxAmount = 0;
    let optMaxDraForOneLot = 23000;
    let optMaxDraChangePerLot = 16000;
    let futMaxDraForOneLot = 40000;
    let optQuantity = parseInt(optQty || 0) / 25;
    let futQuantity = parseInt(futQty || 0) / 25;
    let oneOptLotPrice = 7500;
    let oneFutLotPrice = 65000;
    let calcPercentage = (value, perc) => { 
      if(value <=0){
        return 0;
      }
      return ((value/100)*perc)
    }
    let optMaxDra = optMaxDraForOneLot+(optMaxDraChangePerLot*(optQuantity-1));
    if(transactionMode === "s"){
      optMaxAmount = oneFutLotPrice * optQuantity;
      optMaxAmount = optMaxAmount + (optMaxAmount>0 ? calcPercentage(optMaxDra, 65) :0);
    }else{
      optMaxAmount = oneOptLotPrice * optQuantity;
      optMaxAmount = optMaxAmount + (optMaxAmount>0 ? calcPercentage(optMaxDra, 80) :0);
    }
    futMaxAmount = (oneFutLotPrice * futQuantity) + (futMaxDraForOneLot * futQuantity);
    maxAmount = optMaxAmount + futMaxAmount;
    return formatAmountToRupees(maxAmount);
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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-center">
        <a className="navbar-brand brand-name text-info font-effect-fire" href="/">
          Eagle Eye Algo
        </a>
      </nav>

      <div className="container mb-5 mt-3">
        <div className="form-floating mb-3">
          <input
            id="nameInput"
            type="text"
            value={name}
            disabled={showDetails}
            onKeyDown={handleKeyDown}
            onChange={handleNameChange}
            className="form-control"
          />
          <label htmlFor="nameInput">Username</label>
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
                <div className="form-floating mb-3">
                  <input
                    id="clientIdInput"
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Enter Client ID"
                    className="form-control text-danger"
                  />
                  <label htmlFor="clientIdInput">Client ID</label>
                </div>
                <div className="form-floating">
                  <textarea
                    id="accessTokenInput"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    style={{"height" : "100px"}}
                    placeholder="Enter Access Token"
                    className="form-control text-danger"
                  />
                  <label htmlFor="accessTokenInput">Access Token</label>
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
            </div>

            {optionChecked && (
              <div className="card mb-3 custom-card">
                <div className="card-header fw-bold">
                  Option Security Details
                </div>
                <div className="card-body">
                  <div className="form-floating">
                    <input
                      id="optQtyInput"
                      type="number"
                      value={optQty}
                      disabled={!optionChecked}
                      onChange={(e) => setOptQty(e.target.value)}
                      placeholder="Enter Option Quantity (Multiple of 25)"
                      className="form-control "
                    />
                    <label htmlFor="optQtyInput">Quantity</label>
                  </div>

                  <div className="card my-3">
                    <div className="card-header small">
                      Transaction Mode
                    </div>
                    <div className="card-body p-2">
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
                        <label htmlFor="buyerRadio" className="form-check-label">Buyer</label>
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
                        <label htmlFor="sellerRadio" className="form-check-label">Seller</label>
                      </div>
                    </div>
                  </div>

                  {transactionMode === "b" && (
                    <>
                      <label htmlFor="optionBuyerItmDistanceInput" className="form-label mb-0 small">ITM Distance From Current Spot: <span className="fw-bold">{optionBuyerItmDistance} Points</span></label>
                      <input 
                        type="range" 
                        className="form-range" 
                        min="-350" 
                        disabled={!optionChecked || transactionMode === "s"}
                        max="350" 
                        step="50" 
                        id="optionBuyerItmDistanceInput" 
                        value={optionBuyerItmDistance}
                        onChange={(e) => setOptionBuyerItmDistance(e.target.value)}
                        />
                    </>
                  )}
                  {transactionMode === "s" && (
                    <>
                      <label htmlFor="optionSellerOtmDistanceInput" className="form-label mb-0 small">OTM Distance From Current Spot: <span className="fw-bold">{optionSellerOtmDistance} Points</span></label>
                      <input 
                        type="range" 
                        className="form-range" 
                        min="-350" 
                        disabled={!optionChecked || transactionMode === "b"}
                        max="350" 
                        step="50" 
                        id="optionSellerOtmDistanceInput" 
                        value={optionSellerOtmDistance}
                        onChange={(e) => setOptionSellerOtmDistance(e.target.value)}
                        />
                    </>
                  )}
                  
                  <div className="input-group mt-3">
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
                      <label htmlFor="limitExitPointsInput">Limit Exit Points</label>
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
                    <label htmlFor="futQtyInput">Quantity</label>
                  </div>
                </div>
              </div>
            )}

            <div className="card mb-3 custom-card">
              <div className="card-header fw-bold">
                Capital Needed In Account
              </div>
              <div className="card-body">
                <div className="form-floating">
                  <div class="mb-2">
                    <label class="form-label">Minimum amount:</label>
                    <span class="text-muted">{getMinAmount()}</span>
                  </div>
                  <div>
                    <label class="form-label">Maximum amount:</label>
                    <span class="text-muted">{getMaxAmount()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-check form-switch">
              <input
                type="checkbox"
                id="activeSwitch"
                className="form-check-input"
                checked={active === 1}
                onChange={() => setActive(active === 1 ? 0 : 1)}
              />
              <label htmlFor="activeSwitch" className="form-check-label text-warning fw-bold">Trading Engine</label>
            </div>
            <button onClick={handleUpdate} disabled={updateDisabled} className="btn btn-success btn-lg mt-4 mb-5">Update</button>
          </div>
        )}
      </div>

      <footer className="footer bg-dark text-center">
        <span className="text-white small">Copyright &copy; 2024 Eagle Eye Algo <br/>Developed with ❤️ by Vaibhav D. Raut.</span>
      </footer>
      
    </ThemeProvider>
  );
}

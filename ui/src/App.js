import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "./utils";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
// import { AddUserForm } from "./components/AddUserForm";
// import { User } from "./components/User";
import {RandomDots} from "./components/RandomDots";
import './style.css'; 

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App() {
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [security, setSecurity] = useState('');
  const [optQty, setOptQty] = useState('');
  const [futQty, setFutQty] = useState('');
  const [transactionMode, setTransactionMode] = useState('');
  const [active, setActive] = useState('');
  const [updateDisabled, setUpdateDisabled] = useState(true);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleGetJson = async () => {
    try {
      const { data } = await axios.get(API_URL+"/"+name);
      const foundItem = data.find(item => item.name === name);
      if (foundItem) {
        const configjson = JSON.parse(foundItem.configjson);
        setClientId(configjson.CLIENT_ID);
        setAccessToken(configjson.ACCESS_TOKEN);
        setSecurity(configjson.SECURITY);
        setOptQty(configjson.OPT_QTY);
        setFutQty(configjson.FUT_QTY);
        setTransactionMode(configjson.OPTION_TRANSACTION_MODE);
        setActive(configjson.ACTIVE);
        setUpdateDisabled(false);
      } else {
        alert('Name not found!');
      }
    } catch (error) {
      console.error('Error fetching JSON:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedConfig = {
        CLIENT_ID: clientId,
        ACCESS_TOKEN: accessToken,
        SECURITY: security,
        OPT_QTY: parseInt(optQty),
        FUT_QTY: parseInt(futQty),
        OPTION_TRANSACTION_MODE: transactionMode,
        ACTIVE: parseInt(active),
      };
      await axios.post(API_URL, { name, configjson: JSON.stringify(updatedConfig) });
      alert('JSON updated successfully!');
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
      <RandomDots></RandomDots>
      <div className=" fixed-top-element container">
        <h1>JSON Editor</h1>
        <div className="input-container">
          <label htmlFor="nameInput">Enter Name:</label>
          <input
            id="nameInput"
            type="text"
            value={name}
            onKeyPress={handleKeyPress}
            onChange={handleNameChange}
            placeholder="Enter name"
          />
          <button onClick={handleGetJson}>GET JSON</button>

          <br></br><br></br>

          <label htmlFor="clientIdInput">CLIENT_ID:</label>
          <input
            id="clientIdInput"
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter CLIENT_ID"
          />
          <div className="json-container">
            <label htmlFor="accessTokenInput">ACCESS_TOKEN:</label>
            <textarea
              id="accessTokenInput"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              rows="4"
              placeholder="Enter ACCESS_TOKEN"
            />
          </div>
          <label htmlFor="securityInput">SECURITY:</label>
          <input
            id="securityInput"
            type="text"
            value={security}
            onChange={(e) => setSecurity(e.target.value)}
            placeholder="Enter SECURITY"
          />
          <label htmlFor="optQtyInput">OPT_QTY:</label>
          <input
            id="optQtyInput"
            type="number"
            value={optQty}
            onChange={(e) => setOptQty(e.target.value)}
            placeholder="Enter OPT_QTY"
          />
          <label htmlFor="futQtyInput">FUT_QTY:</label>
          <input
            id="futQtyInput"
            type="number"
            value={futQty}
            onChange={(e) => setFutQty(e.target.value)}
            placeholder="Enter FUT_QTY"
          />
          <label htmlFor="transactionModeInput">OPTION_TRANSACTION_MODE:</label>
          <input
            id="transactionModeInput"
            type="text"
            value={transactionMode}
            onChange={(e) => setTransactionMode(e.target.value)}
            placeholder="Enter OPTION_TRANSACTION_MODE"
          />
          <label htmlFor="activeInput">ACTIVE:</label>
          <input
            id="activeInput"
            type="number"
            value={active}
            onChange={(e) => setActive(e.target.value)}
            placeholder="Enter ACTIVE"
          />
        </div>
        <button onClick={handleUpdate} disabled={updateDisabled}>Update</button>
      </div>
    </ThemeProvider>
  );
}



import React, { useState } from "react";
import './ClientActionModal.css';
import Loader from "../../Loader/Loader";
import ErrorComponent from "../../ErrorComponent/ErrorComponent";

const ClientActionModal = ({
  client,
  onClose,
  onSubmit,
  loading,
  actionType,
  currentLabel = "Current Value",
  inputLabel = "New Value",
  buttonLabel = "Submit",
  clients = [], 
}) => {
  const [newValue, setNewValue] = useState(actionType === "draw" || actionType === "deposit" ? 0 : client.credit);
  const [targetClientId, setTargetClientId] = useState(""); 
  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    setNewValue(e.target.value);
  };

  const handleTargetClientChange = (e) => {
    setTargetClientId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actionType === "transfer" && !targetClientId) {
      setLocalError("Please select a client to transfer to.");
      return;
    }
    onSubmit(client.id, parseFloat(newValue), targetClientId); 
  };

  const getCurrentValue = () => {
    const cash = parseFloat(client.cash) || 0;
    const credit = parseFloat(client.credit) || 0;

    switch (actionType) {
      case "deposit":
        return `$${cash}`;
      case "draw":
        return `$${cash + credit}`;
      case "transfer":
        return `$${cash}`;
      case "credit":
        return `$${credit}`;
      default:
        return `$${cash + credit}`;
    }
  };

  return (
    <div className="modal-overlay">
      {loading ? (
        <Loader />
      ) : (
        <div className="modal-content">
          <h2>
            {actionType === "draw"
              ? `Draw from ${client.name}`
              : actionType === "deposit"
                ? `Deposit to ${client.name}`
                : actionType === "transfer"
                  ? `Transfer from ${client.name}`
                  : `Change Credit for ${client.name}`}
          </h2>
          <p>ID: {client.id}</p>
          <p>{currentLabel}: {getCurrentValue()}</p>
          <form onSubmit={handleSubmit}>
            {actionType === "transfer" && (
              <>
                <label>
                  Transfer to:
                  <select value={targetClientId} onChange={handleTargetClientChange}>
                    <option value="">Select a client</option>
                    {clients
                      .filter(c => c.id !== client.id) 
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} (ID: {c.id})
                        </option>
                      ))}
                  </select>
                  {localError && <ErrorComponent errorMessage={localError} />}
                </label>
              </>
            )}
            <label>
              {inputLabel}:
              <input type="number" value={newValue} onChange={handleChange} min="0" />
            </label>
            <button type="submit">{buttonLabel}</button>
          </form>
          <button onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ClientActionModal;


import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Debt } from "../shared/debt";
import "../css/EditDebtForm.css"; // Make sure you have appropriate CSS for the form

interface Props {
  debt: Debt;
  onSubmit: (updatedDebt: Debt) => void;
  onCancel: () => void;
}

// Helper function to format date to YYYY-MM-DDTHH:mm format in local time
const formatDateTimeLocal = (date: Date) => {
  const offset = date.getTimezoneOffset(); // Timezone offset in minutes
  const localDate = new Date(date.getTime() - offset * 60 * 1000); // Adjust to local time
  return localDate.toISOString().slice(0, 16); // Format to YYYY-MM-DDTHH:mm
};

const EditDebtForm: React.FC<Props> = ({ debt, onSubmit, onCancel }) => {
  // Initialize state with the existing debt values
  const [description, setDescription] = useState(debt.description);
  const [debtAmount, setDebtAmount] = useState(debt.debt.toString());
  const [name, setName] = useState(debt.name || "");
  const [dateTime, setDateTime] = useState(
    formatDateTimeLocal(new Date(debt.date)) // Use helper to get local time
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent traditional form submission

    // Combine the dateTime string into a Date object
    const combinedDateTime = new Date(dateTime);

    // Update the debt object with the new values
    const updatedDebt: Debt = {
      ...debt,
      description,
      debt: parseFloat(debtAmount), // Convert the debt amount to a number
      name: name || "No name available", // Set a default name
      date: combinedDateTime, // Use the combined date and time
    };

    onSubmit(updatedDebt); // Call the onSubmit prop to save the changes
  };

  const modalContent = (
    <div className="modal-overlay">
      <div className="edit-debt-form">
        <h3>Edit Debt</h3>
        <form onSubmit={handleFormSubmit}>
          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Amount Field */}
          <div className="form-group">
            <label htmlFor="debt">Amount:</label>
            <input
              type="number"
              id="debt"
              value={debtAmount}
              onChange={(e) => setDebtAmount(e.target.value)}
              required
            />
          </div>

          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* DateTime Field */}
          <div className="form-group">
            <label htmlFor="dateTime">Date and Time:</label>
            <input
              type="datetime-local"
              id="dateTime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </div>

          <div className="button-container">
            <button type="submit" className="update">
              Update Debt
            </button>
            <button type="button" className="cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Use React Portal to render the modal at the root of the DOM
  return ReactDOM.createPortal(modalContent, document.getElementById("root")!);
};

export default EditDebtForm;

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Expense } from "../shared/expense";
import "../css/EditExpenseForm.css"; // Import the CSS file for styling the form

interface Props {
  expense: Expense;
  onSubmit: (updatedExpense: Expense) => void;
  onCancel: () => void;
}

// Helper function to convert Date object to YYYY-MM-DDTHH:mm format in local time
const formatDateTimeLocal = (date: Date) => {
  const offset = date.getTimezoneOffset(); // Timezone offset in minutes
  const localDate = new Date(date.getTime() - offset * 60 * 1000); // Adjust to local time
  return localDate.toISOString().slice(0, 16); // Format to YYYY-MM-DDTHH:mm
};

const EditExpenseForm: React.FC<Props> = ({ expense, onSubmit, onCancel }) => {
  // Initialize the state with the existing expense values
  const [description, setDescription] = useState(expense.description);
  const [expenseAmount, setExpenseAmount] = useState(
    expense.expense.toString()
  );
  const [location, setLocation] = useState(expense.location || "");
  const [dateTime, setDateTime] = useState(
    formatDateTimeLocal(new Date(expense.date)) // Use helper to get local time
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent traditional form submission

    // Combine the dateTime string into a Date object
    const combinedDateTime = new Date(dateTime);

    // Update the expense object with the new values
    const updatedExpense = {
      ...expense,
      description,
      expense: parseFloat(expenseAmount), // Convert the expense to a number
      location: location || "No location available", // Set a default location
      date: combinedDateTime, // Use the combined date and time
    };

    onSubmit(updatedExpense); // Call the onSubmit prop to save the changes
  };

  const modalContent = (
    <div className="modal-overlay">
      <div className="edit-expense-form">
        <h3>Edit Expense</h3>
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
            <label htmlFor="expense">Amount:</label>
            <input
              type="number"
              id="expense"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              required
            />
          </div>

          {/* Location Field */}
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
              Update Expense
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

export default EditExpenseForm;

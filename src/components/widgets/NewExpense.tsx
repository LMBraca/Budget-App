import React, { useState } from "react";
import { Expense } from "../../shared/expense";
import { insertExpense } from "../../services/expenseService";
import "../../css/NewExpense.css"; // Import custom CSS for this widget

const NewExpense: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [expense, setExpense] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("No user ID found. Please sign in first.");
      setLoading(false);
      return;
    }

    if (!description || !expense || !dateTime) {
      setError("Description, expense, and date are mandatory fields.");
      setLoading(false);
      return;
    }

    const combinedDateTime = new Date(dateTime);
    console.log(combinedDateTime);

    const newExpense = new Expense(); // Create a new Expense instance
    newExpense.description = description;
    newExpense.expense = parseFloat(expense); // Make sure it's a number
    newExpense.location = location || "No location available"; // Provide a default value
    newExpense.date = combinedDateTime; // Use the combined date and time
    newExpense.idUser = parseInt(userId); // Pass the correct user ID

    try {
      await insertExpense(newExpense);

      toggleForm(); // Close form after successful submission
      setDescription("");
      setExpense("");
      setLocation("");
      setDateTime("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("An unexpected error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating widget button */}
      <div className="floating-widget" onClick={toggleForm}>
        <p style={{ color: "white" }}>+ Add Expense</p>
      </div>

      {/* Expense form */}
      {showForm && (
        <div className="overlay">
          <div className="expense-form">
            <form onSubmit={handleFormSubmit}>
              <h3>Add Expense</h3>
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
              <div className="form-group">
                <label htmlFor="expense">Expense:</label>
                <input
                  type="number"
                  id="expense"
                  value={expense}
                  onChange={(e) => setExpense(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
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
              {error && <p className="error">{error}</p>}
              <div className="button-container">
                <button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  className="button cancel"
                  onClick={toggleForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewExpense;

import React, { useState, useEffect } from "react";
import { updateWeeklyIncomeAndPayday } from "../../services/expenseService";
import "../../css/NewExpense.css"; // Import custom CSS for this widget

interface SetWeeklyIncomeProps {
  currentWeeklyIncome: number;
  currentPayday: number;
  setWeeklyIncome: (income: number) => void;
  setPayday: (day: number) => void;
}

const SetWeeklyIncome: React.FC<SetWeeklyIncomeProps> = ({
  currentWeeklyIncome,
  currentPayday,
  setWeeklyIncome,
  setPayday,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [income, setIncome] = useState<string>("");
  const [payday, setPaydayValue] = useState<number | string>(""); // Add state for payday
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize the input fields with current income and payday when the component loads
  useEffect(() => {
    setIncome(currentWeeklyIncome.toString());
    setPaydayValue(currentPayday.toString());
  }, [currentWeeklyIncome, currentPayday]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!income || isNaN(parseFloat(income)) || payday === "") {
      setError("Income and Payday are required fields.");
      setLoading(false);
      return;
    }

    const newIncome = parseFloat(income);
    const newPayday = parseInt(payday as string);

    try {
      await updateWeeklyIncomeAndPayday(newIncome, newPayday); // Call the service to update both income and payday
      setWeeklyIncome(newIncome); // Update income in the parent state
      setPayday(newPayday); // Update payday in the parent state
      toggleForm(); // Close the form
    } catch (error) {
      console.error("Error updating income and payday:", error);
      setError("Failed to update income and payday. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating widget button */}
      <div className="set-weekly-income-widget" onClick={toggleForm}>
        <p style={{ color: "white" }}>+ Set Income & Payday</p>
      </div>

      {/* Form to set weekly income and payday */}
      {showForm && (
        <div className="overlay">
          <div className="expense-form">
            <form onSubmit={handleFormSubmit}>
              <h3>Set Weekly Income & Payday</h3>
              <div className="form-group">
                <label htmlFor="income">Weekly Income:</label>
                <input
                  type="number"
                  id="income"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="payday">Payday:</label>
                <select
                  id="payday"
                  value={payday}
                  onChange={(e) => setPaydayValue(e.target.value)}
                  required
                >
                  <option value="">Select a day</option>
                  <option value="0">Sunday</option>
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                  <option value="6">Saturday</option>
                </select>
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

export default SetWeeklyIncome;

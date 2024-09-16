import React, { useState, useEffect } from "react";
import { updateSettings } from "../../services/expenseService";
import "../../css/Settings.css";
import { useNavigate } from "react-router-dom";
import settingsIcon from "/settings.svg"; // Adjust path as needed

interface SettingsProps {
  currentWeeklyIncome: number;
  currentPayday: number;
  setWeeklyIncome: (income: number) => void;
  setPayday: (day: number) => void;
}

const Settings: React.FC<SettingsProps> = ({
  currentWeeklyIncome,
  currentPayday,
  setWeeklyIncome,
  setPayday,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [income, setIncome] = useState<string>("");
  const [payday, setPaydayValue] = useState<number | string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      await updateSettings(newIncome, newPayday);
      setWeeklyIncome(newIncome);
      setPayday(newPayday);
      toggleForm();
    } catch (error) {
      setError("Failed to update income and payday. Please try again.");
    }

    setLoading(false);
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <>
      <div
        className="set-weekly-income-widget"
        onClick={toggleForm}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            toggleForm();
          }
        }}
      >
        {/* Replace text with SVG icon */}
        <img src={settingsIcon} alt="Settings" className="settings-icon" />
      </div>

      {showForm && (
        <div className="overlay">
          <div className="expense-form">
            {/* Sign-out button with text */}
            <button type="button" className="sign-out" onClick={handleSignOut}>
              Sign Out
            </button>

            {/* Centered title */}
            <br></br>
            <h3 className="settings-title">Settings</h3>
            <br></br>
            <br></br>
            <form onSubmit={handleFormSubmit}>
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

export default Settings;

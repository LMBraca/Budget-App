import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkUsernameUnique, registerUser } from "../services/userService";
import "../css/AuthPage.css"; // Using shared CSS

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [income, setIncome] = useState<string>("");
  const [payday, setPayday] = useState<number | string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Check if income and payday are valid
    if (!income || isNaN(parseFloat(income)) || payday === "") {
      setError("Income and Payday are required fields.");
      setLoading(false);
      return;
    }

    // Check if the username is unique
    const isUnique = await checkUsernameUnique(username);
    if (!isUnique) {
      setError("Username is already taken. Please choose another.");
      setLoading(false);
      return;
    }

    // Generate the current date and time in ISO format
    const registrationDate = new Date().toLocaleDateString();
    // Register the user and send income, payday, and the current date to the backend
    const success = await registerUser(
      username,
      password,
      parseFloat(income),
      parseInt(payday as string),
      registrationDate // Automatically send the current date and time
    );
    if (success) {
      navigate("/signin");
    } else {
      setError(
        "There was an issue registering your account. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
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
            onChange={(e) => setPayday(e.target.value)}
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
        {error && <p>{error}</p>}
        <div className="button-container">
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>

      <div className="button-container">
        <button
          type="button"
          className="button"
          onClick={() => navigate("/signin")}
        >
          Return to Sign In
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;

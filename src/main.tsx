import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import RegisterPage from "./components/RegisterPage";
import App from "./App";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component

const MainApp: React.FC = () => (
  <Router>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<SignInPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private Route for the dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        }
      />
    </Routes>
  </Router>
);

// Find the root element in your HTML
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<MainApp />);
}

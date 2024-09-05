import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const userId = localStorage.getItem("userId");

  // If there's no userId, redirect to the sign-in page
  if (!userId) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>; // Render the child components (like the dashboard)
};

export default PrivateRoute;

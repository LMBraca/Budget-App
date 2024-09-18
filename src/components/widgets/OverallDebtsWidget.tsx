import React, { useState, useEffect } from "react";
import { Debt } from "../../models/debt";
import "../../css/ExpensesWidget.css"; // You can reuse the styling from ExpensesWidget
import { updateDebt } from "../../services/debtService"; // Import your debt service
import EditDebtForm from "../EditDebtForm"; // Import the EditDebtForm

interface Props {
  debts: Debt[];
  onDropdownToggle: (isOpen: boolean) => void;
}

const OverallDebtsWidget: React.FC<Props> = ({ debts, onDropdownToggle }) => {
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [debtsState, setDebts] = useState<Debt[]>(debts);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Update the debts state when the debts prop changes
  useEffect(() => {
    setDebts(debts);
  }, [debts]);

  // Notify parent component when dropdown state changes
  useEffect(() => {
    onDropdownToggle(isDropdownOpen);
  }, [isDropdownOpen, onDropdownToggle]);

  // Sort debts: unpaid debts first (most recent), paid debts at the bottom (most recent)
  const sortedDebts = [...debtsState].sort((a, b) => {
    if (a.paid === b.paid) {
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // Sort by date, most recent first
    }
    return a.paid ? 1 : -1; // Unpaid debts come first
  });

  // Mark a debt as paid
  const markAsPaid = async (debt: Debt) => {
    const updatedDebt = { ...debt, paid: true }; // Set paid to true, since it's a boolean in the database
    await updateDebt(updatedDebt); // Update the debt status in the database
    setDebts((prevDebts) =>
      prevDebts.map((d) => (d.idDebt === debt.idDebt ? updatedDebt : d))
    );
  };

  const handleEditClick = (debt: Debt) => {
    setEditingDebt(debt);
  };

  const handleCancelEdit = () => {
    setEditingDebt(null);
  };

  const handleDebtUpdate = async (updatedDebt: Debt) => {
    await updateDebt(updatedDebt); // Update the debt in the database
    setDebts((prevDebts) =>
      prevDebts.map((d) => (d.idDebt === updatedDebt.idDebt ? updatedDebt : d))
    );
    setEditingDebt(null); // Close the edit form after updating
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="overall-debts-widget">
      <div className="widget-header" onClick={toggleDropdown}>
        <h2 className="dropdown-header">All Debts</h2>
        <hr />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-content">
          {sortedDebts.length > 0 ? (
            sortedDebts.map((debt) => (
              <div
                key={debt.idDebt}
                className={`expense-item ${
                  editingDebt?.idDebt === debt.idDebt ? "editing" : ""
                }`}
              >
                <div className="expense-header">
                  <h3 style={{ color: debt.paid ? "green" : "black" }}>
                    {debt.description}
                  </h3>
                  {!debt.paid && (
                    <button onClick={() => handleEditClick(debt)}>Edit</button>
                  )}
                  {!debt.paid && (
                    <button onClick={() => markAsPaid(debt)}>Paid</button>
                  )}
                </div>

                <div className="row">
                  <h4>Amount:</h4>
                  <p>${debt.debt.toFixed(2)}</p>
                </div>
                <div className="row">
                  <h4>Name:</h4>
                  <p>{debt.name || "No name available"}</p>
                </div>
                <div className="row">
                  <h4>Date:</h4>
                  <p>{new Date(debt.date).toLocaleDateString()}</p>
                </div>
                <hr />
              </div>
            ))
          ) : (
            <p>No debts available.</p>
          )}
        </div>
      )}

      {/* Render the EditDebtForm if editingDebt is not null */}
      {editingDebt && (
        <EditDebtForm
          debt={editingDebt}
          onSubmit={handleDebtUpdate}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default OverallDebtsWidget;

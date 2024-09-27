import React, { useState, useEffect } from "react";
import { Expense } from "../../models/expense";
import "../../css/ExpensesWidget.css";
import { updateExpense } from "../../services/expenseService";
import EditExpenseForm from "../EditExpenseForm";

interface Props {
  expenses: Expense[];
  onDropdownToggle: (isOpen: boolean) => void; // Prop to handle dropdown toggle event
}

const OverallExpensesWidget: React.FC<Props> = ({
  expenses,
  onDropdownToggle,
}) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expensesState, setExpenses] = useState<Expense[]>(expenses); // Track state internally
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state

  // Update the expenses state when the expenses prop changes
  useEffect(() => {
    setExpenses(expenses);
  }, [expenses]); // Trigger when the expenses prop updates

  // Use useEffect to update the parent's state after the render is complete
  useEffect(() => {
    onDropdownToggle(isDropdownOpen);
  }, [isDropdownOpen, onDropdownToggle]);

  const sortedExpenses = [...expensesState].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleUpdateSubmit = async (updatedExpense: Expense) => {
    await updateExpense(updatedExpense); // Update API call
    setEditingExpense(null);

    // Update the state to reflect changes
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleDelete = (deletedExpenseId: number) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== deletedExpenseId));
    setEditingExpense(null);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Update dropdown state
  };

  return (
    <div className="overall-expenses-widget">
      <div className="widget-header" onClick={toggleDropdown}>
        <h2 className="dropdown-header">All Expenses</h2>
        <hr />
      </div>

      {/* Show or hide content based on dropdown state */}
      {isDropdownOpen && (
        <div className="dropdown-content">
          {sortedExpenses.length > 0 ? (
            sortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className={`expense-item ${
                  editingExpense?.id === expense.id ? "editing" : ""
                }`}
              >
                <div className="expense-header">
                  <h3>{expense.description}</h3>
                  <button onClick={() => handleEditClick(expense)}>Edit</button>
                </div>

                <div className="row">
                  <h4>Amount:</h4>
                  <p>${expense.expense}</p>
                </div>
                <div className="row">
                  <h4>Location:</h4>
                  <p>{expense.location || "No location available"}</p>
                </div>
                <div className="row">
                  <h4>Date:</h4>
                  <p>{new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <div className="row">
                  <h4>Time:</h4>
                  <p>{new Date(expense.date).toLocaleTimeString()}</p>
                </div>
                <hr />
              </div>
            ))
          ) : (
            <p>No expenses available.</p>
          )}

          {editingExpense && (
            <EditExpenseForm
              expense={editingExpense}
              onSubmit={handleUpdateSubmit}
              onCancel={handleCancelEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OverallExpensesWidget;

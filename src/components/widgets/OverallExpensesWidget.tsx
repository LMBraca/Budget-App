import React, { useState } from "react";
import { Expense } from "../../shared/expense";
import "../../css/ExpensesWidget.css"; // Keep this CSS import
import { updateExpense } from "../../services/expenseService"; // Import the update function
import EditExpenseForm from "../EditExpenseForm"; // Import the new EditExpenseForm component

interface Props {
  expenses: Expense[];
}

const OverallExpensesWidget: React.FC<Props> = ({ expenses }) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEditClick = (expense: Expense) => {
    console.log("Editing expense:", expense); // Debugging step
    setEditingExpense(expense); // Set the expense to be edited
  };

  const handleUpdateSubmit = async (updatedExpense: Expense) => {
    console.log("Updating expense:", updatedExpense); // Debugging step
    await updateExpense(updatedExpense); // Call the API to update the expense
    setEditingExpense(null); // Reset the editing state after submission
    window.location.reload();
  };

  const handleCancelEdit = () => {
    console.log("Canceling edit"); // Debugging step
    setEditingExpense(null); // Reset the editing state when the user cancels
  };

  return (
    <div className="weekly-expenses-widget">
      <div className="widget-header">
        <h2>All Expenses</h2>
        <hr />
      </div>
      {sortedExpenses.length > 0 ? (
        sortedExpenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            {/* Flex container for title and button */}
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
        />
      )}
    </div>
  );
};

export default OverallExpensesWidget;

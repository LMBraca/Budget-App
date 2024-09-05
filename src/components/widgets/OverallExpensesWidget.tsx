import React from "react";
import { Expense } from "../../shared/expense";
import "../../css/ExpensesWidget.css"; // Import the same CSS file

interface Props {
  expenses: Expense[];
}

const OverallExpensesWidget: React.FC<Props> = ({ expenses }) => {
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="weekly-expenses-widget">
      {" "}
      {/* Use the same class as WeeklyExpensesWidget */}
      <div className="widget-header">
        <h2>All Expenses</h2>
        <hr />
      </div>
      {sortedExpenses.length > 0 ? (
        sortedExpenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            {" "}
            {/* Use the same class as WeeklyExpensesWidget */}
            <h3>{expense.description}</h3>
            <div className="row">
              <h4>Amount:</h4>
              <p>${expense.expense}</p>
            </div>
            <div className="row">
              <h4>Location:</h4>
              <p>
                {expense.location ? expense.location : "No location available"}
              </p>
            </div>
            <div className="row">
              <h4>Date:</h4>
              <p>
                {expense.date
                  ? new Date(expense.date).toLocaleDateString()
                  : "No date available"}
              </p>
            </div>
            <div className="row">
              <h4>Time:</h4>
              <p>
                {expense.date
                  ? new Date(expense.date).toLocaleTimeString()
                  : "No time available"}
              </p>
            </div>
            <hr />
          </div>
        ))
      ) : (
        <p>No expenses available.</p>
      )}
    </div>
  );
};

export default OverallExpensesWidget;

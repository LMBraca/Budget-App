import React, { useState } from "react";
import { Expense } from "../../shared/expense";
import "../../css/ExpensesWidget.css"; // Import the CSS file
import "../../css/ColorGrading.css"; // Import the CSS file
import arrowSvg from "/arrow.svg"; // Adjust path as needed

interface Props {
  expenses: Expense[];
  weeklyIncome: number; // Use dynamic weekly income
  payday: number; // Payday (0 = Sunday, 1 = Monday, etc.)
}

const WeeklyExpensesWidget: React.FC<Props> = ({
  expenses,
  weeklyIncome,
  payday,
}) => {
  const [weekOffset, setWeekOffset] = useState(0);

  // Function to calculate the start of the week based on the payday
  const getStartOfWeekBasedOnPayday = (offset: number) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const distanceToPayday = (dayOfWeek + 7 - payday) % 7; // Calculate the distance to the payday
    const paydayDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - distanceToPayday + offset * 7
    );
    return paydayDate;
  };

  // Get the start and end of the week based on payday and week offset
  const startOfWeek = getStartOfWeekBasedOnPayday(weekOffset);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week is 6 days after the payday
  endOfWeek.setHours(23, 59, 59, 999); // Set to the end of the day

  // Filter the expenses based on the dynamic start and end of the week
  const weeklyExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first

  const weeklyTotal = weeklyExpenses.reduce(
    (total, expense) => total + expense.expense,
    0
  );
  const grossWeeklyIncome = weeklyIncome - weeklyTotal;

  // Class for the weekly total (for color grading based on total)
  const getTotalClass = (total: number) => {
    if (total <= 1250) {
      return `weekly-total total-${Math.round((total / 1250) * 10)}`;
    }
    return "weekly-total total-10"; // max red for anything above 1250
  };

  const handlePreviousWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  return (
    <div className="weekly-expenses-widget">
      <div className="widget-header">
        <h2>Weekly Expenses</h2>
        <br />
        <div className="week-navigation">
          <button
            className="nav-arrow"
            onClick={(e) => {
              e.stopPropagation();
              handlePreviousWeek();
            }}
          >
            <img src={arrowSvg} alt="Previous Week" className="arrow-left" />
          </button>
          <span className="week-range">
            {startOfWeek.toLocaleDateString()} -{" "}
            {endOfWeek.toLocaleDateString()}
          </span>
          <button
            className="nav-arrow"
            onClick={(e) => {
              e.stopPropagation();
              handleNextWeek();
            }}
          >
            <img src={arrowSvg} alt="Next Week" className="arrow-right" />
          </button>
        </div>
        <hr />
        <div className="row">
          <h4>Weekly Total:</h4>
          <div className={getTotalClass(weeklyTotal)}>
            <h4>${weeklyTotal.toFixed(2)}</h4>
          </div>
        </div>
        <div className="row">
          <h4>Gross Weekly Income:</h4>
          <div className="gross-weekly-income">
            <h4>${grossWeeklyIncome.toFixed(2)}</h4>
          </div>
        </div>
        <hr />
      </div>

      {weeklyExpenses.length > 0 ? (
        <>
          {weeklyExpenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <h3>{expense.description}</h3>
              <div className="row">
                <h4>Amount:</h4>
                <p>${expense.expense}</p>
              </div>
              <div className="row">
                <h4>Location:</h4>
                <p>
                  {expense.location
                    ? expense.location
                    : "No location available"}
                </p>
              </div>
              <div className="row">
                <h4>Date:</h4>
                <p>{new Date(expense.date).toLocaleDateString()}</p>
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
          ))}
        </>
      ) : (
        <p>No expenses for this week.</p>
      )}
    </div>
  );
};

export default WeeklyExpensesWidget;

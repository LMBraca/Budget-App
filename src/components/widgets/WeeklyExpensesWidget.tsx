import React, { useState } from "react";
import { Expense } from "../../shared/expense";
import "../../css/ExpensesWidget.css"; // Import the CSS file
import "../../css/ColorGrading.css"; // Import the CSS file
import arrowSvg from "../../../public/arrow.svg"; // Adjust path as needed

interface Props {
  expenses: Expense[];
}

const WeeklyExpensesWidget: React.FC<Props> = ({ expenses }) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const getThursdayOfLastWeek = (offset: number) => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // Sunday is 0, Saturday is 6
    const distanceToThursday = (dayOfWeek + 3) % 7; // 0 if Thursday, positive otherwise
    const thursday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - distanceToThursday + offset * 7
    );
    return thursday;
  };

  const startOfWeek = getThursdayOfLastWeek(weekOffset);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999); // Set to the end of the day (23:59:59.999)

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

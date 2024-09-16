import React, { useState } from "react";
import { Expense } from "../../shared/expense";
import "../../css/ExpensesWidget.css"; // Import the CSS file
import "../../css/ColorGrading.css"; // Import the shared CSS file
import arrowSvg from "/arrow.svg"; // Adjust path as needed

interface Props {
  expenses: Expense[];
  weeklyIncome: number; // Use dynamic weekly income
  payday: number; // Payday (0 = Sunday, 1 = Monday, etc.)
  onDropdownToggle: (isOpen: boolean) => void; // Prop to handle dropdown toggle
}

const WeeklyExpensesWidget: React.FC<Props> = ({
  expenses,
  weeklyIncome,
  payday,
  onDropdownToggle,
}) => {
  const [weekOffset, setWeekOffset] = useState(0); // For week-based navigation
  const [monthOffset, setMonthOffset] = useState(0); // For month-based navigation
  const [isDropdownOpen, setIsDropdownOpen] = useState(true); // State to handle dropdown visibility
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly"); // State to toggle between weekly and monthly view

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

  // Function to calculate the start and end of the month
  const getStartOfMonth = (offset: number) => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + offset, 1);
  };

  const getEndOfMonth = (offset: number) => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1 + offset, 0); // Last day of the current month with offset
  };

  // Get the start and end of the week/month based on the current view (weekly or monthly)
  const startOfPeriod =
    viewMode === "weekly"
      ? getStartOfWeekBasedOnPayday(weekOffset)
      : getStartOfMonth(monthOffset);
  const endOfPeriod = new Date(startOfPeriod);

  if (viewMode === "weekly") {
    endOfPeriod.setDate(startOfPeriod.getDate() + 6); // End of the week is 6 days after the payday
    endOfPeriod.setHours(23, 59, 59, 999); // Set to the end of the day
  } else {
    const endOfMonth = getEndOfMonth(monthOffset);
    endOfPeriod.setDate(endOfMonth.getDate()); // End of the month
  }

  // Filter the expenses based on the dynamic start and end of the week/month
  const periodExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfPeriod && expenseDate <= endOfPeriod;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first

  const periodTotal = periodExpenses.reduce(
    (total, expense) => total + expense.expense,
    0
  );
  const netIncome = weeklyIncome - periodTotal;

  // Class for the total (for color grading based on total)
  const getTotalClass = (total: number) => {
    if (total <= 1250) {
      return `total-class total-${Math.round((total / 1250) * 10)}`;
    }
    return "total-class total-10"; // max red for anything above 1250
  };

  const handlePreviousPeriod = () => {
    if (viewMode === "weekly") {
      setWeekOffset(weekOffset - 1);
    } else {
      setMonthOffset(monthOffset - 1);
    }
  };

  const handleNextPeriod = () => {
    if (viewMode === "weekly") {
      setWeekOffset(weekOffset + 1);
    } else {
      setMonthOffset(monthOffset + 1);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => {
      onDropdownToggle(!prev); // Notify parent of the dropdown toggle state
      return !prev;
    });
  };

  // Toggle between weekly and monthly view without affecting the dropdown
  const toggleViewMode = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the dropdown toggle from being triggered
    setViewMode(viewMode === "weekly" ? "monthly" : "weekly");
    setWeekOffset(0); // Reset week offset when switching modes
    setMonthOffset(0); // Reset month offset when switching modes
  };

  return (
    <div className="weekly-expenses-widget">
      <div className="widget-header dropdown-header" onClick={toggleDropdown}>
        <h2>
          {viewMode === "weekly" ? "Weekly Expenses" : "Monthly Expenses"}
        </h2>
        <hr />

        <div className="view-toggle">
          <button onClick={toggleViewMode}>
            Switch to {viewMode === "weekly" ? "Monthly" : "Weekly"} View
          </button>
        </div>

        <div className="week-navigation">
          <button
            className="nav-arrow"
            onClick={(e) => {
              e.stopPropagation();
              handlePreviousPeriod();
            }}
          >
            <img src={arrowSvg} alt="Previous Period" className="arrow-left" />
          </button>
          <span className="period-range">
            {startOfPeriod.toLocaleDateString()} -{" "}
            {endOfPeriod.toLocaleDateString()}
          </span>
          <button
            className="nav-arrow"
            onClick={(e) => {
              e.stopPropagation();
              handleNextPeriod();
            }}
          >
            <img src={arrowSvg} alt="Next Period" className="arrow-right" />
          </button>
        </div>
        <hr />
      </div>

      <div className="row">
        <h4>Total Spent:</h4>
        <div className={getTotalClass(periodTotal)}>
          <h4>${periodTotal.toFixed(2)}</h4>
        </div>
      </div>
      <div className="row">
        <h4>Net {viewMode === "weekly" ? "Weekly" : "Monthly"} Income:</h4>
        <div className="net-income">
          <h4>${netIncome.toFixed(2)}</h4>
        </div>
      </div>
      <hr />
      {isDropdownOpen && (
        <>
          {periodExpenses.length > 0 ? (
            <>
              {periodExpenses.map((expense) => (
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
            <p>
              No expenses for this {viewMode === "weekly" ? "week" : "month"}.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default WeeklyExpensesWidget;

import React, { useState, useEffect } from "react";
import { Expense } from "../../shared/expense";
import "../../css/ExpensesWidget.css";

interface Props {
  expenses: Expense[];
  payday: number; // Weekday as a number (0 = Sunday, 1 = Monday, etc.)
  income: number; // Weekly income
  startDate: Date | null;
  onDropdownToggle: (isOpen: boolean) => void; // Prop to handle dropdown toggle event
}

const StatsWidget: React.FC<Props> = ({
  expenses,
  payday,
  income,
  startDate,
  onDropdownToggle,
}) => {
  const [expensesState, setExpenses] = useState<Expense[]>(expenses);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state

  // Total spent
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.expense,
    0
  );

  // Function to calculate total income based on payday, income, and start date
  const calculateTotalIncome = () => {
    if (!startDate) {
      return 0;
    }

    const now = new Date();
    const start = new Date(startDate);

    // Adjust the startDate to align with the payday
    const daysToPayday = (payday - start.getDay() + 7) % 7;

    const paydayStart = new Date(start);
    paydayStart.setDate(start.getDate() + daysToPayday);

    const daysDifference = Math.floor(
      (now.getTime() - paydayStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    const fullWeeks = Math.floor(daysDifference / 7);
    const partialWeek = daysDifference % 7 >= 0 ? 1 : 0; // Account for current partial week
    const totalWeeks = fullWeeks + partialWeek;

    return totalWeeks * income;
  };

  const totalIncome = calculateTotalIncome();

  // Net income
  const netIncome = totalIncome - totalExpenses;

  // Average weekly spent
  const calculateAverageWeeklySpent = () => {
    const totalWeeks = calculateTotalIncome() / income;
    return totalWeeks > 0 ? totalExpenses / totalWeeks : totalExpenses;
  };

  const averageWeeklySpent = calculateAverageWeeklySpent();

  // Average monthly spent
  const calculateAverageMonthlySpent = () => {
    if (!startDate) {
      return 0;
    }

    const now = new Date();
    const monthsDifference =
      (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth() - startDate.getMonth()) +
      1; // Add 1 for partial current month

    return monthsDifference > 0
      ? totalExpenses / monthsDifference
      : totalExpenses;
  };

  const averageMonthlySpent = calculateAverageMonthlySpent();

  // Update the expenses state when the expenses prop changes
  useEffect(() => {
    setExpenses(expenses);
  }, [expenses]);

  // Notify parent when dropdown state changes
  useEffect(() => {
    onDropdownToggle(isDropdownOpen);
  }, [isDropdownOpen, onDropdownToggle]);

  // Toggle the dropdown state
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="overall-expenses-widget">
      <div className="widget-header" onClick={toggleDropdown}>
        <h2 className="dropdown-header">Stats</h2>
        <hr />
      </div>

      {/* Show or hide content based on dropdown state */}
      {isDropdownOpen && (
        <div className="dropdown-content">
          <div className="row">
            <h4>Total spent:</h4>
            <p>${totalExpenses.toFixed(2)}</p>
          </div>
          <hr />
          <div className="row">
            <h4>Total income:</h4>
            <p>${totalIncome.toFixed(2)}</p>
          </div>
          <hr />
          <div className="row">
            <h4>Net income:</h4>
            <p>${netIncome.toFixed(2)}</p>
          </div>
          <hr />
          <div className="row">
            <h4>Average weekly spent:</h4>
            <p>${averageWeeklySpent.toFixed(2)}</p>
          </div>
          <hr />
          <div className="row">
            <h4>Average monthly spent:</h4>
            <p>${averageMonthlySpent.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsWidget;

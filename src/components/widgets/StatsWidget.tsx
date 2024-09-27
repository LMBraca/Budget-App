import React, { useState, useEffect } from "react";
import { Expense } from "../../models/expense";
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
    if (!startDate || payday === undefined) {
      return 0;
    }

    const now = new Date();
    const start = new Date(startDate);

    // Log the current date and start date for reference
    console.log("Current Date:", now);
    console.log("Start Date:", start);

    // Adjust the startDate to align with the first payday
    const daysToPayday = (payday - start.getDay() + 7) % 7;
    const firstPayday = new Date(start);
    firstPayday.setDate(start.getDate() + daysToPayday);

    console.log("Days to next payday from start date:", daysToPayday);
    console.log("First Payday Date:", firstPayday);

    // Calculate total days from the start date to the current date
    const totalDaysDifference = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    console.log("Total Days Difference:", totalDaysDifference);

    // Calculate full weeks from the start date
    const fullWeeksFromStart = Math.floor(totalDaysDifference / 7);

    // Check if today is payday (today's day of the week equals payday)
    const isTodayPayday = now.getDay() === payday;
    console.log("Is today payday?:", isTodayPayday);

    // Include today as a full week if it's payday
    const totalWeeks = fullWeeksFromStart + (isTodayPayday ? 1 : 0);
    console.log("Total Weeks Passed (including today if payday):", totalWeeks);

    const totalIncome = totalWeeks * income;
    console.log("Total Income:", totalIncome);

    return totalIncome;
  };

  const totalIncome = calculateTotalIncome();
  console.log(totalIncome);
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

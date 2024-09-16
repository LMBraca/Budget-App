import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns"; // Import adapter for date-fns
import { format, eachDayOfInterval, startOfWeek, startOfMonth } from "date-fns";
import { Expense } from "../../shared/expense";
import "../../css/ExpensesWidget.css"; // Import the same CSS file

// Register the required components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface Props {
  expenses: Expense[];
  onDropdownToggle: (isOpen: boolean) => void; // Add prop to handle dropdown state change
}

const LineChartExpensesWidget: React.FC<Props> = ({
  expenses,
  onDropdownToggle,
}) => {
  const [xAxisType, setXAxisType] = useState<"day" | "week" | "month">("day");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to handle dropdown visibility

  useEffect(() => {
    onDropdownToggle(isDropdownOpen); // Notify parent when the dropdown state changes
  }, [isDropdownOpen, onDropdownToggle]); // Only trigger when isDropdownOpen changes

  // Sort expenses by date before processing
  const sortedExpenses = [...expenses].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Determine the date range for the chart
  const startDate = new Date(sortedExpenses[0]?.date);
  const endDate = new Date(sortedExpenses[sortedExpenses.length - 1]?.date);

  // Generate all dates in the range for "day" view
  const allDates =
    xAxisType === "day"
      ? eachDayOfInterval({ start: startDate, end: endDate }).map((date) =>
          format(date, "yyyy-MM-dd")
        )
      : [];

  // Group expenses by the selected x-axis type
  const groupedExpenses = sortedExpenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    let key = "";

    if (xAxisType === "day") {
      key = format(date, "yyyy-MM-dd");
    } else if (xAxisType === "week") {
      // Week starts on Thursday (Thursday = 4)
      const weekStart = startOfWeek(date, { weekStartsOn: 4 });
      key = format(weekStart, "M/d/yyyy"); // Only show the start date
    } else if (xAxisType === "month") {
      key = format(startOfMonth(date), "yyyy-MM");
    }

    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += expense.expense;
    return acc;
  }, {} as Record<string, number>);

  // Ensure all dates are included in the dataset for the "day" view
  if (xAxisType === "day") {
    allDates.forEach((date) => {
      if (!groupedExpenses[date]) {
        groupedExpenses[date] = 0;
      }
    });
  }

  // For "week" and "month" views, use the groupedExpenses keys as labels
  const labels = xAxisType === "day" ? allDates : Object.keys(groupedExpenses);

  // Map the expenses for the chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Expenses Over Time",
        data: labels.map((label) => groupedExpenses[label] || 0),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "category" as const, // Use category scale to show the start date as a label
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount ($)",
        },
        beginAtZero: true,
      },
    },
  };

  const handleXAxisTypeChange = (type: "day" | "week" | "month") => {
    setXAxisType(type);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Update local state only
  };

  return (
    <div className="weekly-expenses-widget">
      <div className="widget-header" onClick={toggleDropdown}>
        <h2>Expenses Line Chart</h2>
      </div>
      <div className="xaxis-buttons row">
        <button
          className="nav-button no-drag"
          onClick={() => handleXAxisTypeChange("day")}
        >
          Days
        </button>
        <button
          className="nav-button no-drag"
          onClick={() => handleXAxisTypeChange("week")}
        >
          Weeks
        </button>
        <button
          className="nav-button no-drag"
          onClick={() => handleXAxisTypeChange("month")}
        >
          Months
        </button>
      </div>

      {/* Apply 'closed' class if dropdown is not open */}

      {isDropdownOpen && (
        <div className="dropdown-content">
          {/* Content like the buttons and chart go here */}
          <hr />
          {sortedExpenses.length > 0 ? (
            <Line data={data} options={options} />
          ) : (
            <p>No expenses available to display.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LineChartExpensesWidget;

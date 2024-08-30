import React, { useState } from "react";
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
}

const LineChartExpensesWidget: React.FC<Props> = ({ expenses }) => {
  const [xAxisType, setXAxisType] = useState<"day" | "week" | "month">("day");

  // Sort expenses by date before processing
  const sortedExpenses = [...expenses].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Determine the date range for the chart
  const startDate = new Date(sortedExpenses[0]?.date);
  const endDate = new Date(sortedExpenses[sortedExpenses.length - 1]?.date);

  // Generate all dates in the range
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

  const data = {
    labels: Object.keys(groupedExpenses), // Include all dates
    datasets: [
      {
        label: "Expenses Over Time",
        data: Object.values(groupedExpenses),
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

  return (
    <div className="weekly-expenses-widget">
      <div className="widget-header">
        <h2>Expenses Line Chart</h2>
        <br />
        <div className="xaxis-buttons">
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
        <br />
        <hr />
      </div>
      {sortedExpenses.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p>No expenses available to display.</p>
      )}
    </div>
  );
};

export default LineChartExpensesWidget;

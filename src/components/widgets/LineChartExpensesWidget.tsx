import React, { useState, useEffect, useMemo } from "react";
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
  ChartDataset,
  ChartData,
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns"; // Import adapter for date-fns
import { format, eachDayOfInterval, startOfWeek, startOfMonth } from "date-fns";
import { Expense } from "../../models/expense";
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
  onDropdownToggle: (isOpen: boolean) => void; // Handle dropdown state change
  income: number; // Income prop
}

const LineChartExpensesWidget: React.FC<Props> = ({
  expenses,
  onDropdownToggle,
  income,
}) => {
  const [xAxisType, setXAxisType] = useState<"day" | "week" | "month">("week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  useEffect(() => {
    onDropdownToggle(isDropdownOpen); // Notify parent when dropdown state changes
  }, [isDropdownOpen, onDropdownToggle]); // Trigger only when isDropdownOpen changes

  // Sort expenses by date before processing
  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [expenses]);

  // Determine the date range for the chart
  const { startDate, endDate } = useMemo(() => {
    if (sortedExpenses.length === 0) {
      const today = new Date();
      return { startDate: today, endDate: today };
    }
    return {
      startDate: new Date(sortedExpenses[0].date),
      endDate: new Date(sortedExpenses[sortedExpenses.length - 1].date),
    };
  }, [sortedExpenses]);

  // Generate all dates in the range for "day" view
  const allDates = useMemo(() => {
    return xAxisType === "day"
      ? eachDayOfInterval({ start: startDate, end: endDate }).map((date) =>
          format(date, "yyyy-MM-dd")
        )
      : [];
  }, [xAxisType, startDate, endDate]);

  // Group expenses by the selected x-axis type and ensure all dates are included
  const groupedExpenses = useMemo(() => {
    const grouping: Record<string, number> = {};

    sortedExpenses.forEach((expense) => {
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

      if (!grouping[key]) {
        grouping[key] = 0;
      }
      grouping[key] += expense.expense;
    });

    // For "day" view, ensure all dates are present
    if (xAxisType === "day") {
      allDates.forEach((date) => {
        if (!grouping[date]) {
          grouping[date] = 0;
        }
      });
    }

    return grouping;
  }, [sortedExpenses, xAxisType, allDates]);

  // For "week" and "month" views, sort the labels chronologically
  const labels = useMemo(() => {
    const labelKeys =
      xAxisType === "day" ? allDates : Object.keys(groupedExpenses);

    // Sort labels by date
    return labelKeys.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  }, [xAxisType, allDates, groupedExpenses]);

  // Determine the income line value based on xAxisType
  const incomeLineValue = useMemo(() => {
    if (xAxisType === "week") return income;
    if (xAxisType === "month") return income * 4;
    return null;
  }, [xAxisType, income]);

  // Define the datasets with proper typing
  const datasets: ChartDataset<"line", number[]>[] = [
    {
      label: "Expenses Over Time",
      data: labels.map((label) => groupedExpenses[label] || 0),
      fill: "end", // Fill to the top of the chart
      backgroundColor: "rgba(255, 0, 0, 0.2)", // Semi-transparent red
      borderColor: "rgba(75,192,192,1)",
      tension: 0.1,
    },
  ];

  // Add the income line dataset conditionally
  if (incomeLineValue !== null) {
    datasets.push({
      label: "Income Threshold",
      data: labels.map(() => incomeLineValue!),
      fill: false,
      borderColor: "red",
      borderWidth: 2,
      borderDash: [5, 5], // Dashed line
      pointRadius: 0, // No points
    } as ChartDataset<"line", number[]>);
  }

  // Define the chart data
  const data: ChartData<"line", number[]> = {
    labels: labels,
    datasets: datasets,
  };

  // Define the chart options
  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        type: "category", // Use category scale to show the start date as a label
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
        // Adjust the max value to accommodate the income line
        suggestedMax: incomeLineValue
          ? Math.max(...Object.values(groupedExpenses), incomeLineValue) * 1.1
          : undefined,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    maintainAspectRatio: false, // Allows the chart to be responsive
  };

  // Handle x-axis type change
  const handleXAxisTypeChange = (type: "day" | "week" | "month") => {
    setXAxisType(type);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="weekly-expenses-widget">
      <div className="widget-header" onClick={toggleDropdown}>
        <h2>Expenses Line Chart</h2>
      </div>
      <div className="xaxis-buttons row">
        <button
          className={`nav-button no-drag ${
            xAxisType === "day" ? "active" : ""
          }`}
          onClick={() => handleXAxisTypeChange("day")}
        >
          Days
        </button>
        <button
          className={`nav-button no-drag ${
            xAxisType === "week" ? "active" : ""
          }`}
          onClick={() => handleXAxisTypeChange("week")}
        >
          Weeks
        </button>
        <button
          className={`nav-button no-drag ${
            xAxisType === "month" ? "active" : ""
          }`}
          onClick={() => handleXAxisTypeChange("month")}
        >
          Months
        </button>
      </div>

      {/* Dropdown content */}
      {isDropdownOpen && (
        <div className="dropdown-content">
          <hr />
          {sortedExpenses.length > 0 ? (
            <div
              style={{ position: "relative", height: "400px", width: "100%" }}
            >
              <Line data={data} options={options} />
            </div>
          ) : (
            <p>No expenses available to display.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LineChartExpensesWidget;

import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./css/App.css";
import { Expense } from "./shared/expense";
import OverallExpensesWidget from "./components/widgets/OverallExpensesWidget";
import WeeklyExpensesWidget from "./components/widgets/WeeklyExpensesWidget";
import {
  fetchExpenses,
  fetchWeeklyIncome,
  fetchPayday,
} from "./services/expenseService"; // Import fetchPayday
import "react-grid-layout/css/styles.css";
import LineChartExpensesWidget from "./components/widgets/LineChartExpensesWidget";
import NewExpense from "./components/widgets/NewExpense";
import SetWeeklyIncome from "./components/widgets/SetWeeklyIncome"; // Import SetWeeklyIncome

// Wrap Responsive with WidthProvider
const ResponsiveGridLayout = WidthProvider(Responsive);

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [weeklyIncome, setWeeklyIncome] = useState<number>(0);
  const [payday, setPayday] = useState<number>(4);
  const [isOverallDropdownOpen, setIsOverallDropdownOpen] = useState(false); // Track dropdown state for OverallExpensesWidget
  const [isWeeklyDropdownOpen, setIsWeeklyDropdownOpen] = useState(true); // Track dropdown state for WeeklyExpensesWidget
  const [isLineChartDropdownOpen, setIsLineChartDropdownOpen] = useState(false); // Track dropdown state for WeeklyExpensesWidget

  useEffect(() => {
    fetchExpenses().then(setExpenses);
    fetchWeeklyIncome().then((income) => {
      if (income !== null) {
        setWeeklyIncome(income);
      }
    });
    fetchPayday().then((day) => {
      if (day !== null) {
        setPayday(day);
      }
    });
  }, []);

  // Adjust the layout dynamically based on dropdown state
  const layouts = {
    lg: [
      { i: "widget1", x: 3, y: 0, w: 3, h: isOverallDropdownOpen ? 8 : 1 }, // Adjust height based on dropdown for OverallExpensesWidget
      { i: "widget2", x: 0, y: 0, w: 3, h: isWeeklyDropdownOpen ? 10 : 3 }, // Adjust height based on dropdown for WeeklyExpensesWidget
      { i: "widget3", x: 0, y: 10, w: 10, h: isLineChartDropdownOpen ? 10 : 1 },
    ],
    md: [
      { i: "widget1", x: 3, y: 0, w: 3, h: isOverallDropdownOpen ? 8 : 1 },
      { i: "widget2", x: 0, y: 0, w: 3, h: isWeeklyDropdownOpen ? 10 : 3 },
      { i: "widget3", x: 0, y: 10, w: 8, h: isLineChartDropdownOpen ? 10 : 1 },
    ],
    sm: [
      { i: "widget1", x: 0, y: 6, w: 6, h: isOverallDropdownOpen ? 6 : 1 },
      { i: "widget2", x: 0, y: 0, w: 6, h: isWeeklyDropdownOpen ? 10 : 3 },
      { i: "widget3", x: 0, y: 10, w: 6, h: isLineChartDropdownOpen ? 5 : 2 },
    ],
    xs: [
      { i: "widget1", x: 0, y: 6, w: 6, h: isOverallDropdownOpen ? 6 : 1 },
      { i: "widget2", x: 0, y: 0, w: 6, h: isWeeklyDropdownOpen ? 10 : 3 },
      { i: "widget3", x: 0, y: 10, w: 6, h: isLineChartDropdownOpen ? 5 : 2 },
    ],
  };

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480 };
  const cols = { lg: 10, md: 8, sm: 6, xs: 6 };

  return (
    <div>
      <h1>Protopene</h1>
      <main>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={breakpoints}
          cols={cols}
          preventCollision={true}
          isDraggable={false}
          isResizable={false}
          rowHeight={60}
        >
          <div key="widget2" className="widget">
            <WeeklyExpensesWidget
              expenses={expenses}
              weeklyIncome={weeklyIncome}
              payday={payday}
              onDropdownToggle={setIsWeeklyDropdownOpen} // Pass the dropdown toggle handler for WeeklyExpensesWidget
            />
          </div>
          <div key="widget1" className="widget">
            <OverallExpensesWidget
              expenses={expenses}
              onDropdownToggle={setIsOverallDropdownOpen} // Pass the dropdown toggle handler for OverallExpensesWidget
            />
          </div>
          <div key="widget3" className="widget">
            <LineChartExpensesWidget
              expenses={expenses}
              onDropdownToggle={setIsLineChartDropdownOpen}
            />
          </div>
        </ResponsiveGridLayout>

        {/* Floating buttons */}
        <NewExpense />
        <SetWeeklyIncome
          currentWeeklyIncome={weeklyIncome}
          currentPayday={payday}
          setWeeklyIncome={setWeeklyIncome}
          setPayday={setPayday}
        />
      </main>
    </div>
  );
}

export default App;

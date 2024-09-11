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
  const [weeklyIncome, setWeeklyIncome] = useState<number>(0); // State for weekly income
  const [payday, setPayday] = useState<number>(4); // State for payday (default to Thursday, 4)

  useEffect(() => {
    // Fetch expenses and weekly income + payday
    fetchExpenses().then(setExpenses);
    fetchWeeklyIncome().then((income) => {
      if (income !== null) {
        setWeeklyIncome(income); // Set weekly income state
      }
    });
    fetchPayday().then((day) => {
      if (day !== null) {
        setPayday(day); // Set payday state
      }
    });
  }, []);

  const layouts = {
    lg: [
      { i: "widget1", x: 0, y: 0, w: 3, h: 8 },
      { i: "widget2", x: 3, y: 0, w: 3, h: 10 },
      { i: "widget3", x: 0, y: 10, w: 6, h: 11 },
    ],
    md: [
      { i: "widget1", x: 0, y: 0, w: 3, h: 8 },
      { i: "widget2", x: 3, y: 0, w: 3, h: 10 },
      { i: "widget3", x: 0, y: 10, w: 10, h: 11 },
    ],
    sm: [
      { i: "widget1", x: 0, y: 0, w: 6, h: 6 },
      { i: "widget2", x: 0, y: 6, w: 6, h: 10 },
      { i: "widget3", x: 0, y: 16, w: 6, h: 5 },
    ],
    xs: [
      { i: "widget1", x: 0, y: 0, w: 6, h: 6 },
      { i: "widget2", x: 0, y: 6, w: 6, h: 10 },
      { i: "widget3", x: 0, y: 16, w: 6, h: 5 },
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
          rowHeight={60} // Adjust row height as needed
        >
          <div key="widget1" className="widget">
            <OverallExpensesWidget expenses={expenses} />
          </div>
          <div key="widget2" className="widget">
            <WeeklyExpensesWidget
              expenses={expenses}
              weeklyIncome={weeklyIncome}
              payday={payday} // Pass the payday to WeeklyExpensesWidget
            />
          </div>
          <div key="widget3" className="widget">
            <LineChartExpensesWidget expenses={expenses} />
          </div>
        </ResponsiveGridLayout>

        {/* Floating buttons */}
        <NewExpense />
        <SetWeeklyIncome
          currentWeeklyIncome={weeklyIncome} // Pass the current weekly income
          currentPayday={payday} // Pass the current payday
          setWeeklyIncome={setWeeklyIncome} // Function to update weekly income
          setPayday={setPayday} // Function to update payday
        />
      </main>
    </div>
  );
}

export default App;

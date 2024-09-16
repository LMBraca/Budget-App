import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./css/App.css";
import { Expense } from "./shared/expense";
import OverallExpensesWidget from "./components/widgets/OverallExpensesWidget";
import StatsWidget from "./components/widgets/StatsWidget";
import WeeklyExpensesWidget from "./components/widgets/WeeklyExpensesWidget";
import {
  fetchExpenses,
  fetchWeeklyIncome,
  fetchPayday,
  fetchStartDate,
} from "./services/expenseService";
import "react-grid-layout/css/styles.css";
import LineChartExpensesWidget from "./components/widgets/LineChartExpensesWidget";
import NewExpense from "./components/widgets/NewExpense";
import Settings from "./components/widgets/Settings";

// Wrap Responsive with WidthProvider
const ResponsiveGridLayout = WidthProvider(Responsive);

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [weeklyIncome, setWeeklyIncome] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [payday, setPayday] = useState<number>(4);
  const [isOverallDropdownOpen, setIsOverallDropdownOpen] = useState(false);
  const [isWeeklyDropdownOpen, setIsWeeklyDropdownOpen] = useState(true);
  const [isLineChartDropdownOpen, setIsLineChartDropdownOpen] = useState(false);

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
    fetchStartDate().then((startDay) => {
      if (startDay) {
        setStartDate(startDay);
      }
    });
  }, []);

  const layouts = {
    lg: [
      { i: "widget2", x: 0, y: 0, w: 3, h: isWeeklyDropdownOpen ? 10 : 3 },
      { i: "widget1", x: 3, y: 0, w: 3, h: isOverallDropdownOpen ? 8 : 2 },
      { i: "widget4", x: 6, y: 0, w: 4, h: 5 },
      { i: "widget3", x: 0, y: 10, w: 10, h: isLineChartDropdownOpen ? 10 : 2 },
    ],
    md: [
      { i: "widget2", x: 0, y: 0, w: 3, h: isWeeklyDropdownOpen ? 10 : 3 },
      { i: "widget1", x: 3, y: 0, w: 3, h: isOverallDropdownOpen ? 8 : 1 },
      { i: "widget4", x: 6, y: 0, w: 2, h: 5 },
      { i: "widget3", x: 0, y: 10, w: 8, h: isLineChartDropdownOpen ? 10 : 1 },
    ],
    sm: [
      { i: "widget2", x: 0, y: 0, w: 6, h: isWeeklyDropdownOpen ? 10 : 2 },
      { i: "widget1", x: 0, y: 6, w: 6, h: isOverallDropdownOpen ? 6 : 1 },
      { i: "widget4", x: 0, y: 12, w: 6, h: 5 },
      { i: "widget3", x: 0, y: 14, w: 6, h: isLineChartDropdownOpen ? 5 : 2 },
    ],
    xs: [
      { i: "widget2", x: 0, y: 0, w: 6, h: isWeeklyDropdownOpen ? 10 : 3 },
      { i: "widget1", x: 0, y: 6, w: 6, h: isOverallDropdownOpen ? 6 : 1 },
      { i: "widget4", x: 0, y: 12, w: 6, h: 5 },
      { i: "widget3", x: 0, y: 14, w: 6, h: isLineChartDropdownOpen ? 5 : 2 },
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
              onDropdownToggle={setIsWeeklyDropdownOpen}
            />
          </div>
          <div key="widget1" className="widget">
            <OverallExpensesWidget
              expenses={expenses}
              onDropdownToggle={setIsOverallDropdownOpen}
            />
          </div>
          <div key="widget4" className="widget">
            <StatsWidget
              expenses={expenses}
              payday={payday}
              income={weeklyIncome}
              startDate={startDate}
            />
          </div>

          <div key="widget3" className="widget">
            <LineChartExpensesWidget
              expenses={expenses}
              onDropdownToggle={setIsLineChartDropdownOpen}
            />
          </div>
        </ResponsiveGridLayout>

        <NewExpense />
        <Settings
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

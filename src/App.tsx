import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./css/App.css";
import { Expense } from "./shared/expense";
import OverallExpensesWidget from "./components/widgets/OverallExpensesWidget";
import WeeklyExpensesWidget from "./components/widgets/WeeklyExpensesWidget";
import { fetchExpenses } from "./services/expenseService";
import "react-grid-layout/css/styles.css";
import LineChartExpensesWidget from "./components/widgets/LineChartExpensesWidget";
import NewExpense from "./components/widgets/NewExpense";

// Wrap Responsive with WidthProvider
const ResponsiveGridLayout = WidthProvider(Responsive);

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetchExpenses().then(setExpenses);
  }, []);

  const layouts = {
    lg: [
      { i: "widget1", x: 0, y: 0, w: 2, h: 4 },
      { i: "widget2", x: 2, y: 0, w: 3, h: 4 },
      { i: "widget3", x: 0, y: 3, w: 6, h: 8 },
    ],
    md: [
      { i: "widget1", x: 0, y: 0, w: 2, h: 4 },
      { i: "widget2", x: 2, y: 4, w: 3, h: 4 },
      { i: "widget3", x: 0, y: 8, w: 10, h: 7 },
    ],
    sm: [
      { i: "widget1", x: 0, y: 0, w: 6, h: 4 }, // First widget, 4 rows high
      { i: "widget2", x: 0, y: 4, w: 6, h: 6 }, // Second widget starts at y=4, 6 rows high
      { i: "widget3", x: 0, y: 10, w: 6, h: 6 }, // Third widget starts at y=10, 6 rows high
    ],
    xs: [
      { i: "widget1", x: 0, y: 0, w: 6, h: 4 }, // First widget, 4 rows high
      { i: "widget2", x: 0, y: 4, w: 6, h: 6 }, // Second widget starts at y=4, 6 rows high
      { i: "widget3", x: 0, y: 10, w: 6, h: 6 }, // Third widget starts at y=10, 6 rows high
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
            <WeeklyExpensesWidget expenses={expenses} />
          </div>
          <div key="widget3" className="widget">
            <LineChartExpensesWidget expenses={expenses} />
          </div>
        </ResponsiveGridLayout>
        <NewExpense />
      </main>
    </div>
  );
}

export default App;

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
      { i: "widget1", x: 0, y: 0, w: 3, h: 7 }, // Widget1 starts at y=0
      { i: "widget2", x: 3, y: 0, w: 4, h: 7 }, // Widget2 starts at y=0 (same row as widget1)
      { i: "widget3", x: 0, y: 7, w: 6, h: 9 }, // Widget3 starts at y=7 (below widget1 and widget2)
    ],
    md: [
      { i: "widget1", x: 0, y: 0, w: 3, h: 7 }, // Widget1 starts at y=0
      { i: "widget2", x: 3, y: 0, w: 4, h: 7 }, // Widget2 starts at y=0
      { i: "widget3", x: 0, y: 7, w: 10, h: 9 }, // Widget3 starts at y=7 (below widget1 and widget2)
    ],
    sm: [
      { i: "widget1", x: 0, y: 0, w: 6, h: 6 }, // Widget1 starts at y=0, height=6
      { i: "widget2", x: 0, y: 6, w: 6, h: 7 }, // Widget2 starts at y=6 (right after widget1), height=7
      { i: "widget3", x: 0, y: 13, w: 6, h: 9 }, // Widget3 starts at y=13 (6 + 7 = 13), height=9
    ],
    xs: [
      { i: "widget1", x: 0, y: 0, w: 6, h: 6 }, // Widget1 starts at y=0, height=6
      { i: "widget2", x: 0, y: 6, w: 6, h: 7 }, // Widget2 starts at y=6 (right after widget1), height=7
      { i: "widget3", x: 0, y: 13, w: 6, h: 9 }, // Widget3 starts at y=13 (6 + 7 = 13), height=9
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

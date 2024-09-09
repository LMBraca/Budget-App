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
      { i: "widget1", x: 0, y: 0, w: 2, h: 3 },
      { i: "widget2", x: 2, y: 0, w: 3, h: 3 },
      { i: "widget3", x: 0, y: 3, w: 6, h: 5 },
    ],
    md: [
      { i: "widget1", x: 0, y: 0, w: 3, h: 2 },
      { i: "widget2", x: 0, y: 2, w: 3, h: 2 },
      { i: "widget3", x: 0, y: 4, w: 6, h: 3 },
    ],
    sm: [
      { i: "widget1", x: 0, y: 0, w: 2, h: 2 },
      { i: "widget2", x: 0, y: 2, w: 2, h: 2 },
      { i: "widget3", x: 0, y: 4, w: 4, h: 3 },
    ],
    xs: [
      { i: "widget1", x: 0, y: 0, w: 1, h: 2 },
      { i: "widget2", x: 0, y: 2, w: 1, h: 2 },
      { i: "widget3", x: 0, y: 4, w: 2, h: 3 },
    ],
  };

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480 };
  const cols = { lg: 6, md: 6, sm: 4, xs: 2 };

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
          rowHeight={100} // Adjust row height as needed
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

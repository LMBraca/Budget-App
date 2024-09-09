import React, { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import "./css/App.css";
import { Expense } from "./shared/expense";
import OverallExpensesWidget from "./components/widgets/OverallExpensesWidget";
import WeeklyExpensesWidget from "./components/widgets/WeeklyExpensesWidget";
import { fetchExpenses } from "./services/expenseService";
import "react-grid-layout/css/styles.css";
import LineChartExpensesWidget from "./components/widgets/LineChartExpensesWidget";
import NewExpense from "./components/widgets/NewExpense"; // Import NewExpense component

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetchExpenses().then(setExpenses);
  }, []);

  const layout = [
    { i: "widget1", x: 0, y: 0, w: 2, h: 3 },
    { i: "widget2", x: 2, y: 0, w: 3, h: 3 },
    { i: "widget3", x: 0, y: 3, w: 6, h: 5 },
  ];

  return (
    <div>
      <h1>Protopene</h1>
      <main>
        <GridLayout
          className="layout"
          layout={layout}
          cols={6}
          maxRows={16}
          width={1200}
          preventCollision={true}
          isDraggable={false}
          isResizable={false}
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
        </GridLayout>
        <NewExpense />
      </main>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import "./css/App.css";
import { Expense } from "./shared/expense";
import OverallExpensesWidget from "./components/widgets/OverallExpensesWidget";
import WeeklyExpensesWidget from "./components/widgets/WeeklyExpensesWidget";
import { fetchExpenses } from "./services/expenseService";
import { remult } from "remult";
import "react-grid-layout/css/styles.css";

const expenseRepo = remult.repo(Expense);

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetchExpenses().then(setExpenses);
  }, []);

  const layout = [
    { i: "widget1", x: 0, y: 0, w: 2, h: 3 },
    { i: "widget2", x: 0, y: 0, w: 3, h: 3 },
  ];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevents the default drag preview
  };

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
          preventCollision={false}
          isResizable={false}
          draggableCancel=".no-drag"
        >
          <div key="widget1" className="widget" onDragStart={handleDragStart}>
            <OverallExpensesWidget expenses={expenses} />
          </div>
          <div key="widget2" className="widget" onDragStart={handleDragStart}>
            <WeeklyExpensesWidget expenses={expenses} />
          </div>
        </GridLayout>
      </main>
    </div>
  );
}

export default App;

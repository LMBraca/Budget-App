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
  const [layout, setLayout] = useState(
    JSON.parse(localStorage.getItem("layout") || "[]") || [
      { i: "widget1", x: 0, y: 0, w: 2, h: 3 },
      { i: "widget2", x: 2, y: 0, w: 3, h: 3 },
      { i: "widget3", x: 0, y: 3, w: 6, h: 5 },
    ]
  );

  useEffect(() => {
    // Fetch expenses and store them in localStorage
    fetchExpenses().then((data) => {
      setExpenses(data);
      localStorage.setItem("expenses", JSON.stringify(data));
    });

    // Get expenses from localStorage if they exist
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  useEffect(() => {
    // Save layout to localStorage whenever it changes
    localStorage.setItem("layout", JSON.stringify(layout));
  }, [layout]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
          onLayoutChange={(newLayout) => setLayout(newLayout)} // Update layout state
        >
          <div key="widget1" className="widget" onDragStart={handleDragStart}>
            <OverallExpensesWidget expenses={expenses} />
          </div>
          <div key="widget2" className="widget" onDragStart={handleDragStart}>
            <WeeklyExpensesWidget expenses={expenses} />
          </div>
          <div key="widget3" className="widget" onDragStart={handleDragStart}>
            <LineChartExpensesWidget expenses={expenses} />
          </div>
        </GridLayout>
        <NewExpense />
      </main>
    </div>
  );
}

export default App;

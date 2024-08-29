import React, { useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';
import './App.css';
import { Expense } from './shared/expense';
import OverallExpensesWidget from './components/widgets/OverallExpensesWidget';
import WeeklyExpensesWidget from './components/widgets/WeeklyExpensesWidget';
import { fetchExpenses } from './services/expenseService';
import { remult } from 'remult';
import 'react-grid-layout/css/styles.css';

const expenseRepo = remult.repo(Expense);

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetchExpenses().then(setExpenses);
  }, []);

  const layout = [
    { i: 'widget1', x: 0, y: 0, w: 3, h: 1, minW: 3, minH: 1 },
    { i: 'widget2', x: 1, y: 0, w: 3, h: 1, minW: 3, minH: 1 },
  ];

  return (
    <div>
      <h1>protopene</h1>
      <main>
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={300}
          width={1200}
          compactType="horizontal"
          preventCollision={false}
          isResizable={true} 
          resizeHandles={['se', 'e', 'w', 'n', 's']} // Enable resize from all sides
        >
          <div key="widget1" className="widget">
            <h2>All Expenses</h2>
            <hr />
            {expenses.map((expense) => (
              <div key={expense.id}>
                <h3>{expense.description}</h3>
                <div className="row">
                  <h4>Amount:</h4>
                  <p>${expense.expense}</p>
                </div>
                <div className="row">
                  <h4>Location:</h4>
                  <p>{expense.location}</p>
                </div>
                <div className="row">
                  <h4>Date:</h4>
                  <p>
                    {expense.date
                      ? expense.date.toLocaleDateString()
                      : 'No date available'}
                  </p>
                </div>
                <hr />
              </div>
            ))}
          </div>
          <div key="widget2" className="widget">
            <h2>Weekly Expenses</h2>
            <hr />
            {expenses.map((expense) => (
              <div key={expense.id}>
                <h3>{expense.description}</h3>
                <div className="row">
                  <h4>Amount:</h4>
                  <p>${expense.expense}</p>
                </div>
                <div className="row">
                  <h4>Location:</h4>
                  <p>{expense.location}</p>
                </div>
                <div className="row">
                  <h4>Date:</h4>
                  <p>
                    {expense.date
                      ? expense.date.toLocaleDateString()
                      : 'No date available'}
                  </p>
                </div>
                <hr />
              </div>
            ))}
          </div>
        </GridLayout>
      </main>
    </div>
  );
}

export default App;

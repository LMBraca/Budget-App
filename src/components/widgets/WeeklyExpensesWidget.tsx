
import React from 'react';
import { Expense } from '../../shared/expense';

interface Props {
  expenses: Expense[];
}

const OverallExpensesWidget: React.FC<Props> = ({ expenses }) => (
  <div className="widget">
    <h2>Weekly Expenses</h2>
    <hr />
    {expenses.map((expense) => (
      <div key={expense.id}>
        <h3>{expense.description}</h3>
        <div className="row">
          <h4>Amount:</h4>
          <p>${{expense.expense}}</p>
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
);

export default OverallExpensesWidget;

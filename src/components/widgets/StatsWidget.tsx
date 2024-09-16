import React, { useState, useEffect } from "react";
import { Expense } from "../../shared/expense";
import "../../css/ExpensesWidget.css";

interface Props {
  expenses: Expense[];
}

const StatsWidget: React.FC<Props> = ({ expenses }) => {
  const [expensesState, setExpenses] = useState<Expense[]>(expenses);

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.expense,
    0
  );

  useEffect(() => {
    setExpenses(expenses);
  }, [expenses]);

  return (
    <div className="overall-expenses-widget">
      <div className="widget-header">
        <h2 className="dropdown-header">Stats</h2>
      </div>
      <div className="dropdown-content">
        <div className="row">
          <h4>Total spent:</h4>
          <p>${totalExpenses}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;


import { remult } from 'remult';
import { Expense } from '../shared/expense';

const expenseRepo = remult.repo(Expense);

export const fetchExpenses = async (): Promise<Expense[]> => {
  return await expenseRepo.find({});
};

// Other CRUD operations can be added here...

// expenseService.ts
import { supabase } from '../models/supabaseClient';
import { Expense } from '../models/expense';

export const fetchExpenses = async (): Promise<Expense[]> => {
  const userId = localStorage.getItem('userId');
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('Expenses')
      .select('*')
      .eq('IdUser', parseInt(userId));

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.IdExpense,
      expense: parseFloat(row.Expense),
      description: row.Description,
      location: row.Location,
      date: new Date(row.Date),
      idUser: row.IdUser,
    }));
  } catch {
    return [];
  }
};

export const insertExpense = async (expense: Expense): Promise<void> => {
  try {
    await supabase.from('Expenses').insert([
      {
        Description: expense.description,
        Expense: expense.expense,
        Location: expense.location,
        Date: expense.date,
        IdUser: expense.idUser,
      },
    ]);
  } catch {
    // Handle error
  }
};

export const updateExpense = async (expense: Expense): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('Expenses')
      .update({
        Description: expense.description,
        Expense: expense.expense,
        Location: expense.location,
        Date: expense.date,
      })
      .eq('IdExpense', expense.id);

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
};

export const deleteExpense = async (
  expenseId: number
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('Expenses')
      .delete()
      .eq('IdExpense', expenseId);

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
};
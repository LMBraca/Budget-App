// debtService.ts
import { supabase } from '../models/supabaseClient';
import { Debt } from '../models/debt';

export const fetchDebts = async (): Promise<Debt[]> => {
  const userId = localStorage.getItem('userId');
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('Debts')
      .select('*')
      .eq('IdUser', parseInt(userId));

    if (error || !data) return [];

    return data.map((row: any) => ({
      idDebt: row.IdDebt,
      debt: parseFloat(row.Debt),
      description: row.Description,
      name: row.Name,
      date: new Date(row.Date),
      idUser: row.IdUser,
      paid: row.Paid,
    }));
  } catch {
    return [];
  }
};

export const insertDebt = async (debt: Debt): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase.from('Debts').insert([
      {
        Description: debt.description,
        Debt: debt.debt,
        Name: debt.name,
        Date: debt.date,
        IdUser: debt.idUser,
        Paid: debt.paid,
      },
    ]);

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
};

export const updateDebt = async (debt: Debt): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('Debts')
      .update({
        Description: debt.description,
        Debt: debt.debt,
        Name: debt.name,
        Date: debt.date,
        Paid: debt.paid,
      })
      .eq('IdDebt', debt.idDebt);

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
};

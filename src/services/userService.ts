// userService.ts
import { supabase } from '../models/supabaseClient';

export const signIn = async (username: string, password: string): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('Username', username)
      .eq('Password', password);

    if (error || !data || data.length === 0) {
      return null;
    }

    return data[0].IdUser;
  } catch {
    return null;
  }
};

export const checkUsernameUnique = async (username: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('Username', username);

    if (error) {
      return false;
    }

    return data.length === 0;
  } catch {
    return false;
  }
};

export const registerUser = async (
  username: string,
  password: string,
  weeklyIncome: number,
  payday: number,
  startDate: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('Users').insert([
      {
        Username: username,
        Password: password,
        WeeklyIncome: weeklyIncome,
        Payday: payday,
        StartDate: startDate,
      },
    ]);

    return !error;
  } catch {
    return false;
  }
};

export const updateSettings = async (newIncome: number, payday: number): Promise<void> => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  try {
    await supabase
      .from('Users')
      .update({ WeeklyIncome: newIncome, Payday: payday })
      .eq('IdUser', parseInt(userId));
  } catch {
    // Handle error
  }
};

export const fetchWeeklyIncome = async (): Promise<number | null> => {
  const userId = localStorage.getItem('userId');
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('Users')
      .select('WeeklyIncome')
      .eq('IdUser', parseInt(userId))
      .single();

    if (error) return null;

    return data?.WeeklyIncome || 0;
  } catch {
    return null;
  }
};

export const fetchPayday = async (): Promise<number | null> => {
  const userId = localStorage.getItem('userId');
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('Users')
      .select('Payday')
      .eq('IdUser', parseInt(userId))
      .single();

    if (error) return null;

    return data?.Payday || 1;
  } catch {
    return null;
  }
};

export const fetchStartDate = async (): Promise<Date | null> => {
  const userId = localStorage.getItem('userId');
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('Users')
      .select('StartDate')
      .eq('IdUser', parseInt(userId))
      .single();

    if (error) return null;

    return data?.StartDate ? new Date(data.StartDate) : null;
  } catch {
    return null;
  }
};

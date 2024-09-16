import { createClient } from '@supabase/supabase-js';
import { Expense } from '../shared/expense';

const supabaseUrl = 'https://doabuygwmiikcxuleuiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYWJ1eWd3bWlpa2N4dWxldWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MTUzMTEsImV4cCI6MjA0MDk5MTMxMX0.BBL2eLpWi26D8OAmJaDHzCLfb9sgfnI56WRx3j7uw6I'; // Ensure this key is kept secure
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch expenses for the logged-in user
export const fetchExpenses = async (): Promise<Expense[]> => {
  const userId = localStorage.getItem('userId'); // Get the userId from localStorage
  if (!userId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('Expenses')
      .select('*')
      .eq('IdUser', parseInt(userId)); // Fetch expenses for the specific user

    if (error) {
      return [];
    }

    const expenses: Expense[] = data.map((row: any) => ({
      id: row.IdExpense,
      expense: parseFloat(row.Expense),
      description: row.Description,
      location: row.Location,
      date: new Date(row.Date),
      idUser: row.IdUser,
    }));

    return expenses;
  } catch (error) {
    return [];
  }
};

// Sign-in logic
export const signIn = async (username: string, password: string): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('Username', username)
      .eq('Password', password);

    if (error) {
      return null;
    }

    // Check if a user was found
    if (data && data.length > 0) {
      return data[0].IdUser; // Return the userId on successful sign-in
    } else {
      return null; // Sign-in failed
    }
  } catch (error) {
    return null;
  }
};

export const checkUsernameUnique = async (username: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('Username', username);

  if (error) {
    return false;
  }

  return data.length === 0; // If data length is 0, username is unique
};

// Register a new user
export const registerUser = async (
  username: string,
  password: string,
  weeklyIncome: number,
  payday: number,
  startDate: string // Accept the formatted date from frontend
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .insert([
        {
          Username: username,
          Password: password,
          WeeklyIncome: weeklyIncome,
          Payday: payday,
          StartDate: startDate // Store the date as a string or convert it back to timestamptz
        }
      ]);

    if (error) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};




// Insert a new expense into the database
export const insertExpense = async (expense: Expense) => {
  try {
    const { data, error } = await supabase
      .from('Expenses')
      .insert([
        {
          Description: expense.description,
          Expense: expense.expense,
          Location: expense.location,
          Date: expense.date, // Ensure this is in the right format
          IdUser: expense.idUser, // Ensure this is passed correctly
        },
      ]);
    if (error) {
    }

  } catch (err) {
  }
};

export const updateExpense = async (expense: Expense) => {
  try {

    const { data, error } = await supabase
      .from('Expenses')
      .update({
        Description: expense.description,
        Expense: expense.expense,
        Location: expense.location,
        Date: expense.date, // Ensure this is in the right format
      })
      .eq('IdExpense', expense.id); // Make sure you're updating the correct expense based on its ID

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };

  } catch (err) {
    return { success: false, error: err };
  }
};

export const updateSettings = async (newIncome: number, payday: number): Promise<void> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return;
  }

  try {
    const { error } = await supabase
      .from('Users')
      .update({ WeeklyIncome: newIncome, Payday: payday})
      .eq('IdUser', parseInt(userId));

    if (error) {
    }
  } catch (error) {
  }
};

export const fetchWeeklyIncome = async (): Promise<number | null> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('Users')
      .select('WeeklyIncome')
      .eq('IdUser', parseInt(userId))
      .single();

    if (error) {
      return null;
    }

    return data?.WeeklyIncome || 0;
  } catch (error) {
    return null;
  }
};

// Fetch payday
export const fetchPayday = async (): Promise<number | null> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('Users')
      .select('Payday')
      .eq('IdUser', parseInt(userId))
      .single();

    if (error) {
      return null;
    }

    return data?.Payday || 1; // Default to Thursday (4)
  } catch (error) {
    return null;
  }
};

export const fetchStartDate = async (): Promise<Date | null> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('Users')
      .select('StartDate')
      .eq('IdUser', parseInt(userId))
      .single();

    if (error) {
      return null;
    }
    // Convert the StartDate (string) to a JavaScript Date object
    return data?.StartDate ? new Date(data.StartDate) : null;
  } catch (error) {
    return null;
  }
};

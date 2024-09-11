import { createClient } from '@supabase/supabase-js';
import { Expense } from '../shared/expense';

const supabaseUrl = 'https://doabuygwmiikcxuleuiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYWJ1eWd3bWlpa2N4dWxldWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MTUzMTEsImV4cCI6MjA0MDk5MTMxMX0.BBL2eLpWi26D8OAmJaDHzCLfb9sgfnI56WRx3j7uw6I'; // Ensure this key is kept secure
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch expenses for the logged-in user
export const fetchExpenses = async (): Promise<Expense[]> => {
  const userId = localStorage.getItem('userId'); // Get the userId from localStorage
  if (!userId) {
    console.error('No userId found. User might not be signed in.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('Expenses')
      .select('*')
      .eq('IdUser', parseInt(userId)); // Fetch expenses for the specific user

    if (error) {
      console.error('Error fetching expenses from Supabase:', error);
      return [];
    }

    console.log("Fetched data:", data);

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
    console.error('Unexpected error fetching expenses from Supabase:', error);
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
      console.error('Error signing in:', error);
      return null;
    }

    // Check if a user was found
    if (data && data.length > 0) {
      console.log("User signed in:", data[0]);
      return data[0].IdUser; // Return the userId on successful sign-in
    } else {
      console.log("Invalid username or password");
      return null; // Sign-in failed
    }
  } catch (error) {
    console.error('Unexpected error during sign-in:', error);
    return null;
  }
};

export const checkUsernameUnique = async (username: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('Username', username);

  if (error) {
    console.error("Error checking username uniqueness:", error);
    return false;
  }

  return data.length === 0; // If data length is 0, username is unique
};

// Register a new user
export const registerUser = async (username: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .insert([{ Username: username, Password: password }]);

    if (error) {
      console.error("Error registering user:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error occurred during registration:", err);
    return false;
  }
};

// Insert a new expense into the database
export const insertExpense = async (expense: Expense) => {
  try {
    console.log(expense.date)
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
      console.error('Error inserting expense:', error.message, error.details, error.hint);
    }

  } catch (err) {
    console.error('Unexpected error during expense insert:', err);
  }
};

export const updateExpense = async (expense: Expense) => {
  try {
    console.log("Sending update request to Supabase for expense:", expense); // Log the outgoing request

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
      console.error('Error updating expense:', error.message, error.details, error.hint); // Log any errors from Supabase
      return { success: false, error };
    }

    console.log('Expense updated successfully:', data); // Log the success response
    return { success: true, data };

  } catch (err) {
    console.error('Unexpected error during expense update:', err); // Log any unexpected errors
    return { success: false, error: err };
  }
};

export const updateWeeklyIncomeAndPayday = async (newIncome: number, payday: number): Promise<void> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('No userId found. User might not be signed in.');
    return;
  }

  try {
    const { error } = await supabase
      .from('Users')
      .update({ WeeklyIncome: newIncome, Payday: payday })
      .eq('IdUser', parseInt(userId));

    if (error) {
      console.error('Error updating WeeklyIncome and Payday in Supabase:', error);
    }
  } catch (error) {
    console.error('Unexpected error updating WeeklyIncome and Payday:', error);
  }
};

export const fetchWeeklyIncome = async (): Promise<number | null> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('No userId found. User might not be signed in.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('Users')
      .select('WeeklyIncome')
      .eq('IdUser', parseInt(userId))
      .single();

    if (error) {
      console.error('Error fetching WeeklyIncome:', error);
      return null;
    }

    return data?.WeeklyIncome || 0;
  } catch (error) {
    console.error('Unexpected error fetching WeeklyIncome:', error);
    return null;
  }
};

// Fetch payday
export const fetchPayday = async (): Promise<number | null> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('No userId found. User might not be signed in.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('Users')
      .select('Payday')
      .eq('IdUser', parseInt(userId))
      .single();

    if (error) {
      console.error('Error fetching Payday:', error);
      return null;
    }

    return data?.Payday || 4; // Default to Thursday (4)
  } catch (error) {
    console.error('Unexpected error fetching Payday:', error);
    return null;
  }
};
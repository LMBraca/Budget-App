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


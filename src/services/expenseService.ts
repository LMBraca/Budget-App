import axios from 'axios';
import { Expense } from '../shared/expense';

const SHEET_ID = '1ySU6F_KeGMpGzciQBJVw0Ffljk4nw1qtZL9L9bunpsE';
const API_KEY = 'AIzaSyAYEFZAaGBnIgwTlWtAuAIdokqP54J7qws';
const RANGE = 'RawData!A2:E'; // Adjust this to match your sheet's structure

export const fetchExpenses = async (): Promise<Expense[]> => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const rows = response.data.values;

    // Convert rows to Expense objects
    const expenses: Expense[] = rows.slice(1).map((row: string[], index: number) => ({
      id: index + 1,
      date: new Date(row[0]),  // Assuming the first column is date
      expense: parseFloat(row[2]),  // Assuming the third column is expense
      description: row[3],  // Assuming the fourth column is description
      location: row[4]  // Assuming the fifth column is location
    }));

    return expenses;
  } catch (error) {
    console.error('Error fetching expenses from Google Sheets:', error);
    return [];
  }
};

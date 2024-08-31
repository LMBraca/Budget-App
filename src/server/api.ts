import express from "express";
import { fetchExpenses } from "../services/expenseService";

const router = express.Router();

router.get("/expenses", async (req, res) => {
    try {
        const expenses = await fetchExpenses();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch expenses" });
    }
});

export const api = router;

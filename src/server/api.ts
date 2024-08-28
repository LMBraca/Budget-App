import { remultExpress } from "remult/remult-express";
import { Expense } from "../shared/expense";

export const api = remultExpress({
    entities: [Expense],
}) 
import express from "express";
import { api } from "./api";

const app = express();
app.use("/api", api);
app.listen(3001, () => console.log("Server started on port 3001"));

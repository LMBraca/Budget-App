import express from "express";
import { api } from "./api";

const app = express();
app.use(api)
app.listen(3001, () => console.log("startd"))


import express from "express";
import residentRoutes from "./routes/residentRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use("/residents", residentRoutes);

app.use(errorHandler);

export default app;

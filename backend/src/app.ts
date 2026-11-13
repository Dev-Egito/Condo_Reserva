import express from "express";
import residentRoutes from "./routes/residentRoutes";
import leisureAreaRoutes from "./routes/leisureAreaRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use("/residents", residentRoutes);
app.use("/leisure-areas", leisureAreaRoutes);
app.use("/reservations", reservationRoutes);

app.use(errorHandler);

export default app;

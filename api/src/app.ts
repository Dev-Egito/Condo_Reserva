import express from "express";
import cors from "cors";
import residentRoutes from "./routes/residentRoutes";
import apartmentRoutes from "./routes/apartmentRoutes";
import leisureAreaRoutes from "./routes/leisureAreaRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/apartments", apartmentRoutes);
app.use("/residents", residentRoutes);
app.use("/leisure-areas", leisureAreaRoutes);
app.use("/reservations", reservationRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;

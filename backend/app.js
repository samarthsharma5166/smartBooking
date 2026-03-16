import cookieParser from 'cookie-parser';
import express from 'express';
import errorMiddleware from './middlewares/ error.middleware.js';
import cors from 'cors'
import doctorRoutes from "./routes/doctor.routes.js";
import googleRoutes from "./routes/google.routes.js";
import bookingRouters from "./routes/booking.routes.js";
import sessionTypeRoutes from "./routes/sessionType.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import paymentRoutes from './routes/payment.routes.js';
import "./jobs/jobs.js";


const app = express();
// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "https://4v1gfcbl-5173.inc1.devtunnels.ms", "http://localhost:4173"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use('/ping', (req, res) => {
    res.send('Poong');
});
app.use("/api/v1/google", googleRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/bookings", bookingRouters);
app.use("/api/v1/session-types", sessionTypeRoutes);

app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.use((req, res) => {
    res.status(404).send("oops! page not found ");
});

app.use(errorMiddleware);
export default app;


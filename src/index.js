import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Importar rutas (a medida que las vayas creando)
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import clinicalHistoryRoutes from "./routes/clinicalHistoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentsRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 MongoDB conectado"))
  .catch((err) => {
    console.error("🔴 Error conectando a MongoDB:", err);
    process.exit(1);
  });

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/clinicalhistory", clinicalHistoryRoutes);
app.use("/api/appointments", appointmentRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});

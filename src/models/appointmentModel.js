// src/models/appointmentModel.js
import mongoose from "mongoose";
import AppointmentSchema from "../schemas/appointmentSchema.js"; // Asegurate de que esta ruta y archivo existan

const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);
export default AppointmentModel;

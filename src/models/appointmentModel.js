// src/models/appointmentModel.js
import mongoose from "mongoose";
import AppointmentSchema from "../models/schemas/appointmentSchema"; // Asegurate de que esta ruta y archivo existan

const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);
export default AppointmentModel;

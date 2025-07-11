import { model } from "mongoose";
import AppointmentSchema from "../models/schemas/appointmentSchema.js";

const AppointmentModel = model("Appointment", AppointmentSchema);

export default AppointmentModel;

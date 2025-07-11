// src/schemas/appointmentSchema.js
import { Schema, Types } from "mongoose";

const AppointmentSchema = new Schema({
  patient: { type: Types.ObjectId, ref: "Patient", required: true },
  professional: { type: Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  notes: { type: String },
});

export default AppointmentSchema;

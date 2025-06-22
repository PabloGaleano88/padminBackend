import { Schema, Types } from "mongoose";

const PatientSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dni: { type: String, required: true },
  birthDate: { type: Date, required: true },
  phone: { type: String },
  email: { type: String, lowercase: true },
  createdAt: { type: Date, default: Date.now },
  clinicalHistories: [
    {
      professional: { type: Types.ObjectId, ref: "User", required: true },
      history: { type: Types.ObjectId, ref: "ClinicalHistory" },
    },
  ],
});

export default PatientSchema;

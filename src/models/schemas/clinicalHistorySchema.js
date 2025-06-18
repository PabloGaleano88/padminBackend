import { Schema, Types } from "mongoose";

const ClinicalHistorySchema = new Schema({
  patient: { type: Types.ObjectId, ref: "Patient", required: true },
  professional: { type: Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  observations: { type: String },
  diagnosis: { type: String },
  treatment: { type: String },
});

export default ClinicalHistorySchema;

import { model } from "mongoose";
import PatientSchema from "../models/schemas/patientSchema.js";

const PatientModel = model("Patient", PatientSchema);

export default PatientModel;

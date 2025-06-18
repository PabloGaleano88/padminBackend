import { model } from "mongoose";
import ClinicalHistorySchema from "../models/schemas/clinicalHistorySchema.js";

const ClinicalHistoryModel = model("ClinicalHistory", ClinicalHistorySchema);

export default ClinicalHistoryModel;

import { Router } from "express";
import { ClinicalHistoryController } from "../controllers/clinicalHistoryController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/", authMiddleware, ClinicalHistoryController.create);
router.get("/", authMiddleware, ClinicalHistoryController.getByProfessional);
router.get("/:id", ClinicalHistoryController.getById);
router.put("/:id", authMiddleware, ClinicalHistoryController.update);
router.delete("/:id", authMiddleware, ClinicalHistoryController.remove);
router.get("/patient/:patientId", ClinicalHistoryController.getByPatient);
export default router;

import { Router } from "express";
import { ClinicalHistoryController } from "../controllers/clinicalHistoryController.js";

const router = Router();

router.post("/", ClinicalHistoryController.create);
router.get("/", ClinicalHistoryController.getAll);
router.get("/:id", ClinicalHistoryController.getById);
router.put("/:id", ClinicalHistoryController.update);
router.delete("/:id", ClinicalHistoryController.remove);

export default router;

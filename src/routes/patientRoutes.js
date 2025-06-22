import { Router } from "express";
import { PatientController } from "../controllers/patientController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// Rutas protegidas
router.use(authMiddleware);

router.post("/", PatientController.create);
router.get("/", PatientController.getByProfessional);
router.get("/:id", PatientController.getById);
router.put("/:id", PatientController.update);
router.delete("/:id", PatientController.remove);

export default router;

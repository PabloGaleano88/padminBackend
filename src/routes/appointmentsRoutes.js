import express from "express";
import { AppointmentController } from "../controllers/appointmentsController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authMiddleware, AppointmentController.create);
router.put("/:id", authMiddleware, AppointmentController.update);
router.delete("/:id", authMiddleware, AppointmentController.delete);

export default router;

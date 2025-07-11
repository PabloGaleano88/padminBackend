import express from "express";
import { AppointmentController } from "../controllers/appointmentsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, AppointmentController.create);

export default router;

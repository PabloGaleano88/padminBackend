import { Router } from "express";
import { AuthController } from "../controllers/authController.js";

console.log("AuthController:", AuthController);

const router = Router();

router.post("/google", AuthController.googleLogin);
router.post("/login", AuthController.login);
router.post("/register", AuthController.register); // <-- nuevo endpoint

export default router;

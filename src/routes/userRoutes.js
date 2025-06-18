import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// Si querés permitir crear usuarios sin estar logueado, dejá esta ruta sin middleware
router.post("/", UserController.create);

// A partir de acá, todas requieren autenticación
router.use(authMiddleware);

router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.remove);

export default router;

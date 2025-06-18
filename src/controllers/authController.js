import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const AuthController = {
  // Login existente...

  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      // Validar que no exista ya el usuario
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      // Hashear la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Crear nuevo usuario
      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      // Opcional: Crear token automáticamente al registrar
      const payload = {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({ token, user: payload });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error en el servidor al crear el usuario" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token, user: payload });
    } catch (error) {
      res.status(500).json({ error: "Error en el servidor" });
    }
  },
};

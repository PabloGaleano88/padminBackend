import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const AuthController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      const payload = {
        id: newUser._id,
        name: newUser.name,
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
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token, user: payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  },

  googleLogin: async (req, res) => {
    const { credential } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name } = payload;

      let user = await UserModel.findOne({ email });

      if (!user) {
        user = await UserModel.create({
          name,
          email,
          password: "", // No se usa porque viene de Google
          role: "medico",
        });
      }

      const tokenPayload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token, user: tokenPayload });
    } catch (error) {
      console.error("Error verificando token de Google", error);
      res.status(401).json({ error: "Token inválido de Google" });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(400).json({ error: "Email no registrado" });

      // Crear token temporal para reset (válido 1 hora)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Configurar transporte nodemailer (aquí Gmail)
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false, // << esta línea permite ignorar el error
        },
      });

      // Link para resetear la contraseña (ajustar URL frontend)
      const resetLink = `http://localhost:5173/reset-password/${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Resetear contraseña Padmin",
        html: `<p>Haz clic <a href="${resetLink}">aquí</a> para resetear tu contraseña. Este enlace es válido por 1 hora.</p>`,
      });

      res.json({ message: "Email enviado para resetear contraseña" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al enviar email" });
    }
  },

  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.findByIdAndUpdate(payload.id, {
        password: hashedPassword,
      });

      res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Token inválido o expirado" });
    }
  },
};

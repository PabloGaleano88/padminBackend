import UserModel from "../models/userModel.js";

export const UserController = {
  create: async (req, res) => {
    try {
      const { password, ...rest } = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await UserModel.create({
        ...rest,
        password: hashedPassword,
      });

      res.status(201).json(user);
    } catch (error) {
      res
        .status(400)
        .json({ error: "Error al crear el usuario", details: error });
    }
  },

  getAll: async (_req, res) => {
    try {
      const users = await UserModel.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "ID inválido" });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedUser) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: "Error al actualizar el usuario" });
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await UserModel.findByIdAndDelete(id);
      if (!deletedUser) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ error: "Error al eliminar el usuario" });
    }
  },
};

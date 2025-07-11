import AppointmentModel from "../models/appointmentModel.js";

export const AppointmentController = {
  create: async (req, res) => {
    try {
      const { patient, date } = req.body;
      const appointment = await AppointmentModel.create({
        patient,
        professional: req.user.id, // o como manejes la autenticación
        date,
      });
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error al crear turno:", error);
      res.status(500).json({ error: "Error al crear turno" });
    }
  },
};

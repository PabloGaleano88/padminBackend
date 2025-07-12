import AppointmentModel from "../models/appointmentModel.js";
import PatientModel from "../models/patientModel.js";

export const AppointmentController = {
  // Crear turno
  create: async (req, res) => {
    try {
      const { patient, date } = req.body;

      const appointment = await AppointmentModel.create({
        patient,
        professional: req.user.id,
        date,
      });

      // Asociar el turno al paciente
      await PatientModel.findByIdAndUpdate(patient, {
        proximoTurno: appointment._id,
      });

      const populated = await appointment.populate("professional");

      res.status(201).json(populated);
    } catch (error) {
      console.error("Error al crear turno:", error);
      res.status(500).json({ error: "Error al crear turno" });
    }
  },

  // Editar turno
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { date } = req.body;

      const updated = await AppointmentModel.findByIdAndUpdate(
        id,
        { date },
        { new: true }
      ).populate("professional");

      if (!updated) {
        return res.status(404).json({ error: "Turno no encontrado" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error al editar turno:", error);
      res.status(500).json({ error: "Error al editar turno" });
    }
  },

  // Eliminar turno
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const appointment = await AppointmentModel.findById(id);
      if (!appointment) {
        return res.status(404).json({ error: "Turno no encontrado" });
      }

      // Limpiar el campo proximoTurno en el paciente
      await PatientModel.findByIdAndUpdate(appointment.patient, {
        $unset: { proximoTurno: "" },
      });

      await AppointmentModel.findByIdAndDelete(id);

      res.json({ message: "Turno eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar turno:", error);
      res.status(500).json({ error: "Error al eliminar turno" });
    }
  },
};

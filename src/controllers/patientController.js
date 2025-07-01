import PatientModel from "../models/patientModel.js";
import ClinicalHistoryModel from "../models/clinicalHistoryModel.js";

export const PatientController = {
  // Crear un paciente
  create: async (req, res) => {
    try {
      if (req.body.birthDate) {
        const birthDate = new Date(req.body.birthDate);
        birthDate.setUTCHours(12, 0, 0, 0); // Setea mediodía UTC para evitar desfases de huso horario
        req.body.birthDate = birthDate;
      }

      const patient = await PatientModel.create(req.body);
      res.status(201).json(patient);
    } catch (error) {
      res
        .status(400)
        .json({ error: "Error al crear el paciente", details: error });
    }
  },

  // Obtener todos los pacientes
  getAll: async (req, res) => {
    try {
      const histories = await ClinicalHistoryModel.find({
        professional: req.user.id,
      }).select("patient");
      const patientIds = histories.map((h) => h.patient);

      const patients = await PatientModel.find({ _id: { $in: patientIds } });
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los pacientes" });
    }
  },

  getByProfessional: async (req, res) => {
    try {
      const userId = req.user.id;

      // 1. Buscar historias clínicas del profesional
      const historias = await ClinicalHistoryModel.find({
        professional: userId,
      });

      // 2. Extraer IDs únicos de pacientes
      const patientIds = [
        ...new Set(historias.map((historia) => historia.patient.toString())),
      ];

      // 3. Buscar los pacientes asociados
      const pacientes = await PatientModel.find({ _id: { $in: patientIds } });

      res.json(pacientes);
    } catch (err) {
      console.error("Error al obtener pacientes del profesional:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // Obtener un paciente por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const patient = await PatientModel.findById(id);
      if (!patient) {
        res.status(404).json({ error: "Paciente no encontrado" });
        return;
      }
      res.json(patient);
    } catch (error) {
      res.status(400).json({ error: "ID inválido" });
    }
  },

  // Actualizar un paciente por ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await PatientModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updated) {
        res.status(404).json({ error: "Paciente no encontrado" });
        return;
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Error al actualizar el paciente" });
    }
  },

  // Eliminar un paciente por ID
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await PatientModel.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ error: "Paciente no encontrado" });
        return;
      }
      res.json({ message: "Paciente eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ error: "Error al eliminar el paciente" });
    }
  },
};

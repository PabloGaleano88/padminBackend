import mongoose from "mongoose";
import PatientModel from "../models/patientModel.js";
import ClinicalHistoryModel from "../models/clinicalHistoryModel.js";
import AppointmentModel from "../models/appointmentModel.js";

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

      // Para cada paciente, buscar próximo turno
      const patientsWithNextAppointment = await Promise.all(
        patients.map(async (patient) => {
          // Buscar próximo turno >= hoy para este paciente
          const nextAppointment = await AppointmentModel.findOne({
            patient: patient._id,
            date: { $gte: new Date() },
          })
            .sort({ date: 1 })
            .lean();

          return {
            ...patient.toObject(),
            proximoTurno: nextAppointment || null,
          };
        })
      );

      res.json(patientsWithNextAppointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los pacientes" });
    }
  },

  getByProfessional: async (req, res) => {
    try {
      const userId = req.user.id;

      // Buscar historias clínicas del profesional
      const historias = await ClinicalHistoryModel.find({
        professional: userId,
      });
      const patientIds = [
        ...new Set(historias.map((h) => h.patient.toString())),
      ];

      // Buscar los pacientes asociados
      const pacientes = await PatientModel.find({ _id: { $in: patientIds } });

      // Buscar el próximo turno para cada paciente
      const pacientesConTurno = await Promise.all(
        pacientes.map(async (paciente) => {
          const turno = await AppointmentModel.findOne({
            patient: paciente._id,
            date: { $gte: new Date() },
          }).sort({ date: 1 });

          return {
            ...paciente.toObject(),
            proximoTurno: turno ? turno.date : null,
          };
        })
      );

      res.json(pacientesConTurno);
    } catch (err) {
      console.error("Error al obtener pacientes del profesional:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // Obtener un paciente por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const patient = await PatientModel.findById(id);
      if (!patient) {
        res.status(404).json({ error: "Paciente no encontrado" });
        return;
      }

      const proximoTurno = await AppointmentModel.findOne({
        patient: id,
        date: { $gte: new Date() },
      })
        .sort({ date: 1 })
        .populate("professional", "name");

      res.json({
        ...patient.toObject(),
        proximoTurno,
      });
    } catch (error) {
      console.error("Error en getById:", error);
      res.status(500).json({ error: "Error interno del servidor" });
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

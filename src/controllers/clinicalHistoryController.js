import ClinicalHistoryModel from "../models/clinicalHistoryModel.js";
import PatientModel from "../models/patientModel.js";

export const ClinicalHistoryController = {
  getByProfessional: async (req, res) => {
    try {
      const professionalId = req.user.id;

      const histories = await ClinicalHistoryModel.find({
        professional: professionalId,
      })
        .populate("patient", "firstName lastName dni birthDate")
        .populate("professional", "name email role");

      res.json(histories);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error al obtener las historias clínicas del profesional",
      });
    }
  },
  create: async (req, res) => {
    try {
      const history = await ClinicalHistoryModel.create({
        patient: req.body.patient,
        professional: req.user.id, // asumimos que usás authMiddleware
        observations: req.body.observations,
        diagnosis: req.body.diagnosis,
        treatment: req.body.treatment,
      });

      res.status(201).json(history);
    } catch (err) {
      console.error("Error al crear historia clínica:", err);
      res.status(500).json({ error: "Error al crear historia clínica" });
    }
  },

  getByPatient: async (req, res) => {
    try {
      const { patientId } = req.params;
      const historias = await ClinicalHistoryModel.find({
        patient: patientId,
      }).sort({ date: -1 });
      res.json(historias);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la historia clínica" });
    }
  },
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const clinicalHistory = await ClinicalHistoryModel.findById(id)
        .populate("patient", "firstName lastName dni birthDate")
        .populate("professional", "firstName lastName email role");
      if (!clinicalHistory) {
        res.status(404).json({ error: "Historia clínica no encontrada" });
        return;
      }
      res.json(clinicalHistory);
    } catch (error) {
      res.status(400).json({ error: "ID inválido" });
    }
  },

  update: async (req, res) => {
    try {
      const professionalId = req.user.id;
      const { id } = req.params;

      // Buscar la historia clínica
      const history = await ClinicalHistoryModel.findById(id);

      if (!history) {
        return res
          .status(404)
          .json({ error: "Historia clínica no encontrada" });
      }

      // Verificar que el profesional sea el creador
      if (history.professional.toString() !== professionalId) {
        return res.status(403).json({
          error: "No tienes permiso para modificar esta historia clínica",
        });
      }

      // Actualizar la historia clínica
      const updated = await ClinicalHistoryModel.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );

      res.json(updated);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error al actualizar la historia clínica" });
    }
  },

  remove: async (req, res) => {
    try {
      const professionalId = req.user.id;
      const { id } = req.params;

      const history = await ClinicalHistoryModel.findById(id);

      if (!history) {
        return res
          .status(404)
          .json({ error: "Historia clínica no encontrada" });
      }

      // Verificar autoría
      if (history.professional.toString() !== professionalId) {
        return res.status(403).json({
          error: "No tienes permiso para eliminar esta historia clínica",
        });
      }

      // Eliminar la historia clínica
      await ClinicalHistoryModel.findByIdAndDelete(id);

      // Eliminar también la referencia en el paciente
      await PatientModel.updateOne(
        { _id: history.patient },
        { $pull: { clinicalHistories: { history: history._id } } }
      );

      res.json({ message: "Historia clínica eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar la historia clínica" });
    }
  },
};

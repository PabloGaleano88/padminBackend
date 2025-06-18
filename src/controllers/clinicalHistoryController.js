import ClinicalHistoryModel from "../models/clinicalHistoryModel.js";

export const ClinicalHistoryController = {
  create: async (req, res) => {
    try {
      const clinicalHistory = await ClinicalHistoryModel.create(req.body);
      res.status(201).json(clinicalHistory);
    } catch (error) {
      res
        .status(400)
        .json({ error: "Error al crear la historia clínica", details: error });
    }
  },
  getAll: async (req, res) => {
    try {
      const clinicalHistories = await ClinicalHistoryModel.find({
        professional: req.user.id,
      })
        .populate("patient", "firstName lastName dni birthDate")
        .populate("professional", "firstName lastName email role");
      res.json(clinicalHistories);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener las historias clínicas" });
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
      const { id } = req.params;
      const updatedClinicalHistory =
        await ClinicalHistoryModel.findByIdAndUpdate(id, req.body, {
          new: true,
        })
          .populate("patient", "firstName lastName dni birthDate")
          .populate("professional", "firstName lastName email role");
      if (!updatedClinicalHistory) {
        res.status(404).json({ error: "Historia clínica no encontrada" });
        return;
      }
      res.json(updatedClinicalHistory);
    } catch (error) {
      res
        .status(400)
        .json({ error: "Error al actualizar la historia clínica" });
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedClinicalHistory =
        await ClinicalHistoryModel.findByIdAndDelete(id);
      if (!deletedClinicalHistory) {
        res.status(404).json({ error: "Historia clínica no encontrada" });
        return;
      }
      res.json({ message: "Historia clínica eliminada correctamente" });
    } catch (error) {
      res.status(400).json({ error: "Error al eliminar la historia clínica" });
    }
  },
};

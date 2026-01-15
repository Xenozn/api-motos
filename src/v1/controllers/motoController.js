const Moto = require('../models/motoModel');
const User = require("../models/userModel");

exports.getAllMotos = async (req, res) => {
    try {
        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // On lance les deux promesses en parallèle pour gagner en performance
        const [rows, total] = await Promise.all([
            Moto.findAllPaging(limit, offset),
            Moto.countAll()
        ]);

        res.status(200).json({
            status: "success",
            results: rows.length,
            total_records: total,
            current_page: page,
            total_pages: Math.ceil(total / limit),
            data: rows
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


exports.getMotoById = async (req, res) => {
    const { id } = req.params;

    try {
        const moto = await Moto.findById(id);

        if (!moto) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({ status: "success", data: moto });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
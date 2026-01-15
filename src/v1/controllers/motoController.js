const Moto = require('../models/motoModel');

exports.getAllMotos = async (req, res) => {
    try {
        const { marque, minCylindree, maxCylindree, search, sortBy, order } = req.query;
        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // On récupère les motos et le total en parallèle
        const [rows, total] = await Promise.all([
            Moto.findAllPaging({ marque, minCylindree, maxCylindree, search, sortBy, order, limit, offset }),
            Moto.countAll({ marque, minCylindree, maxCylindree, search })
        ]);

        if (!rows.length) {
            return res.status(200).json({
                status: "success",
                message: "Aucune moto ne correspond à vos critères de recherche.",
                total_records: 0,
                data: []
            });
        }

        res.status(200).json({
            status: "success",
            total_records: total,
            current_page: page,
            total_pages: Math.ceil(total / limit),
            results: rows.length,
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
        if (!moto) return res.status(404).json({ message: "Moto non trouvée" });

        res.status(200).json({ status: "success", data: moto });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

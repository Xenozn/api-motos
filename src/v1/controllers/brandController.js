const Brand = require('../models/brandModel');

exports.getAllBrands = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        const [rows, total] = await Promise.all([
            Brand.findAllPaging({ limit, offset, search }),
            Brand.countAll({ search })
        ]);

        res.status(200).json({
            status: "success",
            total_records: total,
            data: rows
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


exports.getBrandById = async (req, res) => {
    const { id } = req.params;

    try {
        const brand = await Brand.findById(id);
        if (!brand) return res.status(404).json({ message: "Brand non trouvée" });

        res.status(200).json({ status: "success", data: brand });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
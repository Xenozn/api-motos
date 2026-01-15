const db = require('../../config/db');

exports.getAllMotos = async (req, res) => {
    try {
        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [rows] = await db.query(
            'SELECT * FROM motos LIMIT ? OFFSET ?',
            [limit, offset]
        );

        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM motos');

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
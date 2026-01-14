const db = require('../../config/db');

exports.getAllMotos = async (req, res) => {
    try {
        // 1. Récupérer les paramètres ou mettre des valeurs par défaut
        // On utilise parseInt pour être sûr d'avoir des nombres
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // 2. Requête pour récupérer les données paginées
        const [rows] = await db.query(
            'SELECT * FROM motos LIMIT ? OFFSET ?',
            [limit, offset]
        );

        // 3. (Optionnel mais recommandé) Récupérer le nombre total pour le front-end
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
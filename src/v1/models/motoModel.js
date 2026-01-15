const db = require('../../config/db');

const Moto = {
    // Récupère une liste paginée
    findAllPaging: async (limit, offset) => {
        const [rows] = await db.query(
            'SELECT * FROM motos LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return rows;
    },

    // Récupère le nombre total de motos
    countAll: async () => {
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM motos');
        return total;
    },

    findById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM motos WHERE id = ?',
            [id]
        );
        return rows[0];
    },
};

module.exports = Moto;
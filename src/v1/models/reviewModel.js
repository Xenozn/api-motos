const db = require('../../config/db');

const Review = {
    findAllPaging: async ({ search, limit, offset }) => {
        let sql = "SELECT * FROM reviews WHERE 1=1";
        const params = [];
        // Si tu n'as plus de colonne 'name', on cherche souvent dans 'comment'
        if (search) {
            sql += " AND comment LIKE ?";
            params.push(`%${search}%`);
        }
        sql += " LIMIT ? OFFSET ?";
        params.push(limit, offset);
        const [rows] = await db.query(sql, params);
        return rows;
    },

    countAll: async ({ search }) => {
        let sql = "SELECT COUNT(*) as total FROM reviews WHERE 1=1";
        const params = [];
        if (search) {
            sql += " AND comment LIKE ?";
            params.push(`%${search}%`);
        }
        const [[{ total }]] = await db.query(sql, params);
        return total;
    },

    findById: async (id) => {
        const query = "SELECT * FROM reviews WHERE id = ?";
        const [rows] = await db.query(query, [id]);
        return rows.length ? rows[0] : null;
    },

    create: async ({ comment, id_user }) => {
        // Correction ici : 2 colonnes = 2 points d'interrogation
        const query = `
            INSERT INTO reviews (comment, id_user, created_at)
            VALUES (?, ?, NOW())
        `;
        const [result] = await db.query(query, [comment, id_user]);
        return result.insertId;
    },

    delete: async (id) => {
        const query = "DELETE FROM reviews WHERE id = ?";
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    },
    update: async (id, { comment }) => {
        const query = `
            UPDATE reviews 
            SET comment = ?, updated_at = NOW() 
            WHERE id = ?
        `;
        const [result] = await db.query(query, [comment, id]);
        return result.affectedRows > 0;
    }
};

module.exports = Review;
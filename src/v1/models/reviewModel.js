const db = require('../../config/db');

const Review = {

    findAllPaging: async ({ search, id_moto, id_user_filter, limit, offset }) => {
        let sql = `
            SELECT r.*, m.modele, m.cylindree, b.id AS id_brand, b.name AS brand_name
            FROM reviews r
                     LEFT JOIN motos m ON r.id_moto = m.id
                     LEFT JOIN brands b ON m.id_brand = b.id
            WHERE 1=1
        `;
        const params = [];

        // Filtre par Moto
        if (id_moto) {
            sql += " AND r.id_moto = ?";
            params.push(id_moto);
        }

        // NOUVEAU : Filtre par Utilisateur
        if (id_user_filter) {
            sql += " AND r.id_user = ?";
            params.push(id_user_filter);
        }

        if (search) {
            sql += " AND r.comment LIKE ?";
            params.push(`%${search}%`);
        }

        sql += " LIMIT ? OFFSET ?";
        params.push(limit, offset);

        const [rows] = await db.query(sql, params);
        return rows.map(row => ({
            id: row.id,
            comment: row.comment,
            id_user: row.id_user,
            created_at: row.created_at,
            moto: row.id_moto ? {
                id: row.id_moto,
                modele: row.modele,
                cylindree: row.cylindree,
                brand: { id: row.id_brand, name: row.brand_name }
            } : null
        }));
    },

    countAll: async ({ search, id_moto, id_user_filter }) => {
        let sql = "SELECT COUNT(*) as total FROM reviews WHERE 1=1";
        const params = [];

        if (id_moto) {
            sql += " AND id_moto = ?";
            params.push(id_moto);
        }

        if (id_user_filter) {
            sql += " AND id_user = ?";
            params.push(id_user_filter);
        }

        if (search) {
            sql += " AND comment LIKE ?";
            params.push(`%${search}%`);
        }

        const [[{ total }]] = await db.query(sql, params);
        return total;
    },

    findById: async (id) => {
        const query = `
            SELECT r.*, m.modele, m.cylindree, b.id AS id_brand, b.name AS brand_name
            FROM reviews r
            LEFT JOIN motos m ON r.id_moto = m.id
            LEFT JOIN brands b ON m.id_brand = b.id
            WHERE r.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        if (!rows.length) return null;

        const row = rows[0];
        return {
            id: row.id,
            comment: row.comment,
            id_user: row.id_user,
            moto: {
                id: row.id_moto,
                modele: row.modele,
                cylindree: row.cylindree,
                brand: { id: row.id_brand, name: row.brand_name }
            }
        };
    },

    create: async ({ comment, id_user, id_moto }) => {
        // Ajout de id_moto dans l'insert
        const query = `
            INSERT INTO reviews (comment, id_user, id_moto, created_at)
            VALUES (?, ?, ?, NOW())
        `;
        const [result] = await db.query(query, [comment, id_user, id_moto]);
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
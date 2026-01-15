const db = require('../../config/db');

const Brand = {
    findAllPaging: async ({ search, limit, offset }) => {
        let sql = "SELECT * FROM brands WHERE 1=1";
        const params = [];
        if (search) { sql += " AND name LIKE ?"; params.push(`%${search}%`); }
        sql += " LIMIT ? OFFSET ?";
        params.push(limit, offset);
        const [rows] = await db.query(sql, params);
        return rows;
    },
    countAll: async ({ search }) => {
        let sql = "SELECT COUNT(*) as total FROM brands WHERE 1=1";
        const params = [];
        if (search) { sql += " AND name LIKE ?"; params.push(`%${search}%`); }
        const [[{ total }]] = await db.query(sql, params);
        return total;
    },

    findById: async (id) => {
        const query = `
            SELECT *
            FROM brands
            WHERE id = ?
        `;
        const [rows] = await db.query(query, [id]);
        if (!rows.length) return null;

        return rows[0];
    },

};
module.exports = Brand;
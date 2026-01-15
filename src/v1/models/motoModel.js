const db = require('../../config/db');

// On utilise un Set pour les colonnes autorisées
const allowedSortColumns = new Set(['id', 'modele', 'cylindree', 'brand_name']);

const Moto = {
    findAllPaging: async ({ marque, minCylindree, maxCylindree, search, sortBy, order, limit, offset }) => {
        let sql = `
            SELECT m.id, m.modele, m.cylindree, b.id AS id_brand, b.name AS brand_name
            FROM motos m
                     LEFT JOIN brands b ON m.id_brand = b.id
            WHERE 1=1
        `;
        const params = [];

        if (marque) {
            sql += " AND b.name LIKE ?";
            params.push(`%${marque}%`);
        }
        if (minCylindree) {
            sql += " AND m.cylindree >= ?";
            params.push(minCylindree);
        }
        if (maxCylindree) {
            sql += " AND m.cylindree <= ?";
            params.push(maxCylindree);
        }
        if (search) {
            sql += " AND m.modele LIKE ?";
            params.push(`%${search}%`);
        }

        // Utilisation du Set pour vérifier l'existence
        const sortColumn = allowedSortColumns.has(sortBy) ? sortBy : 'm.id';
        const sortOrder = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        sql += ` ORDER BY ${sortColumn === 'brand_name' ? 'b.name' : sortColumn} ${sortOrder}`;

        sql += " LIMIT ? OFFSET ?";
        params.push(limit, offset);

        const [rows] = await db.query(sql, params);
        return rows.map(row => ({
            id: row.id,
            modele: row.modele,
            cylindree: row.cylindree,
            brand: { id: row.id_brand, name: row.brand_name }
        }));
    },

    countAll: async ({ marque, minCylindree, maxCylindree, search }) => {
        let sql = `
            SELECT COUNT(*) as total
            FROM motos m
                     LEFT JOIN brands b ON m.id_brand = b.id
            WHERE 1=1
        `;
        const params = [];

        if (marque) params.push(`%${marque}%`);
        if (minCylindree) params.push(minCylindree);
        if (maxCylindree) params.push(maxCylindree);
        if (search) params.push(`%${search}%`);

        if (marque) sql += " AND b.name LIKE ?";
        if (minCylindree) sql += " AND m.cylindree >= ?";
        if (maxCylindree) sql += " AND m.cylindree <= ?";
        if (search) sql += " AND m.modele LIKE ?";

        const [[{ total }]] = await db.query(sql, params);
        return total;
    },

    findById: async (id) => {
        const query = `
            SELECT m.id, m.modele, m.cylindree, b.id AS id_brand, b.name AS brand_name
            FROM motos m
            LEFT JOIN brands b ON m.id_brand = b.id
            WHERE m.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        if (!rows.length) return null;

        const row = rows[0];
        return {
            id: row.id,
            modele: row.modele,
            cylindree: row.cylindree,
            brand: { id: row.id_brand, name: row.brand_name }
        };
    },
};

module.exports = Moto;

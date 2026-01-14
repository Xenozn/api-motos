const db = require('../../config/db');

exports.getMe = async (req, res) => {
    try {
        // L'ID vient du middleware authMiddleware (req.userId)
        const [users] = await db.query(
            'SELECT id, email, nom, prenom, role, createdAt FROM users WHERE id = ?',
            [req.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({ status: "success", data: users[0] });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [users] = await db.query(
            'SELECT id, email, nom, prenom, role, createdAt FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({ status: "success", data: users[0] });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER ---
exports.register = async (req, res) => {
    const { email, password, nom, prenom } = req.body;

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Utilisateur déjà existant" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const forcedRole = 'user';

        const [result] = await db.query(
            'INSERT INTO users (email, password, nom, prenom, role) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, nom, prenom, forcedRole]
        );

        res.status(201).json({
            message: "Utilisateur créé !",
            user: {
                id: result.insertId,
                email,
                nom,
                prenom,
                role: forcedRole // On renvoie bien 'user'
            }
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// --- LOGIN ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        // On inclut le rôle dans le Token JWT pour pouvoir restreindre des accès plus tard
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret_par_defaut',
            { expiresIn: '1h' }
        );

        // On retire le password de l'objet renvoyé
        const { password: _, ...userWithoutPassword } = user;



        res.json({
            message: "Connecté !",
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
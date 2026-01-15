const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Token requis" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secret_par_defaut'
        );

        req.userId = decoded.id;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        console.error('JWT error details:', error);
        return res.status(401).json({
            message: "Token invalide",
        });
    }
};

module.exports = authMiddleware;

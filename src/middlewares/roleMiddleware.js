exports.isAdmin = (req, res, next) => {
    // req.userRole doit être injecté par ton authMiddleware
    if (req.userRole !== 'admin') {
        return res.status(403).json({
            message: "Accès interdit : privilèges administrateur requis"
        });
    }
    next();
};
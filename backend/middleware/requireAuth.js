const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    const authorization = req.get("authorization");
    const [scheme, token] = authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            mensaje: "Inicia sesión para realizar esta acción.",
        });
    }

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({
                mensaje: "La sesión expiró o no es válida. Inicia sesión nuevamente.",
            });
        }

        return next(error);
    }
};

module.exports = requireAuth;

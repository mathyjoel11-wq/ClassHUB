
const conexion = require("../config/db");

const iniciarSesion = async (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({
            mensaje: "El usuario y la contraseña son obligatorios",
        });
    }

    const consulta = `
        SELECT
            u.id_usuario,
            u.nombre,
            u.apellido,
            u.usuario,
            u.contrasena,
            u.activo,
            r.id_rol,
            r.nombre AS rol
        FROM public.usuarios u
        INNER JOIN public.roles r
            ON u.id_rol = r.id_rol
        WHERE u.usuario = $1
        LIMIT 1
    `;

    try {
        const resultado = await conexion.query(consulta, [usuario]);

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos",
            });
        }

        const usuarioEncontrado = resultado.rows[0];

        if (!usuarioEncontrado.activo) {
            return res.status(403).json({
                mensaje: "El usuario está desactivado",
            });
        }

        // Comparación temporal en texto plano.
        // Después migraremos la validación a bcrypt.
        if (contrasena !== usuarioEncontrado.contrasena) {
            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos",
            });
        }

        return res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            usuario: {
                id: usuarioEncontrado.id_usuario,
                nombre: usuarioEncontrado.nombre,
                apellido: usuarioEncontrado.apellido,
                usuario: usuarioEncontrado.usuario,
                rol: usuarioEncontrado.rol,
                idRol: usuarioEncontrado.id_rol,
            },
        });
    } catch (error) {
        console.error("Error al consultar el usuario:", error.message);

        return res.status(500).json({
            mensaje: "Ocurrió un error en el servidor",
        });
    }
};

module.exports = {
    iniciarSesion,
};

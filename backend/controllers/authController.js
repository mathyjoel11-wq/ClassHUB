//Codigo para conectar el login
const conexion = require("../config/db");

const iniciarSesion = (req, res) => {
    const {usuario, contrasena } = req.body;

//Verifica que el usuario haya completado ambos campos.

if(!usuario || !contrasena) {
    return res.status(400).json({
        mensaje: "El usuario y la contraseña son obligatorios",
    });
}

//Consulta a la base de datos los datos del usuario

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
FROM usuarios u
INNER JOIN roles r ON u.id_rol = r.id_rol
WHERE u.usuario = ?
LIMIT 1
`;

conexion.query(consulta, [usuario], (error, resultados) => {
    if (error) {
        console.error("Error al consultar el usuario:", error);

        return res.status(500).json({
            mensaje: "Ocurrio un error en el servidor",
        });
    }
    if(resultados.length === 0) {
        return res.status(401).json({
            mensaje: "Usuario o contraseña incorrectos",
        });
    }

    const usuarioencontrado = resultados[0];

    if(!usuarioencontrado.activo) {
        return res.status(403).json({
            mensaje: "El usuario esta desactivado",
        });
    }

    //Comparacion temporal en texto plano
    //Mas adelante reemplazare por bycypt para mas seguridad

    if(contrasena !== usuarioencontrado.contrasena) {
        return res.status(401).json({
            mensaje: "Usuario o contrasena incorrectos",
        });
    }

    return res.status(200).json({
        mensaje: "Inicio de sesión exitoso",
        usuario: {
            id: usuarioencontrado.id_usuario,
            nombre: usuarioencontrado.nombre,
            apellido: usuarioencontrado.apellido,
            usuario: usuarioencontrado.usuario,
            rol: usuarioencontrado.rol,
            idRol: usuarioencontrado.id_rol,
            },
        });
    });
};

    module.exports = {
    iniciarSesion,
};
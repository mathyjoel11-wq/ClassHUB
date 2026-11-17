const conexion = require("../config/db");

const crearSolicitud = async (req, res) => {
    const {
        carrera,
        cantidad_alumnos,
        fecha,
        hora_inicio,
        hora_fin,
        materia,
    } = req.body;

    // 1. Validar los datos recibidos
    if (
        !carrera?.trim() ||
        !materia?.trim() ||
        !cantidad_alumnos ||
        !fecha ||
        !hora_inicio ||
        !hora_fin
    ) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios.",
        });
    }

    if (
        !Number.isInteger(Number(cantidad_alumnos)) ||
        Number(cantidad_alumnos) <= 0
    ) {
        return res.status(400).json({
            mensaje: "La cantidad de alumnos debe ser un número positivo.",
        });
    }

    if (hora_fin <= hora_inicio) {
        return res.status(400).json({
            mensaje: "La hora de finalización debe ser posterior a la hora de inicio.",
        });
    }

    // 2. Obtener el ID del profesor desde el token
    const idUsuario = req.usuario.id;

    try {
        // 3. Registrar la solicitud
        const resultado = await conexion.query(
            `INSERT INTO public.solicitudes
            (id_usuario, carrera, cantidad_alumnos, fecha,
             hora_inicio, hora_fin, materia)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id_solicitud`,
            [
                idUsuario,
                carrera.trim(),
                Number(cantidad_alumnos),
                fecha,
                hora_inicio,
                hora_fin,
                materia.trim(),
            ]
        );

        const idSolicitud = resultado.rows[0].id_solicitud;

        // 4. Crear notificación para coordinación
        await conexion.query(
            `INSERT INTO public.notificaciones
            (titulo, mensaje, tipo, leido)
            VALUES ($1, $2, $3, $4)`,
            [
                "Nueva solicitud de aula",
                `Un profesor ha enviado una solicitud de aula. Solicitud #${idSolicitud}.`,
                "solicitud_aula",
                false,
            ]
        );

        return res.status(201).json({
            mensaje: "Solicitud enviada correctamente.",
            id_solicitud: idSolicitud,
        });

    } catch (error) {
        console.error("Error al crear la solicitud:", error.message);

        return res.status(500).json({
            mensaje: "No se pudo enviar la solicitud.",
        });
    }
};

module.exports = {
    crearSolicitud,
};
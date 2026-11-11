const conexion = require("../config/db");

const obtenerReportes = async (_req, res) => {
    try {
        const resultado = await conexion.query(
            `SELECT titulo, mensaje, leido, creado_en
             FROM public.notificaciones
             WHERE tipo = $1
             ORDER BY creado_en DESC
             LIMIT 50`,
            ["reporte_falla"]
        );

        return res.status(200).json({ reportes: resultado.rows });
    } catch (error) {
        console.error("Error al consultar los reportes:", error.message);
        return res.status(500).json({
            mensaje: "No se pudieron cargar los reportes.",
        });
    }
};

const marcarReportesLeidos = async (_req, res) => {
    try {
        await conexion.query(
            `UPDATE public.notificaciones
             SET leido = true
             WHERE tipo = $1 AND leido = false`,
            ["reporte_falla"]
        );

        return res.status(200).json({
            mensaje: "Notificaciones marcadas como leídas.",
        });
    } catch (error) {
        console.error("Error al marcar reportes como leídos:", error.message);
        return res.status(500).json({
            mensaje: "No se pudieron actualizar las notificaciones.",
        });
    }
};

const crearReporte = async (req, res) => {
    const { titulo, mensaje } = req.body;

    if (
        typeof titulo !== "string" ||
        typeof mensaje !== "string" ||
        !titulo.trim() ||
        !mensaje.trim()
    ) {
        return res.status(400).json({
            mensaje: "El título y la descripción son obligatorios.",
        });
    }

    if (titulo.trim().length > 150 || mensaje.trim().length > 5000) {
        return res.status(400).json({
            mensaje: "El título admite hasta 150 caracteres y la descripción hasta 5000.",
        });
    }

    try {
        await conexion.query(
            `INSERT INTO public.notificaciones (titulo, mensaje, tipo, leido)
             VALUES ($1, $2, $3, $4)`,
            [`Reporte: ${titulo.trim()}`, mensaje.trim(), "reporte_falla", false]
        );

        return res.status(201).json({
            mensaje: "Reporte enviado correctamente.",
        });
    } catch (error) {
        console.error("Error al guardar el reporte:", error.message);
        return res.status(500).json({
            mensaje: "No se pudo guardar el reporte. Verifica la tabla y los permisos de la base de datos.",
        });
    }
};

module.exports = { crearReporte, obtenerReportes, marcarReportesLeidos };

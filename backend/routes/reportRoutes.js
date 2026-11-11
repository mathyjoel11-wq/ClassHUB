const express = require("express");
const {
    crearReporte,
    obtenerReportes,
    marcarReportesLeidos,
} = require("../controllers/reportController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/fallas", requireAuth, obtenerReportes);
router.post("/fallas", requireAuth, crearReporte);
router.patch("/fallas/leidas", requireAuth, marcarReportesLeidos);

module.exports = router;

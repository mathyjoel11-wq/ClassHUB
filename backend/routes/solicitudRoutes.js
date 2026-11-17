const express = require('express');

const {
    crearSolicitud,
} = require('../controllers/solicitudController');

const requireAuth = require('../middleware/requireAuth');

const  router = express.Router();

// Ruta para crear una nueva solicitud
router.post('/', requireAuth, crearSolicitud);

module.exports = router;
//Hace la validacion o comprobacion de auth controller

const express = require("express");
const {iniciarSesion } = require("../controllers/authController");

const router = express.Router();

//POST http://localhost:3000/api/auth/login
router.post("/login", iniciarSesion);

module.exports = router;
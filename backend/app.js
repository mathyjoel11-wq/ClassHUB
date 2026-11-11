//Maneja toda la pagina

const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

//Permite recibir solicitudes desde el frontend
app.use (cors());

//Permite que express lea datos enviados en formato json
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("🚀 Backend de ClassHub funcionando XD");
});

//Rutas del modulo de autenticacion
app.use("/api/auth", authRoutes);
app.use("/api/reportes", reportRoutes);

const PORT = 3000;

if (!process.env.JWT_SECRET) {
  throw new Error("Falta configurar JWT_SECRET en backend/.env.");
}

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
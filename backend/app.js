//Maneja toda la pagina

const express = require("express");
const cors = require("cors");

require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

//Permite recibir solicitudes desde el frontend
app.use (cors());

//Permite que express lea datos enviados en formato json
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Backend de ClassHub funcionando XD");
});

//Rutas del modulo de autenticacion
app.use("/api/auth", authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
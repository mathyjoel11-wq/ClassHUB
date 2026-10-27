
require("dotenv").config();
const { Pool } = require("pg");

const conexion = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

conexion.on("connect", () => {
    console.log("Conexión con PostgreSQL establecida");
});

conexion.on("error", (error) => {
    console.error("Error en la conexión con PostgreSQL:", error.message);
});

module.exports = conexion;

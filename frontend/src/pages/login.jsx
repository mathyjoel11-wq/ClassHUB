
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "./login.css";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const iniciarSesion = async (evento) => {
    evento.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          usuario,
          contrasena,
        }
      );

      const usuarioAutenticado = respuesta.data.usuario;

      if (!usuarioAutenticado) {
        setMensaje("El servidor no devolvió los datos del usuario.");
        return;
      }

      // Guardamos los datos del usuario autenticado.
      localStorage.setItem(
        "usuarioClassHub",
        JSON.stringify(usuarioAutenticado)
      );

      console.log("Usuario autenticado:", usuarioAutenticado);

      // Normalizamos el rol para evitar problemas con mayúsculas.
      const rol = usuarioAutenticado.rol?.trim().toLowerCase();

      // Redirección según el rol recibido desde Supabase.
      if (rol === "admin" || rol === "administrador") {
        navigate("/dashboard/admin");
      } else if (rol === "profesor") {
        navigate("/dashboard/profesor");
      } else if (rol === "alumno") {
        navigate("/dashboard/alumno");
      } else {
        localStorage.removeItem("usuarioClassHub");
        setMensaje(
          `El usuario no tiene un rol válido. Rol recibido: ${
            usuarioAutenticado.rol ?? "ninguno"
          }`
        );
      }
    } catch (error) {
      console.error(
        "Error al iniciar sesión:",
        error.response?.data || error.message
      );

      const mensajeError =
        error.response?.data?.mensaje ||
        "No se pudo conectar con el servidor.";

      setMensaje(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <span className="login-logo">CH</span>

          <div>
            <h1>ClassHub</h1>
            <p>Gestión inteligente de aulas universitarias</p>
          </div>
        </div>

        <div className="login-heading">
          <h2>Bienvenido</h2>
          <p>Ingresá tus credenciales para continuar</p>
        </div>

        <form onSubmit={iniciarSesion}>
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>

            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(evento) => setUsuario(evento.target.value)}
              placeholder="Ej.: admin"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>

            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
              placeholder="Ingresá tu contraseña"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        {mensaje && (
          <p className="login-message" role="alert">
            {mensaje}
          </p>
        )}

        <p className="login-footer">
          Acceso exclusivo para usuarios autorizados
        </p>
      </section>
    </main>
  );
}

export default Login;

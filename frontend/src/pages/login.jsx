import { useState } from "react";
import axios from "axios";
import "./login.css";

function Login() {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const iniciarSesion = async (evento) => {
        evento.preventDefault();
        setMensaje("");
        setCargando(true);

        try{
            const respuesta = await axios.post(
                "http://localhost:3000/api/auth/login",
                {
                    usuario,
                    contrasena,
                }
            );

            setMensaje(respuesta.data.mensaje);

            //Guardamos temporalmente los del usuario

            localStorage.setItem(
                "usuarioClasshub",
                JSON.stringify(respuesta.data.usuario)
            );

        console.log("Usuario Autenticado:", respuesta.data.usuario);
        } catch (error) {
            const mensajeError = 
            error.response?.data?.mensaje ||
            "No se pudo conectar con el servidor";

            setMensaje(mensajeError);
        } finally { 
            setCargando(false);
        }
    };

    return (
        <main className="Login-page">
            <section className= "login-card">
                <div className="login-brand">
                    <span className="login-logo">CH</span>

                    <div>
                        <h1>ClassHub</h1>
                        <p>Gestion inteligente de aulas universitarias</p>
                    </div>
                </div>

                <div className="login-heading">
                    <h2>Bienvenido</h2>
                    <p>Ingresa tus credenciales para continuar</p>
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
                        placeholder="Ingresa tu contraseña"
                        autoComplete="current-password"
                        required
                        />
                    </div>

                    <button type="submit" disabled={cargando}>
                        {cargando ? "Ingresando..." : "Iniciar sesion"}
                        </button>
                    </form>

                    {mensaje && <p className="login-message">{mensaje}</p>}

                    <p className="login-footer">
                        Acceso exclusivo para usuarios autorizados
                    </p>
                </section>
            </main>
    );
}

export default Login;

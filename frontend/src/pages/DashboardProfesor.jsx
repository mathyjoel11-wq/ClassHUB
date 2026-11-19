import { useState } from "react";
import { useNavigate } from "react-router";
import "./style-dashboard.css";

const formularioInicial = {
  carrera: "",
  materia: "",
  cantidad_alumnos: "",
  fecha: "",
  hora_inicio: "",
  hora_fin: "",
};

function DashboardProfesor() {
  const navigate = useNavigate();
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [modalSolicitudAbierto, setModalSolicitudAbierto] = useState(false);
  const [tituloFalla, setTituloFalla] = useState("");
  const [mensajeFalla, setMensajeFalla] = useState("");
  const [solicitud, setSolicitud] = useState(formularioInicial);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem("usuarioClassHub"));
    } catch {
      return null;
    }
  })();
  const nombre = [usuario?.nombre, usuario?.apellido].filter(Boolean).join(" ") || "Profesor";

  const enviarReporte = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setError("");
    try {
      const token = localStorage.getItem("tokenClassHub");
      if (!token) throw new Error("Tu sesión no está activa. Inicia sesión nuevamente.");
      const respuesta = await fetch("http://localhost:3000/api/reportes/fallas", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ titulo: tituloFalla.trim(), mensaje: mensajeFalla.trim() }),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.mensaje || "No se pudo enviar el reporte.");
      setTituloFalla("");
      setMensajeFalla("");
      setModalReporteAbierto(false);
      alert(resultado.mensaje);
    } catch (fallo) {
      setError(fallo.message || "Revisa la conexión y vuelve a intentarlo.");
    } finally {
      setEnviando(false);
    }
  };

  const enviarSolicitud = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setError("");
    try {
      const token = localStorage.getItem("tokenClassHub");
      if (!token) throw new Error("Tu sesión no está activa. Inicia sesión nuevamente.");
      const respuesta = await fetch("http://localhost:3000/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...solicitud, cantidad_alumnos: Number(solicitud.cantidad_alumnos) }),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.mensaje || "No se pudo enviar la solicitud.");
      setSolicitud(formularioInicial);
      setModalSolicitudAbierto(false);
      alert(resultado.mensaje);
    } catch (fallo) {
      setError(fallo.message || "Revisa la conexión y vuelve a intentarlo.");
    } finally {
      setEnviando(false);
    }
  };

  const cerrarModal = () => {
    setModalReporteAbierto(false);
    setModalSolicitudAbierto(false);
    setError("");
  };

  return (
    <div className="admin-dashboard profesor-dashboard">
      <header className="header">
        <div className="logo-box"><span className="brand-tag">ch</span></div>
        <div className="header-right">
          <div className="user-menu">
            <div className="user-pill">
              <span className="avatar-icon" aria-hidden="true">●</span>
              <span>{usuario?.rol || "Profesor"}</span>
              <span className="arrow-icon" aria-hidden="true">⌄</span>
            </div>
          </div>
        </div>
      </header>

      <button className="menu-toggle-btn" type="button" title="Menú" aria-label="Menú">
        <span>❯❯❯</span>
      </button>

      <main className="dashboard-container">
        <section className="welcome-section">
          <h1 className="welcome-title">Bienvenido</h1>
          <h2 className="user-name">{nombre}</h2>
        </section>

        <div className="search-bar-container">
          <label className="search-pill">
            <input type="text" placeholder="¿Qué necesita hacer hoy?" aria-label="Búsqueda rápida" />
            <button className="send-btn" type="button" aria-label="Buscar">
              <svg className="send-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </label>
        </div>

        <section className="quick-actions-section">
          <p className="section-label">Acciones rápidas</p>
          <div className="actions-grid">
            <button className="action-card" type="button" onClick={() => navigate("/mapa")}>
              <span aria-hidden="true">▦</span><span>Mapa de Aulas</span>
            </button>
            <button className="action-card" type="button" onClick={() => { setError(""); setModalSolicitudAbierto(true); }}>
              <span aria-hidden="true">＋</span><span>Crear Solicitud de Reservación</span>
            </button>
            <button className="action-card" type="button" onClick={() => { setError(""); setModalReporteAbierto(true); }}>
              <span aria-hidden="true">⚠</span><span>Crear Reporte</span>
            </button>
          </div>
        </section>
      </main>

      {(modalReporteAbierto || modalSolicitudAbierto) && (
        <div className="profesor-modal-overlay" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) cerrarModal(); }}>
          <section className="profesor-modal-content" role="dialog" aria-modal="true" aria-labelledby="profesor-modal-title">
            <h3 id="profesor-modal-title">{modalSolicitudAbierto ? "Crear solicitud de reservación" : "Crear reporte de falla"}</h3>
            <form onSubmit={modalSolicitudAbierto ? enviarSolicitud : enviarReporte}>
              {modalSolicitudAbierto ? (
                <>
                  <div className="profesor-form-group"><label htmlFor="carrera">Carrera</label><input id="carrera" value={solicitud.carrera} onChange={(e) => setSolicitud({ ...solicitud, carrera: e.target.value })} required /></div>
                  <div className="profesor-form-group"><label htmlFor="materia">Materia</label><input id="materia" value={solicitud.materia} onChange={(e) => setSolicitud({ ...solicitud, materia: e.target.value })} required /></div>
                  <div className="profesor-form-row">
                    <div className="profesor-form-group"><label htmlFor="cantidad-alumnos">Cantidad de alumnos</label><input id="cantidad-alumnos" type="number" min="1" value={solicitud.cantidad_alumnos} onChange={(e) => setSolicitud({ ...solicitud, cantidad_alumnos: e.target.value })} required /></div>
                    <div className="profesor-form-group"><label htmlFor="fecha-reserva">Fecha</label><input id="fecha-reserva" type="date" value={solicitud.fecha} onChange={(e) => setSolicitud({ ...solicitud, fecha: e.target.value })} required /></div>
                  </div>
                  <div className="profesor-form-row">
                    <div className="profesor-form-group"><label htmlFor="hora-inicio">Hora de inicio</label><input id="hora-inicio" type="time" value={solicitud.hora_inicio} onChange={(e) => setSolicitud({ ...solicitud, hora_inicio: e.target.value })} required /></div>
                    <div className="profesor-form-group"><label htmlFor="hora-fin">Hora de fin</label><input id="hora-fin" type="time" value={solicitud.hora_fin} onChange={(e) => setSolicitud({ ...solicitud, hora_fin: e.target.value })} required /></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="profesor-form-group"><label htmlFor="titulo-falla">Título del problema</label><input id="titulo-falla" value={tituloFalla} onChange={(e) => setTituloFalla(e.target.value)} placeholder="Ej. Proyector roto en aula 101" required /></div>
                  <div className="profesor-form-group"><label htmlFor="mensaje-falla">Descripción</label><textarea id="mensaje-falla" value={mensajeFalla} onChange={(e) => setMensajeFalla(e.target.value)} rows="4" placeholder="Describe qué ocurrió y los detalles relevantes..." required /></div>
                </>
              )}
              {error && <p className="profesor-form-error" role="alert">{error}</p>}
              <div className="profesor-modal-actions">
                <button type="button" onClick={cerrarModal} disabled={enviando}>Cancelar</button>
                <button type="submit" disabled={enviando}>{enviando ? "Enviando..." : modalSolicitudAbierto ? "Enviar solicitud" : "Enviar reporte"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default DashboardProfesor;

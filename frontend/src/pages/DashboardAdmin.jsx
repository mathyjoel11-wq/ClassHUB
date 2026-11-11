import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import "./style-dashboard.css";

function DashboardAdmin() {
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [panelNotificacionesAbierto, setPanelNotificacionesAbierto] = useState(false);
  const [tituloFalla, setTituloFalla] = useState("");
  const [mensajeFalla, setMensajeFalla] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorReporte, setErrorReporte] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargandoNotificaciones, setCargandoNotificaciones] = useState(false);
  const [errorNotificaciones, setErrorNotificaciones] = useState("");
  const [noLeidas, setNoLeidas] = useState(0);

  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem("usuarioClassHub"));
    } catch {
      return null;
    }
  })();

  const nombreGuardado = [usuario?.nombre, usuario?.apellido].filter(Boolean).join(" ");
  const nombre = nombreGuardado === "Administrador Sistema" ? "Administrador" : nombreGuardado || "Administrador";

  const cargarReportes = useCallback(async () => {
    const token = localStorage.getItem("tokenClassHub");
    if (!token) {
      throw new Error("Tu sesión no está activa. Inicia sesión nuevamente.");
    }

    const respuesta = await fetch("http://localhost:3000/api/reportes/fallas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const resultado = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || "No se pudieron cargar las notificaciones.");
    }

    return resultado.reportes;
  }, []);

  useEffect(() => {
    let activo = true;
    const actualizarNotificaciones = async () => {
      try {
        const reportes = await cargarReportes();
        if (activo) {
          setNotificaciones(reportes);
          setNoLeidas(reportes.filter((reporte) => !reporte.leido).length);
          setErrorNotificaciones("");
        }
      } catch (error) {
        if (activo) {
          console.error("Error al cargar las notificaciones:", error);
          setErrorNotificaciones(error.message);
        }
      }
    };

    actualizarNotificaciones();
    const intervalo = window.setInterval(actualizarNotificaciones, 15000);

    return () => {
      activo = false;
      window.clearInterval(intervalo);
    };
  }, [cargarReportes]);

  const handleToggleNotificaciones = async () => {
    const abrir = !panelNotificacionesAbierto;
    setPanelNotificacionesAbierto(abrir);
    if (!abrir) return;

    setCargandoNotificaciones(true);
    setErrorNotificaciones("");
    try {
      const reportes = await cargarReportes();
      setNotificaciones(reportes);
      setNoLeidas(reportes.filter((reporte) => !reporte.leido).length);

      const token = localStorage.getItem("tokenClassHub");
      const respuesta = await fetch("http://localhost:3000/api/reportes/fallas/leidas", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "No se pudieron marcar como leídas.");
      }

      setNotificaciones((anteriores) =>
        anteriores.map((reporte) => ({ ...reporte, leido: true }))
      );
      setNoLeidas(0);
    } catch (error) {
      console.error("Error al abrir las notificaciones:", error);
      setErrorNotificaciones(error.message);
    } finally {
      setCargandoNotificaciones(false);
    }
  };

  const handleEnviarReporte = async (e) => {
    e.preventDefault();
    if (!tituloFalla.trim() || !mensajeFalla.trim()) return;

    setEnviando(true);
    setErrorReporte("");
    try {
      const token = localStorage.getItem("tokenClassHub");
      if (!token) {
        throw new Error("Tu sesión no está activa. Cierra sesión e inicia nuevamente.");
      }

      const respuesta = await fetch("http://localhost:3000/api/reportes/fallas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: tituloFalla.trim(),
          mensaje: mensajeFalla.trim(),
        }),
      });

      const resultado = await respuesta.json();
      if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "No se pudo enviar el reporte.");
      }

      setTituloFalla("");
      setMensajeFalla("");
      setModalAbierto(false);
      cargarReportes()
        .then((reportes) => {
          setNotificaciones(reportes);
          setNoLeidas(reportes.filter((reporte) => !reporte.leido).length);
        })
        .catch((error) => {
          console.error("El reporte se envió, pero no se pudo actualizar la lista:", error);
          setErrorNotificaciones(error.message);
        });
      alert(resultado.mensaje);
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      const detalle =
        error && typeof error === "object" && "message" in error &&
        typeof error.message === "string"
          ? error.message
          : error instanceof Error
            ? error.message
            : "Revisa la conexión y vuelve a intentarlo.";
      setErrorReporte(`No se pudo enviar el reporte: ${detalle}`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="header">
        <div className="logo-box"><span className="brand-tag">ch</span></div>

        <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div className="notif-wrapper">
            <button
              className="notif-indicator"
              type="button"
              title="Notificaciones de reportes"
              aria-label={`Notificaciones de reportes${noLeidas ? `, ${noLeidas} sin leer` : ""}`}
              aria-expanded={panelNotificacionesAbierto}
              onClick={handleToggleNotificaciones}
            >
              <span aria-hidden="true">🔔</span>
              {noLeidas > 0 && <span className="notif-badge">{noLeidas}</span>}
            </button>
            {panelNotificacionesAbierto && (
              <section className="notif-panel" aria-label="Notificaciones de reportes">
                <header className="notif-panel-header">
                  <h2>Reportes de fallas</h2>
                  <button
                    type="button"
                    className="notif-close"
                    aria-label="Cerrar notificaciones"
                    onClick={() => setPanelNotificacionesAbierto(false)}
                  >
                    ×
                  </button>
                </header>
                {cargandoNotificaciones ? (
                  <p className="notif-state">Cargando reportes...</p>
                ) : errorNotificaciones ? (
                  <p className="notif-state notif-error" role="alert">{errorNotificaciones}</p>
                ) : notificaciones.length === 0 ? (
                  <p className="notif-state">Todavía no hay reportes de fallas.</p>
                ) : (
                  <ul className="notif-list">
                    {notificaciones.map((reporte, index) => (
                      <li className="notif-item" key={`${reporte.creado_en}-${index}`}>
                        <strong>{reporte.titulo}</strong>
                        <p>{reporte.mensaje}</p>
                        {reporte.creado_en && (
                          <time dateTime={reporte.creado_en}>
                            {new Date(reporte.creado_en).toLocaleString("es-AR")}
                          </time>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>

          <div className="user-menu">
            <div className="user-pill">
              <span className="avatar-icon" aria-hidden="true">●</span>
              <span>{usuario?.rol === "Administrador Sistema" ? "Administrador" : usuario?.rol || "Administrador"}</span>
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
            <button
              className="action-card"
              type="button"
              onClick={() => navigate("/mapa")}
            >
              <span aria-hidden="true">▦</span>
              <span>Mapa de Aulas</span>
            </button>
            <button className="action-card" type="button"><span aria-hidden="true">▤</span><span>Buzón de Solicitudes</span></button>
            <button
              className="action-card"
              type="button"
              onClick={() => setModalAbierto(true)}
            >
              <span aria-hidden="true">⚠</span>
              <span>Reportes de Fallas</span>
            </button>
          </div>
        </section>
      </main>

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reportar una Falla</h3>
            <form onSubmit={handleEnviarReporte}>
              <div className="form-group">
                <label>Título del problema</label>
                <input
                  type="text"
                  value={tituloFalla}
                  onChange={(e) => setTituloFalla(e.target.value)}
                  placeholder="Ej. Proyector roto en aula 101"
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción detallada</label>
                <textarea
                  value={mensajeFalla}
                  onChange={(e) => setMensajeFalla(e.target.value)}
                  placeholder="Describe qué ocurrió y los detalles relevantes..."
                  rows="4"
                  required
                />
              </div>
              {errorReporte && (
                <p role="alert" style={{ color: "#b42318", margin: "12px 0" }}>
                  {errorReporte}
                </p>
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setModalAbierto(false);
                    setErrorReporte("");
                  }}
                  className="btn-cancelar"
                  disabled={enviando}
                >
                  Cancelar
                </button>
                <button type="submit" disabled={enviando} className="btn-enviar">
                  {enviando ? "Enviando..." : "Enviar Reporte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardAdmin;
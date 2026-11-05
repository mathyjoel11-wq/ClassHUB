import { useNavigate } from "react-router";
import "./style-dashboard.css";

function DashboardAdmin() {
  const navigate = useNavigate();
  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem("usuarioClassHub"));
    } catch {
      return null;
    }
  })();

  const nombreGuardado = [usuario?.nombre, usuario?.apellido].filter(Boolean).join(" ");
  const nombre = nombreGuardado === "Administrador Sistema" ? "Administrador" : nombreGuardado || "Administrador";

  return (
    <div className="admin-dashboard">
      <header className="header">
        <div className="logo-box"><span className="brand-tag">ch</span></div>
        <div className="user-menu">
          <div className="user-pill">
            <span className="avatar-icon" aria-hidden="true">●</span>
            <span>{usuario?.rol === "Administrador Sistema" ? "Administrador" : usuario?.rol || "Administrador"}</span>
            <span className="arrow-icon" aria-hidden="true">⌄</span>
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
            {/* Botón conectado para ir al Mapa de Aulas */}
            <button 
              className="action-card" 
              type="button" 
              onClick={() => navigate("/mapa")}
            >
              <span aria-hidden="true">▦</span>
              <span>Mapa de Aulas</span>
            </button>
            <button className="action-card" type="button"><span aria-hidden="true">▤</span><span>Buzón de Solicitudes</span></button>
            <button className="action-card" type="button"><span aria-hidden="true">⚠</span><span>Reportes de Fallas</span></button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardAdmin;
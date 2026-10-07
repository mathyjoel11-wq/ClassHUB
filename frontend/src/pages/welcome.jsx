import { useNavigate } from "react-router";
import "./welcome.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <main className="welcome-page">
      <h1 className="welcome-title">BIENVENIDO</h1>

      <div className="welcome-grid">
        <button 
          className="welcome-card" 
          onClick={() => navigate("/login")}
        >
          ClassHUB
        </button>

        <button 
          className="welcome-card" 
          onClick={() => navigate("/pasantia")}
        >
          Pasantia
        </button>
      </div>
    </main>
  );
}

export default Welcome;
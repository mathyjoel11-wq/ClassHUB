import { useState } from "react";
import { useNavigate } from "react-router";
import "./MapaAulas.css";

function MapaAulas() {
  const navigate = useNavigate();

  // Estado inicial de prueba de las aulas (true = Ocupado / Rojo, false = Libre / Blanco)
  const [aulasOcupadas, setAulasOcupadas] = useState({
    1: false,
    3: true,
    4: false,
    8: true,
    16: false,
    25: true,
    28: false,
    29: false,
    30: true,
    35: true,
    38: false,
  });

  const toggleEstadoAula = (numeroAula) => {
    setAulasOcupadas((prev) => ({
      ...prev,
      [numeroAula]: !prev[numeroAula],
    }));
  };

  // Posicionamiento de las aulas en porcentaje (ajustable según tu plano)
  const aulas = [
    { id: 1, top: "82%", left: "22%", width: "22%", height: "15%" },
    { id: 2, top: "71%", left: "19%", width: "5%", height: "9%" },
    { id: 3, top: "70%", left: "24%", width: "13%", height: "10%" },
    { id: 4, top: "61%", left: "16%", width: "24%", height: "9%" },
    { id: 7, top: "54%", left: "12%", width: "10%", height: "9%" },
    { id: 8, top: "52%", left: "22%", width: "18%", height: "10%" },
    { id: 11, top: "47%", left: "40%", width: "9%", height: "9%" },
    { id: 16, top: "33%", left: "34%", width: "12%", height: "11%" },
    { id: 25, top: "18%", left: "14%", width: "42%", height: "9%" },
    { id: 28, top: "3%", left: "22%", width: "11%", height: "11%" },
    { id: 29, top: "4%", left: "33%", width: "29%", height: "10%" },
    { id: 30, top: "5%", left: "64%", width: "25%", height: "10%" },
    { id: 35, top: "27%", left: "73%", width: "18%", height: "32%" },
    { id: 36, top: "63%", left: "74%", width: "17%", height: "16%" },
    { id: 38, top: "28%", left: "47%", width: "22%", height: "55%" },
  ];

  return (
    <div className="mapa-page">
      <header className="mapa-header">
        <button className="btn-volver" onClick={() => navigate("/dashboard/admin")}>
          ← Volver al Dashboard
        </button>
        <h1>Mapa Interactivo de Aulas</h1>
        <div className="leyenda">
          <span className="item-leyenda libre"><i className="box"></i> Libre</span>
          <span className="item-leyenda ocupado"><i className="box"></i> Ocupado</span>
        </div>
      </header>

      <main className="mapa-content">
        <div className="mapa-container">
          <img src="/mapa.jpg" alt="Plano de Aulas" className="mapa-imagen" />

          {aulas.map((aula) => {
            const estaOcupada = aulasOcupadas[aula.id];
            return (
              <button
                key={aula.id}
                type="button"
                className={`aula-hotspot ${estaOcupada ? "ocupada" : "libre"}`}
                style={{
                  top: aula.top,
                  left: aula.left,
                  width: aula.width,
                  height: aula.height,
                }}
                onClick={() => toggleEstadoAula(aula.id)}
                title={`Aula ${aula.id}: ${estaOcupada ? "Ocupada" : "Libre"}`}
              >
                {aula.id}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default MapaAulas;
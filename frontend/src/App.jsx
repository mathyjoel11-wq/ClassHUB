import { Navigate, Route, Routes } from "react-router";
import Welcome from "./pages/welcome";
import Login from "./pages/login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardProfesor from "./pages/DashboardProfesor";
import DashboardAlumno from "./pages/DashboardAlumno";
import MapaAulas from "./pages/MapaAulas"; // <-- Importado

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      <Route path="/dashboard/profesor" element={<DashboardProfesor />} />
      <Route path="/dashboard/alumno" element={<DashboardAlumno />} />

      {/* Ruta del Mapa Interactivo */}
      <Route path="/mapa" element={<MapaAulas />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
import { Navigate, Route, Routes } from "react-router";
import Welcome from "./pages/welcome";
import Login from "./pages/login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardProfesor from "./pages/DashboardProfesor";
import DashboardAlumno from "./pages/DashboardAlumno";

function App() {
  return (
    <Routes>
      {/* 1. Ruta raíz: Ahora muestra el menú de bienvenida */}
      <Route path="/" element={<Welcome />} />

      {/* 2. Ruta de Login para ClassHUB */}
      <Route path="/login" element={<Login />} />

      {/* 3. Dashboards existentes */}
      <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      <Route path="/dashboard/profesor" element={<DashboardProfesor />} />
      <Route path="/dashboard/alumno" element={<DashboardAlumno />} />

      {/* Si quieres definir la ruta de Pasantía más adelante */}
      {/* <Route path="/pasantia" element={<PasantiaPage />} /> */}

      {/* Redirección por defecto si no coincide ninguna ruta */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
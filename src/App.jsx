import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";

// Páginas
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { WorkoutDetails } from "./pages/WorkoutDetails";
import { RunWorkout } from "./pages/RunWorkout";
import { History } from "./pages/History"; // <--- Nova
import { Stats } from "./pages/Stats"; // <--- Nova

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/workout/:id"
            element={
              <PrivateRoute>
                <WorkoutDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/run/:id"
            element={
              <PrivateRoute>
                <RunWorkout />
              </PrivateRoute>
            }
          />

          <Route
            path="/history"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />

          <Route
            path="/stats"
            element={
              <PrivateRoute>
                <Stats />
              </PrivateRoute>
            }
          />

          {/* Redirecionamento padrão */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

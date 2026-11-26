import { Navigate, Route, Routes } from 'react-router-dom';
import { useSessao } from './context/SessaoContext.jsx';
import Login from './pages/Login.jsx';
import Principal from './pages/Principal.jsx';
import Pix from './pages/Pix.jsx';
import Pago from './pages/Pago.jsx';
import Administrador from './pages/admin/Administrador.jsx';

function RotaPrivada({ children }) {
  const { token } = useSessao();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { token } = useSessao();
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/principal" replace /> : <Login />} />
      <Route path="/principal" element={<RotaPrivada><Principal /></RotaPrivada>} />
      <Route path="/pix" element={<RotaPrivada><Pix /></RotaPrivada>} />
      <Route path="/pago" element={<RotaPrivada><Pago /></RotaPrivada>} />
      <Route path="/administrador" element={<Administrador />} />
      <Route path="*" element={<Navigate to={token ? '/principal' : '/login'} replace />} />
    </Routes>
  );
}

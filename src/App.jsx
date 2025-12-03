import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalogo from './pages/Catalogo';
import AdminPanel from './pages/AdminPanel';
import AutoDetallePage from './pages/AutoDetallePage';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/auto/:id" element={<AutoDetallePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;


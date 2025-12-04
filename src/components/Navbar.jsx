import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (sectionId) => {
    setMenuOpen(false);

    // Si estamos en otra ruta (no en la página principal), navegar primero a la principal
    if (location.pathname !== '/') {
      navigate('/');
      // Esperar un momento para que la página se cargue antes de hacer scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Si ya estamos en la página principal, solo hacer scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => handleNavigation('inicio')}>
          <span className="logo-icon">
            <img src="/logo-azul-transp.png" alt="Rogen Autos" className="logo-img" />
          </span>
        </div>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <a href="#inicio" onClick={(e) => { e.preventDefault(); handleNavigation('inicio'); }}>Inicio</a>
          <a href="#quienes-somos" onClick={(e) => { e.preventDefault(); handleNavigation('quienes-somos'); }}>Nosotros</a>
          <a href="#porque-elegirnos" onClick={(e) => { e.preventDefault(); handleNavigation('porque-elegirnos'); }}>Beneficios</a>
          <a href="#catalogo" onClick={(e) => { e.preventDefault(); handleNavigation('catalogo'); }}>Autos</a>
          <a href="#contacto" onClick={(e) => { e.preventDefault(); handleNavigation('contacto'); }}>Contacto</a>
        </div>

        <button
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;


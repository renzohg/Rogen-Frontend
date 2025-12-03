import { MapPinIcon, PhoneIcon, MailIcon } from './Icons';
import './Footer.css';

function Footer() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo-transp.png" alt="Rogen Autos" className="footer-logo-img" />
              <span className="logo-text">Rogen Autos</span>
            </div>
            <p className="footer-description">
              Tu confianza es nuestro motor. Encuentra el auto perfecto 
              para ti con la mejor calidad y servicio.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Enlaces Rápidos</h3>
            <ul className="footer-links">
              <li><a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection('inicio'); }}>Inicio</a></li>
              <li><a href="#quienes-somos" onClick={(e) => { e.preventDefault(); scrollToSection('quienes-somos'); }}>Quiénes Somos</a></li>
              <li><a href="#autos-destacados" onClick={(e) => { e.preventDefault(); scrollToSection('autos-destacados'); }}>Autos Destacados</a></li>
              <li><a href="#catalogo" onClick={(e) => { e.preventDefault(); scrollToSection('catalogo'); }}>Catálogo</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Información</h3>
            <ul className="footer-links">
              <li><a href="#porque-elegirnos" onClick={(e) => { e.preventDefault(); scrollToSection('porque-elegirnos'); }}>Por qué Elegirnos</a></li>
              <li><a href="#contacto" onClick={(e) => { e.preventDefault(); scrollToSection('contacto'); }}>Contacto</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contacto</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <MapPinIcon size={18} color="var(--color-white)" />
                <span>Av. Córdoba Esquina Los Gladiolos, Villa Santa Cruz del Lago, Córdoba</span>
              </div>
              <div className="contact-item">
                <PhoneIcon size={18} color="var(--color-white)" />
                <a href="tel:+5493541598857">+54 9 3541 598857</a>
              </div>
              <div className="contact-item">
                <MailIcon size={18} color="var(--color-white)" />
                <a href="mailto:contacto@rogen-autos.com">contacto@rogen-autos.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Rogen Autos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


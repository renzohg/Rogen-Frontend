import './Hero.css';

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <p className="hero-slogan">Tu próximo auto te está esperando</p>
        <p className="hero-description">
        Encuentra el vehículo perfecto para ti. Con total garantía y confianza.
        </p>
        <a href="#catalogo" className="hero-button">
          Ver Catálogo
        </a>
      </div>
    </section>
  );
}

export default Hero;


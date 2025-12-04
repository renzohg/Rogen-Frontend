import { useState, useEffect } from 'react';
import { CheckCircleIcon } from './Icons';
import './QuienesSomos.css';

function QuienesSomos() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array de imágenes desde la carpeta public
  const images = [
    '/01.jpg',
    '/02.jpg',
    '/03.jpg',
    '/04.jpg',
    '/05.jpg'
  ];

  // Cambiar imagen automáticamente cada 5.5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5500);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="quienes-somos" className="quienes-somos">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Quiénes Somos</h2>
          <div className="section-divider"></div>
        </div>
        <div className="quienes-somos-content">
          <div className="quienes-somos-text">
            <p className="intro-text">
              En <strong>Rogen Autos</strong> ofrecemos autos nuevos y usados cuidadosamente seleccionados. Nuestro compromiso es brindarte una experiencia de compra segura, transparente y personalizada.
            </p>

            <div className="features-list">
              <div className="feature-item">
                <CheckCircleIcon size={24} color="var(--color-accent)" />
                <span>Vehículos inspeccionados y certificados</span>
              </div>
              <div className="feature-item">
                <CheckCircleIcon size={24} color="var(--color-accent)" />
                <span>Asesoramiento personalizado</span>
              </div>
              <div className="feature-item">
                <CheckCircleIcon size={24} color="var(--color-accent)" />
                <span>Financiación a tu medida</span>
              </div>
              <div className="feature-item">
                <CheckCircleIcon size={24} color="var(--color-accent)" />
                <span>Garantía en todos nuestros autos</span>
              </div>
            </div>
          </div>
          <div className="carousel-container">
            <div className="carousel-images">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Rogen Autos - Instalaciones y vehículos ${index + 1}`}
                  className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
                  loading="lazy"
                />
              ))}
            </div>
            <div className="carousel-indicators">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuienesSomos;

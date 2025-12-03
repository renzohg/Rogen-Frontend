import { useState, useEffect } from 'react';
import { getAutos } from '../services/api';
import AutoCard from './AutoCard';
import './AutosDestacados.css';

function AutosDestacados() {
  const [autos, setAutos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarAutos();
  }, []);

  const cargarAutos = async () => {
    try {
      const response = await getAutos();
      // Filtrar solo autos destacados y disponibles
      const autosDestacados = response.data.filter(auto => 
        auto.estado === 'Disponible' && auto.destacado === true
      );
      setAutos(autosDestacados.slice(0, 6));
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar autos destacados:', error);
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (autos.length <= 3) return;
    const maxIndex = Math.max(0, autos.length - 3);
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    if (autos.length <= 3) return;
    const maxIndex = Math.max(0, autos.length - 3);
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  if (loading) {
    return (
      <section id="autos-destacados" className="autos-destacados">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Autos Destacados</h2>
            <div className="section-divider"></div>
          </div>
          <div className="loading-message">Cargando autos destacados...</div>
        </div>
      </section>
    );
  }

  if (autos.length === 0) {
    return null;
  }

  const maxIndex = Math.max(0, autos.length - 3);
  const visibleAutos = autos.slice(currentIndex, currentIndex + 3);

  return (
    <section id="autos-destacados" className="autos-destacados">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Autos Destacados</h2>
          <div className="section-divider"></div>
        </div>
        
        <div className="carousel-container">
          <button 
            className="carousel-button prev" 
            onClick={prevSlide}
            aria-label="Anterior"
            disabled={autos.length <= 3}
          >
            ‹
          </button>
          
          <div className="carousel-wrapper">
            <div className="carousel-track">
              {visibleAutos.map((auto) => (
                <div key={auto._id} className="carousel-slide">
                  <AutoCard auto={auto} />
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="carousel-button next" 
            onClick={nextSlide}
            aria-label="Siguiente"
            disabled={autos.length <= 3}
          >
            ›
          </button>
        </div>

        {autos.length > 3 && (
          <div className="carousel-dots">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AutosDestacados;


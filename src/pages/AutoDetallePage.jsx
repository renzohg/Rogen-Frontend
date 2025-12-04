import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAutoById } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CarIcon, MessageIcon, ChevronDownIcon, ChevronUpIcon } from '../components/Icons';
import './AutoDetallePage.css';

function AutoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auto, setAuto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  useEffect(() => {
    // Scroll to top cuando se carga la página
    window.scrollTo(0, 0);
    cargarAuto();
  }, [id]);

  useEffect(() => {
    // Scroll to top cuando cambia el auto
    if (auto) {
      window.scrollTo(0, 0);
    }
  }, [auto]);

  const cargarAuto = async () => {
    try {
      setLoading(true);
      const response = await getAutoById(id);
      setAuto(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el auto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const whatsappNumber = '5493541598857';
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio);
  };

  const formatearKilometraje = (km) => {
    return new Intl.NumberFormat('es-AR').format(km);
  };

  if (loading) {
    return (
      <div className="auto-detalle-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading">Cargando auto...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !auto) {
    return (
      <div className="auto-detalle-page">
        <Navbar />
        <div className="error-container">
          <div className="error">{error || 'Auto no encontrado'}</div>
          <button onClick={() => navigate('/')} className="btn-volver">
            Volver al catálogo
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const mensajeWhatsApp = encodeURIComponent(
    `Hola, me interesa consultar por este vehículo:\n\n` +
    `${auto.marca} ${auto.modelo} ${auto.año}\n` +
    `Precio: $${formatearPrecio(auto.precio)} (${auto.moneda || 'ARS'})\n`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensajeWhatsApp}`;

  const imagenes = auto.imagenes && auto.imagenes.length > 0 ? auto.imagenes : [];

  const nextImage = () => {
    if (imagenes.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % imagenes.length);
    }
  };

  const prevImage = () => {
    if (imagenes.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
    }
  };

  const hasAdvancedFeatures = auto && (
    auto.puertas || auto.motor || auto.tipoCarroceria ||
    auto.llantasAleacion || auto.tapizadoCuero ||
    auto.computadoraAbordo || auto.portaVasos ||
    auto.direccion || auto.alarma ||
    auto.potencia || auto.capacidadPersonas || auto.capacidadTanque ||
    auto.distanciaEjes || auto.valvulasPorCilindro || auto.controlTraccion ||
    auto.frenosABS || auto.airbagConductorPasajero ||
    auto.largo || auto.altura || auto.ancho
  );

  return (
    <div className="auto-detalle-page">
      <Navbar />
      <div className="auto-detalle-container">
        <button className="btn-volver-detalle" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <div className="auto-detalle-layout">
          {/* Sección de imágenes con carrusel */}
          <div className="auto-detalle-images-section">
            {imagenes.length > 0 ? (
              <div className="image-carousel">
                <div className="carousel-main">
                  {imagenes.length > 1 && (
                    <button className="carousel-btn prev" onClick={prevImage} aria-label="Imagen anterior">
                      ‹
                    </button>
                  )}
                  <img
                    src={imagenes[currentImageIndex]}
                    alt={`${auto.marca} ${auto.modelo} - Imagen ${currentImageIndex + 1}`}
                    className="carousel-main-image"
                    loading="lazy"
                  />
                  {imagenes.length > 1 && (
                    <button className="carousel-btn next" onClick={nextImage} aria-label="Siguiente imagen">
                      ›
                    </button>
                  )}
                </div>
                {imagenes.length > 1 && (
                  <div className="carousel-thumbnails">
                    {imagenes.map((img, index) => (
                      <button
                        key={index}
                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`Ver imagen ${index + 1}`}
                      >
                        <img src={img} alt={`${auto.marca} ${auto.modelo} - Miniatura ${index + 1}`} loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
                {imagenes.length > 1 && (
                  <div className="carousel-indicator">
                    {currentImageIndex + 1} / {imagenes.length}
                  </div>
                )}
              </div>
            ) : (
              <div className="no-image-large">
                <CarIcon size={80} color="var(--color-text-light)" />
                <span>Sin imagen disponible</span>
              </div>
            )}
          </div>

          {/* Sección de información */}
          <div className="auto-detalle-info-section">
            {/* Título principal */}
            <div className="info-title-section">
              <h1>{auto.marca} {auto.modelo}</h1>
            </div>

            {/* Datos principales: Año, Versión, Transmisión, Kilometraje */}
            <div className="info-main-details-list">
              <div className="detail-item">
                <span className="detail-label">Año</span>
                <span className="detail-value">{auto.año}</span>
              </div>
              {auto.version && (
                <div className="detail-item">
                  <span className="detail-label">Versión</span>
                  <span className="detail-value">{auto.version}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">Transmisión</span>
                <span className="detail-value">{auto.transmision}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Kilometraje</span>
                <span className="detail-value">{formatearKilometraje(auto.kilometraje)} km</span>
              </div>
            </div>

            {/* Precio */}
            <div className="info-price-section">
              <span className="price-main">${formatearPrecio(auto.precio)}</span>
              <span className="price-currency-badge">({auto.moneda || 'ARS'})</span>
            </div>

            {/* Separador */}
            <div className="info-separator"></div>

            {/* Resto de datos */}
            <div className="details-list">
              <div className="detail-item">
                <span className="detail-label">Combustible</span>
                <span className="detail-value">{auto.combustible}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Color</span>
                <span className="detail-value">{auto.color}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Estado</span>
                <span className="detail-value">{auto.estado}</span>
              </div>
            </div>

            {auto.descripcion && (
              <div className="description-section">
                <h2>Descripción</h2>
                <p>{auto.descripcion}</p>
              </div>
            )}

            {hasAdvancedFeatures && (
              <div className="advanced-features-section">
                <button
                  className="accordion-toggle-detail"
                  onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                >
                  <span>Características Generales</span>
                  {showAdvancedFeatures ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                </button>

                {showAdvancedFeatures && (
                  <div className="accordion-content-detail">
                    {/* Características principales */}
                    {(auto.puertas || auto.motor || auto.tipoCarroceria) && (
                      <div className="feature-group">
                        <h4>Principales</h4>
                        <ul>
                          {auto.puertas && <li><strong>Puertas:</strong> {auto.puertas}</li>}
                          {auto.motor && <li><strong>Motor:</strong> {auto.motor}</li>}
                          {auto.tipoCarroceria && <li><strong>Carrocería:</strong> {auto.tipoCarroceria}</li>}
                        </ul>
                      </div>
                    )}

                    {/* Exterior e Interior */}
                    {(auto.llantasAleacion || auto.tapizadoCuero) && (
                      <div className="feature-group">
                        <h4>Exterior e Interior</h4>
                        <ul>
                          {auto.llantasAleacion && <li>Llantas de aleación</li>}
                          {auto.tapizadoCuero && <li>Tapizado de cuero</li>}
                        </ul>
                      </div>
                    )}

                    {/* Confort */}
                    {(auto.computadoraAbordo || auto.portaVasos) && (
                      <div className="feature-group">
                        <h4>Confort</h4>
                        <ul>
                          {auto.computadoraAbordo && <li>Computadora de abordo</li>}
                          {auto.portaVasos && <li>Porta vasos</li>}
                        </ul>
                      </div>
                    )}

                    {/* Información General */}
                    {(auto.direccion || auto.alarma) && (
                      <div className="feature-group">
                        <h4>Información General</h4>
                        <ul>
                          {auto.direccion && <li><strong>Dirección:</strong> {auto.direccion}</li>}
                          {auto.alarma && <li>Alarma</li>}
                        </ul>
                      </div>
                    )}

                    {/* Rendimiento */}
                    {(auto.potencia || auto.capacidadPersonas || auto.capacidadTanque || auto.distanciaEjes || auto.valvulasPorCilindro || auto.controlTraccion) && (
                      <div className="feature-group">
                        <h4>Rendimiento</h4>
                        <ul>
                          {auto.potencia && <li><strong>Potencia:</strong> {auto.potencia}</li>}
                          {auto.capacidadPersonas && <li><strong>Capacidad:</strong> {auto.capacidadPersonas} personas</li>}
                          {auto.capacidadTanque && <li><strong>Tanque:</strong> {auto.capacidadTanque}</li>}
                          {auto.distanciaEjes && <li><strong>Distancia ejes:</strong> {auto.distanciaEjes}</li>}
                          {auto.valvulasPorCilindro && <li><strong>Válvulas:</strong> {auto.valvulasPorCilindro}</li>}
                          {auto.controlTraccion && <li>Control de tracción</li>}
                        </ul>
                      </div>
                    )}

                    {/* Seguridad */}
                    {(auto.frenosABS || auto.airbagConductorPasajero) && (
                      <div className="feature-group">
                        <h4>Seguridad</h4>
                        <ul>
                          {auto.frenosABS && <li>Frenos ABS</li>}
                          {auto.airbagConductorPasajero && <li>Airbag conductor y pasajero</li>}
                        </ul>
                      </div>
                    )}

                    {/* Dimensiones */}
                    {(auto.largo || auto.altura || auto.ancho) && (
                      <div className="feature-group">
                        <h4>Dimensiones</h4>
                        <ul>
                          {auto.largo && <li><strong>Largo:</strong> {auto.largo}</li>}
                          {auto.altura && <li><strong>Altura:</strong> {auto.altura}</li>}
                          {auto.ancho && <li><strong>Ancho:</strong> {auto.ancho}</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button-large"
            >
              <MessageIcon size={24} color="var(--color-white)" />
              <span>Consultar por este vehículo</span>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AutoDetallePage;


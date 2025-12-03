import { useState, useEffect, useRef } from 'react';
import { getAutos } from '../services/api';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import QuienesSomos from '../components/QuienesSomos';
import AutosDestacados from '../components/AutosDestacados';
import PorQueElegirnos from '../components/PorQueElegirnos';
import Contacto from '../components/Contacto';
import Footer from '../components/Footer';
import AutoCard from '../components/AutoCard';
import { SearchIcon, XIcon } from '../components/Icons';
import './Catalogo.css';

function Catalogo() {
  const [autos, setAutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordenarPor, setOrdenarPor] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtros, setFiltros] = useState({
    marcaBusqueda: '',
    marcas: [],
    combustibles: [],
    transmisiones: [],
    precioMin: '',
    precioMax: '',
    monedas: []
  });
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    cargarAutos();
  }, []);

  // Prevenir scroll automático cuando cambian los filtros
  useEffect(() => {
    // Guardar la posición del scroll antes de que cambien los filtros
    scrollPositionRef.current = window.scrollY || window.pageYOffset;
    
    // Restaurar la posición después de que React actualice el DOM
    const timeoutId = setTimeout(() => {
      if (scrollPositionRef.current > 0) {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'instant'
        });
      }
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, [filtros, ordenarPor]);

  const cargarAutos = async () => {
    try {
      setLoading(true);
      const response = await getAutos();
      setAutos(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el catálogo de autos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener marcas únicas para el filtro
  const marcasUnicas = [...new Set(autos.map(auto => auto.marca))].sort();

  const autosFiltrados = autos.filter(auto => {
    // Búsqueda general por marca, modelo, año, color, versión
    const search = filtros.marcaBusqueda.toLowerCase();
    const cumpleBusqueda = !filtros.marcaBusqueda || 
      auto.marca.toLowerCase().includes(search) ||
      auto.modelo.toLowerCase().includes(search) ||
      auto.año.toString().includes(search) ||
      (auto.color && auto.color.toLowerCase().includes(search)) ||
      (auto.version && auto.version.toLowerCase().includes(search));
    
    const cumpleMarca = filtros.marcas.length === 0 || filtros.marcas.includes(auto.marca);
    const cumpleCombustible = filtros.combustibles.length === 0 || filtros.combustibles.includes(auto.combustible);
    const cumpleTransmision = filtros.transmisiones.length === 0 || filtros.transmisiones.includes(auto.transmision);
    const cumplePrecioMin = !filtros.precioMin || auto.precio >= parseFloat(filtros.precioMin);
    const cumplePrecioMax = !filtros.precioMax || auto.precio <= parseFloat(filtros.precioMax);
    const cumpleMoneda = filtros.monedas.length === 0 || filtros.monedas.includes(auto.moneda || 'ARS');
    
    return cumpleBusqueda && cumpleMarca && cumpleCombustible && cumpleTransmision && cumplePrecioMin && cumplePrecioMax && cumpleMoneda;
  });

  const autosOrdenados = [...autosFiltrados].sort((a, b) => {
    if (!ordenarPor) return 0;
    
    switch (ordenarPor) {
      case 'precio-asc':
        return a.precio - b.precio;
      case 'precio-desc':
        return b.precio - a.precio;
      case 'kilometraje-asc':
        return a.kilometraje - b.kilometraje;
      case 'kilometraje-desc':
        return b.kilometraje - a.kilometraje;
      case 'antiguedad-asc':
        // Menor antigüedad = año más reciente (mayor año)
        return b.año - a.año;
      case 'antiguedad-desc':
        // Mayor antigüedad = año más antiguo (menor año)
        return a.año - b.año;
      default:
        return 0;
    }
  });

  const AUTOS_POR_PAGINA = 6;
  const totalPaginas = Math.ceil(autosOrdenados.length / AUTOS_POR_PAGINA) || 1;
  const inicio = (paginaActual - 1) * AUTOS_POR_PAGINA;
  const autosPaginados = autosOrdenados.slice(inicio, inicio + AUTOS_POR_PAGINA);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
    const catalogoSection = document.getElementById('catalogo');
    if (catalogoSection) {
      const rect = catalogoSection.getBoundingClientRect();
      const offsetTop = window.pageYOffset + rect.top - 120;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [filtros, ordenarPor]);

  return (
    <div className="catalogo-page">
      <Navbar />
      <Hero />
      <QuienesSomos />
      <AutosDestacados />
      <PorQueElegirnos />
      
      <section id="catalogo" className="catalogo-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Catálogo Completo</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              Explora todos nuestros vehículos disponibles
            </p>
          </div>

          <div className="catalogo-container">
            <aside className="filtros">
              <h3 className="filtros-title">Filtros</h3>
              
              <div className="filtro-group">
                <label className='label-titulos'>Ordenar por</label>
                <select
                  value={ordenarPor}
                  onChange={(e) => setOrdenarPor(e.target.value)}
                  className="ordenar-select"
                >
                  <option value="">Sin ordenar</option>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                  <option value="kilometraje-asc">Menor kilometraje</option>
                  <option value="kilometraje-desc">Mayor kilometraje</option>
                  <option value="antiguedad-asc">Menor antigüedad</option>
                  <option value="antiguedad-desc">Mayor antigüedad</option>
                </select>
              </div>

              <div className="filtro-group">
                <label className='label-titulos'>Marca</label>
                <div className="checkbox-group">
                  {marcasUnicas.map(marca => (
                    <label key={marca} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filtros.marcas.includes(marca)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFiltros({
                              ...filtros,
                              marcas: [...filtros.marcas, marca]
                            });
                          } else {
                            setFiltros({
                              ...filtros,
                              marcas: filtros.marcas.filter(m => m !== marca)
                            });
                          }
                        }}
                      />
                      <span>{marca}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="filtro-group">
                <label className='label-titulos'>Precio</label>
                <div className="precio-range">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={filtros.precioMin}
                    onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={filtros.precioMax}
                    onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
                  />
                </div>
                <div className="checkbox-group compact">
                  {['ARS', 'USD'].map(moneda => (
                    <label key={moneda} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filtros.monedas.includes(moneda)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFiltros({
                              ...filtros,
                              monedas: [...filtros.monedas, moneda]
                            });
                          } else {
                            setFiltros({
                              ...filtros,
                              monedas: filtros.monedas.filter(m => m !== moneda)
                            });
                          }
                        }}
                      />
                      <span>{moneda}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filtro-group">
                <label className='label-titulos'>Combustible</label>
                <div className="checkbox-group">
                  {['Nafta', 'Diesel', 'Eléctrico', 'Híbrido', 'GNC'].map(combustible => (
                    <label key={combustible} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filtros.combustibles.includes(combustible)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFiltros({
                              ...filtros,
                              combustibles: [...filtros.combustibles, combustible]
                            });
                          } else {
                            setFiltros({
                              ...filtros,
                              combustibles: filtros.combustibles.filter(c => c !== combustible)
                            });
                          }
                        }}
                      />
                      <span>{combustible}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filtro-group">
                <label className='label-titulos'>Transmisión</label>
                <div className="checkbox-group">
                  {['Manual', 'Automática'].map(transmision => (
                    <label key={transmision} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filtros.transmisiones.includes(transmision)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFiltros({
                              ...filtros,
                              transmisiones: [...filtros.transmisiones, transmision]
                            });
                          } else {
                            setFiltros({
                              ...filtros,
                              transmisiones: filtros.transmisiones.filter(t => t !== transmision)
                            });
                          }
                        }}
                      />
                      <span>{transmision}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                className="btn-limpiar"
                onClick={() => {
                  setFiltros({
                    marcaBusqueda: '',
                    marcas: [],
                    combustibles: [],
                    transmisiones: [], 
                    precioMin: '',
                    precioMax: '',
                    monedas: []
                  });
                  setOrdenarPor('');
                }}
              >
                <XIcon size={18} color="currentColor" />
                Limpiar Filtros
              </button>
            </aside>

            <main className="autos-grid">
              {loading ? (
                <div className="loading">Cargando autos...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : (
                <>
                  <div className="buscador-container">
                    <div className="buscador-wrapper">
                      <SearchIcon size={20} color="var(--color-text-light)" className="search-icon" />
                      <input
                        type="text"
                        placeholder="Buscar por marca, modelo, año..."
                        value={filtros.marcaBusqueda}
                        onChange={(e) => setFiltros({ ...filtros, marcaBusqueda: e.target.value })}
                        className="buscador-input"
                      />
                    </div>
                  </div>
                  
                  {autosOrdenados.length === 0 ? (
                    <div className="no-results">No se encontraron autos con los filtros seleccionados</div>
                  ) : (
                    <>
                    <div className="autos-list">
                        {autosPaginados.map(auto => (
                        <AutoCard 
                          key={auto._id} 
                          auto={auto}
                        />
                      ))}
                    </div>
                      {totalPaginas > 1 && (
                        <div className="pagination">
                          <button
                            className="pagination-button"
                            onClick={() => cambiarPagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                          >
                            «
                          </button>
                          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                            <button
                              key={num}
                              className={`pagination-button ${num === paginaActual ? 'active' : ''}`}
                              onClick={() => cambiarPagina(num)}
                            >
                              {num}
                            </button>
                          ))}
                          <button
                            className="pagination-button"
                            onClick={() => cambiarPagina(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                          >
                            »
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>

      <Contacto />
      <Footer />
    </div>
  );
}

export default Catalogo;

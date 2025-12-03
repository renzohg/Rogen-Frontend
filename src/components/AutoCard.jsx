import { useNavigate } from 'react-router-dom';
import { CarIcon } from './Icons';
import './AutoCard.css';

function AutoCard({ auto }) {
  const navigate = useNavigate();
  const formatearPrecio = (precio) => {
    // Formatear solo el número sin símbolo de moneda
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio);
  };

  const formatearKilometraje = (km) => {
    return new Intl.NumberFormat('es-AR').format(km);
  };

  return (
    <div className="auto-card" onClick={() => navigate(`/auto/${auto._id}`)}>
      <div className="auto-card-image">
        {auto.nuevoIngreso && (
          <div className="nuevo-ingreso-badge">Nuevo ingreso</div>
        )}
        {auto.imagenes && auto.imagenes.length > 0 ? (
          <img src={auto.imagenes[0]} alt={`${auto.marca} ${auto.modelo}`} />
        ) : (
          <div className="no-image">
            <CarIcon size={48} color="var(--color-text-light)" />
            <span>Sin imagen</span>
          </div>
        )}
      </div>
      <div className="auto-card-content">
        <h3 className="auto-card-title">{auto.marca} {auto.modelo}</h3>
        <div className="auto-card-year-km">
          <span className="auto-card-year">{auto.año}</span>
          <span className="auto-card-separator">•</span>
          <span className="auto-card-kilometraje-text">{formatearKilometraje(auto.kilometraje)} km</span>
          {auto.version && (
            <>
              <span className="auto-card-separator">•</span>
              <span className="auto-card-version">{auto.version}</span>
            </>
          )}
        </div>
        <div className="auto-card-price">
          <span className="price-amount">${formatearPrecio(auto.precio)}</span>
          <span className="price-currency">({auto.moneda || 'ARS'})</span>
        </div>
      </div>
    </div>
  );
}

export default AutoCard;

import { useState } from 'react';
import { CarIcon, RulerIcon, FuelIcon, SettingsIcon, PaletteIcon, MessageIcon } from './Icons';
import './AutoDetalle.css';

function AutoDetalle({ auto, isOpen, onClose }) {
  if (!isOpen || !auto) return null;

  const whatsappNumber = '5493541598857'; // Reemplaza con tu número de WhatsApp
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio);
  };

  const formatearKilometraje = (km) => {
    return new Intl.NumberFormat('es-AR').format(km);
  };

  const mensajeWhatsApp = encodeURIComponent(
    `Hola, me interesa consultar por este vehículo:\n\n` +
    `${auto.marca} ${auto.modelo} ${auto.año}\n` +
    `Precio: $${formatearPrecio(auto.precio)} (${auto.moneda || 'ARS'})\n` +
    `Kilometraje: ${formatearKilometraje(auto.kilometraje)} km`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensajeWhatsApp}`;

  return (
    <div className="auto-detalle-overlay" onClick={onClose}>
      <div className="auto-detalle-content" onClick={(e) => e.stopPropagation()}>
        <button className="auto-detalle-close" onClick={onClose} aria-label="Cerrar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="auto-detalle-image">
          {auto.imagenes && auto.imagenes.length > 0 ? (
            <img src={auto.imagenes[0]} alt={`${auto.marca} ${auto.modelo} ${auto.año}`} loading="lazy" />
          ) : (
            <div className="no-image">
              <CarIcon size={64} color="var(--color-text-light)" />
              <span>Sin imagen</span>
            </div>
          )}
        </div>

        <div className="auto-detalle-info">
          <div className="auto-detalle-header">
            <h2>{auto.marca} {auto.modelo}</h2>
            <div className="auto-detalle-header-info">
              <span className="auto-detalle-year">{auto.año}</span>
              {auto.version && (
                <span className="auto-detalle-version">{auto.version}</span>
              )}
            </div>
          </div>

          <div className="auto-detalle-price">
            <span className="price-amount">${formatearPrecio(auto.precio)}</span>
            <span className="price-currency">({auto.moneda || 'ARS'})</span>
          </div>

          <div className="auto-detalle-details">
            <div className="detail-row">
              <div className="detail-item">
                <RulerIcon size={24} color="var(--color-accent)" />
                <div className="detail-info">
                  <span className="detail-label">Kilometraje</span>
                  <span className="detail-value">{formatearKilometraje(auto.kilometraje)} km</span>
                </div>
              </div>
              <div className="detail-item">
                <FuelIcon size={24} color="var(--color-accent)" />
                <div className="detail-info">
                  <span className="detail-label">Combustible</span>
                  <span className="detail-value">{auto.combustible}</span>
                </div>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <SettingsIcon size={24} color="var(--color-accent)" />
                <div className="detail-info">
                  <span className="detail-label">Transmisión</span>
                  <span className="detail-value">{auto.transmision}</span>
                </div>
              </div>
              <div className="detail-item">
                <PaletteIcon size={24} color="var(--color-accent)" />
                <div className="detail-info">
                  <span className="detail-label">Color</span>
                  <span className="detail-value">{auto.color}</span>
                </div>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <div className="detail-info">
                  <span className="detail-label">Estado</span>
                  <span className={`detail-value status-${auto.estado.toLowerCase()}`}>
                    {auto.estado}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {auto.descripcion && (
            <div className="auto-detalle-description">
              <h3>Descripción</h3>
              <p>{auto.descripcion}</p>
            </div>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button-detalle"
          >
            <MessageIcon size={24} color="var(--color-white)" />
            <span>Consultar por este vehículo</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AutoDetalle;


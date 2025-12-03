import { PhoneIcon, MessageIcon, ClockIcon } from './Icons';
import './Contacto.css';

function Contacto() {
  const whatsappNumber = '5491123456789'; // Reemplaza con tu número de WhatsApp
  const whatsappMessage = encodeURIComponent('Hola, me interesa conocer más sobre sus vehículos disponibles.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section id="contacto" className="contacto">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Contacto</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte
          </p>
        </div>
        
        <div className="contacto-content">
          <div className="contacto-info">
            <p className="contacto-text">
              Comunícate con nosotros a través de WhatsApp y te responderemos 
              a la brevedad. Nuestro equipo está listo para asistirte con 
              cualquier consulta sobre nuestros vehículos.
            </p>
            <div className="contacto-details">
              <div className="contacto-item">
                <PhoneIcon size={24} color="var(--color-white)" />
                <span>WhatsApp disponible 24/7</span>
              </div>
              <div className="contacto-item">
                <ClockIcon size={24} color="var(--color-white)" />
                <span>Atención inmediata</span>
              </div>
              <div className="contacto-item">
                <MessageIcon size={24} color="var(--color-white)" />
                <span>Asesoramiento personalizado</span>
              </div>
            </div>
          </div>
          
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="whatsapp-button"
          >
            <MessageIcon size={24} color="var(--color-white)" />
            <span>Contactar por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contacto;


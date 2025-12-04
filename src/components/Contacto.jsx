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
            ¿Querés conocer más o agendar una visita?
          </p>
        </div>

        <div className="contacto-content">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button"
          >
            <MessageIcon size={24} color="var(--color-white)" />
            <span>Escribinos</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contacto;


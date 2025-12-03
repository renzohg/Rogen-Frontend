import { CheckIcon, MoneyIcon, WrenchIcon, ShieldIcon, StarIcon, RocketIcon } from './Icons';
import './PorQueElegirnos.css';

function PorQueElegirnos() {
  const razones = [
    {
      icon: CheckIcon,
      title: 'Confianza',
      description: 'Vehículos verificados con historial claro y garantía.'
    },
    {
      icon: ShieldIcon,
      title: 'Transparencia',
      description: 'Operaciones seguras y acompañamiento en todo el proceso.'
    },
    {
      icon: StarIcon,
      title: 'Atención',
      description: 'Te acompañamos de principio a fin para que compres tranquilo.'
    },
  ];

  return (
    <section id="porque-elegirnos" className="porque-elegirnos">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Por qué Elegirnos</h2>
          <div className="section-divider"></div>
        </div>
        
        <div className="razones-grid">
          {razones.map((razon, index) => {
            const IconComponent = razon.icon;
            return (
              <div key={index} className="razon-card">
                <div className="razon-icon">
                  <IconComponent size={48} color="var(--color-accent)" />
                </div>
                <h3 className="razon-title">{razon.title}</h3>
                <p className="razon-description">{razon.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PorQueElegirnos;


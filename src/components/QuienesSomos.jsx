import './QuienesSomos.css';

function QuienesSomos() {
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
            En Rogen Autos ofrecemos autos nuevos y usados cuidadosamente seleccionados. Nuestro compromiso es brindarte una experiencia de compra segura, transparente y personalizada.
            </p>
          </div>
          <div className="quienes-somos-stats">
            <div className="stat-item">
              <div className="stat-number">+100</div>
              <div className="stat-label">Autos Vendidos</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Clientes Satisfechos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuienesSomos;


import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="error-code">
                    <span className="four">4</span>
                    <span className="zero">
                        <svg viewBox="0 0 100 100" className="car-icon">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
                            <circle cx="35" cy="60" r="8" fill="currentColor" />
                            <circle cx="65" cy="60" r="8" fill="currentColor" />
                            <path d="M 20 50 L 30 35 L 70 35 L 80 50 L 80 65 L 20 65 Z" fill="none" stroke="currentColor" strokeWidth="3" />
                            <rect x="35" y="40" width="12" height="10" fill="none" stroke="currentColor" strokeWidth="2" />
                            <rect x="53" y="40" width="12" height="10" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </span>
                    <span className="four">4</span>
                </div>

                <h1 className="error-title">¡Oops! Página no encontrada</h1>
                <p className="error-message">
                    Parece que tomaste un desvío equivocado. La página que buscas no existe o fue movida.
                </p>

                <Link to="/" className="home-button">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Volver al Inicio
                </Link>

                <div className="road-animation">
                    <div className="road-line"></div>
                    <div className="road-line"></div>
                    <div className="road-line"></div>
                    <div className="road-line"></div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;

// Components/Features.tsx
import type { FC } from 'react';
import './Features.css'; // Crearemos este archivo CSS para los estilos personalizados

// Asegúrate de que los Bootstrap Icons estén instalados y cargados en tu proyecto (como en main.tsx)
// Si usaras Font Awesome (ejemplo):
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUsers, faChartLine, faStar } from '@fortawesome/free-solid-svg-icons';


const Features: FC = () => (
    <section className="features-section py-5 ">
        <div className="container py-4">
            <h2 className="display-4 fw-bold mb-5 text-center text-white text-uppercase">
                Caracteristicas <span className="text-gradient-sporty">Destacadas</span>
            </h2>
            <div className="row justify-content-center g-4"> {/* g-4 para un gap entre columnas */}

                {/* Característica 1: Ligas Privadas */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-lg border-0 feature-card">
                        <div className="card-body p-4 text-center">
                            <div className="icon-wrapper mb-3 mx-auto">
                                {/* Bootstrap Icon */}
                                <i className="bi bi-people-fill feature-icon"></i>
                                {/* Si usas Font Awesome: <FontAwesomeIcon icon={faUsers} className="feature-icon" /> */}
                            </div>
                            <h5 className="card-title fw-bold mb-3 text-sporty-blue">Ligas Privadas</h5>
                            <p className="card-text">
                                Crea y compite con tus amigos en ligas personalizadas. La estrategia es clave!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Característica 2: Mercado en Tiempo Real */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-lg border-0 feature-card">
                        <div className="card-body p-4 text-center">
                            <div className="icon-wrapper mb-3 mx-auto">
                                {/* Bootstrap Icon */}
                                <i className="bi bi-graph-up-arrow feature-icon"></i> {/* Usamos graph-up-arrow, más visual */}
                                {/* Si usas Font Awesome: <FontAwesomeIcon icon={faChartLine} className="feature-icon" /> */}
                            </div>
                            <h5 className="card-title fw-bold mb-3 text-sporty-blue">Mercado en Tiempo Real</h5>
                            <p className="card-text ">
                                Compra y vende jugadores con las ultimas cotizaciones del mercado. Se el manager mas astuto!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Característica 3: Puntuaciones Realistas */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-lg border-0 feature-card">
                        <div className="card-body p-4 text-center">
                            <div className="icon-wrapper mb-3 mx-auto">
                                {/* Bootstrap Icon */}
                                <i className="bi bi-star-fill feature-icon"></i> {/* Usamos star-fill para más impacto */}
                                {/* Si usas Font Awesome: <FontAwesomeIcon icon={faStar} className="feature-icon" /> */}
                            </div>
                            <h5 className="card-title fw-bold mb-3 text-sporty-blue">Puntuaciones Realistas</h5>
                            <p className="card-text">
                                Tus puntos se basan en el rendimiento real de tus jugadores en cada jornada. La emocion del juego real!
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
);

export default Features;
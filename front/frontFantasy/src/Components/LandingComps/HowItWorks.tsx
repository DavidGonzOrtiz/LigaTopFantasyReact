// Components/HowItWorks.tsx
import type { FC } from 'react';
import './HowItWorks.css'; // Crearemos este archivo CSS para los estilos personalizados

// Importa iconos si los vas a usar (ejemplo con Font Awesome o Bootstrap Icons)
// Para Bootstrap Icons:
// import 'bootstrap-icons/font/bootstrap-icons.css';
// Para Font Awesome (ejemplo):
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUserPlus, faUsers, faTrophy } from '@fortawesome/free-solid-svg-icons';


const HowItWorks: FC = () => (
    <section className="how-it-works-section py-5">
        <div className="container py-4">
            <h2 className="display-4 fw-bold mb-5 text-center text-white text-uppercase">
                ..Como <span className="text-gradient-sporty">Funciona</span>?
            </h2>
            <div className="row justify-content-center g-4"> {/* g-4 para un gap entre columnas */}

                {/* Paso 1: Regístrate */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-lg border-0 how-it-works-card">
                        <div className="card-body p-4 text-center">
                            <div className="icon-circle mb-3 mx-auto">
                                {/* Ejemplo con Bootstrap Icons. Asegúrate de importarlos en tu proyecto. */}
                                <i className="bi bi-person-plus-fill icon-sporty"></i>
                                {/* Si usas Font Awesome: <FontAwesomeIcon icon={faUserPlus} className="icon-sporty" /> */}
                            </div>
                            <h4 className="card-title fw-bold mb-3 text-sporty-blue">1. Registrate</h4>
                            <p className="card-text">
                                Crea tu cuenta en minutos y unete a una liga con tus amigos o con nuevos rivales. La aventura te espera!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Paso 2: Arma tu plantilla */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-lg border-0 how-it-works-card">
                        <div className="card-body p-4 text-center">
                            <div className="icon-circle mb-3 mx-auto">
                                <i className="bi bi-people-fill icon-sporty"></i>
                                {/* Si usas Font Awesome: <FontAwesomeIcon icon={faUsers} className="icon-sporty" /> */}
                            </div>
                            <h4 className="card-title fw-bold mb-3 text-sporty-blue">2. Arma tu plantilla</h4>
                            <p className="card-text ">
                                Utiliza tu presupuesto inicial para fichar a tus jugadores favoritos en el mercado de traspasos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Paso 3: Gana puntos */}
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-lg border-0 how-it-works-card">
                        <div className="card-body p-4 text-center">
                            <div className="icon-circle mb-3 mx-auto">
                                <i className="bi bi-trophy-fill icon-sporty"></i>
                                {/* Si usas Font Awesome: <FontAwesomeIcon icon={faTrophy} className="icon-sporty" /> */}
                            </div>
                            <h4 className="card-title fw-bold mb-3 text-sporty-blue">3. Gana puntos</h4>
                            <p className="card-text">
                                Tus jugadores sumaran puntos automaticamente en base a su rendimiento real en cada partido. Se el mejor!
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
);

export default HowItWorks;
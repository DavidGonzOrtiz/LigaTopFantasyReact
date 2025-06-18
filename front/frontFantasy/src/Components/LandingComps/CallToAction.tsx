import type { FC } from 'react';
import { useAuth } from '../../Context/AuthContext'; // Ajusta la ruta según tu proyecto
import './CallToAction.css';

const CallToAction: FC = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return null; // No mostramos el componente si el usuario está autenticado
    }

    return (
        <section className="call-to-action-section text-white text-center py-5">
            <div className="container py-4">
                <h2 className="display-4 fw-bold mb-3 text-uppercase">
                    ..Listo para la <span className="text-gradient-sporty">competicion</span>?
                </h2>
                <p className="lead mb-4 mx-auto" style={{ maxWidth: '700px' }}>
                    Unete a la liga definitiva de managers. RegIstrate ahora, arma tu equipo de <strong>campeones</strong> y demuestra que eres el mejor estratega.
                </p>
                <a href="/register" className="btn btn-primary btn-lg mt-3 animated-button">
                    ..Quiero Armar mi Equipo!
                </a>
            </div>
        </section>
    );
};

export default CallToAction;

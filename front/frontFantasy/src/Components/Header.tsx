// src/components/Header.tsx
import type { FC } from 'react';
import './Header.css';
import logoImg from '../assets/Landing/images/logo.png'; // Aseg�rate de que la ruta sea correcta
import { Link, useNavigate } from 'react-router-dom'; // Importa Link y useNavigate
import { useAuth } from '../Context/AuthContext'; // Importa el hook useAuth

const Header: FC = () => {
    const { isAuthenticated, user, logout } = useAuth(); // Obt�n el estado y las funciones del contexto
    const navigate = useNavigate(); // Para redirigir despu�s del logout

    const handleLogout = () => {
        logout(); // Llama a la funci�n de logout del contexto
        navigate('/login'); // Redirige al login despu�s de cerrar sesi�n
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 header-sporty-custom">
            <div className="container-fluid">
                {/* Logo y nombre de la marca */}
                <Link className="navbar-brand d-flex align-items-center" to="/"> {/* Usamos Link en lugar de a href */}
                    <img src={logoImg} alt="Logo" className="logo-sporty-image me-2" style={{ height: '45px' }} />
                    <span className="logo-sporty-text fs-2 fw-bold text-uppercase">LIGA TOP</span>
                </Link>

                {/* Bot�n de alternancia para m�viles */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavSporty"
                    aria-controls="navbarNavSporty"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Contenido de la barra de navegaci�n colapsable */}
                <div className="collapse navbar-collapse" id="navbarNavSporty">
                    {/* Enlaces de navegaci�n al centro (mx-auto para centrar) */}
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link custom-nav-link" aria-current="page" to="/">Inicio</Link> {/* Usamos Link */}
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link custom-nav-link" to="/equipos">Equipos</Link> {/* Usamos Link */}
                        </li>
                        {/*<li className="nav-item">*/}
                        {/*    <Link className="nav-link custom-nav-link" to="/LigasUsuarios">Ligas</Link> */}{/* Usamos Link */}
                        {/*</li>*/}
                        <li className="nav-item">
                            <Link className="nav-link custom-nav-link" to="/noticias">Noticias</Link> {/* Usamos Link */}
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link custom-nav-link" to="/contacto">Contacto</Link> {/* Usamos Link */}
                        </li>
                        {isAuthenticated && ( // Solo muestra "Mi Perfil" si el usuario est� autenticado
                            <li className="nav-item">
                                <Link className="nav-link custom-nav-link" to="/profile">Mi Perfil</Link> {/* Enlace a la p�gina protegida */}
                            </li>
                        )}
                    </ul>

                    {/* Botones de autenticaci�n a la derecha */}
                    <div className="d-flex auth-sporty-buttons-custom">
                        {isAuthenticated ? ( // Si el usuario est� autenticado
                            <>
                                <span className="navbar-text me-3" style={{ color: '#fff' }}>
                                    Hola, {user?.username || 'Usuario'}!
                                </span>
                                <button onClick={handleLogout} className="btn btn-outline-light auth-btn-logout-custom">
                                    Cerrar Sesion
                                </button>
                            </>
                        ) : ( // Si el usuario no est� autenticado
                            <>
                                <Link to="/register" className="btn btn-primary me-2 auth-btn-register-custom">Registro</Link> {/* Usamos Link */}
                                <Link to="/login" className="btn btn-outline-light auth-btn-login-custom">Iniciar Sesion</Link> {/* Usamos Link */}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
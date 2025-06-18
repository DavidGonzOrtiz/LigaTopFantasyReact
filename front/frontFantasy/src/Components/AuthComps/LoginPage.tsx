// src/components/LoginPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import type { LoginDto, LoginResponse } from '../../Types/auth';

// Importa FontAwesome si lo estás usando (asegúrate de que esté instalado)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'; // Solo necesitamos email y lock para login

function LoginPage() {
    const [EmailUsuario, setEmail] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const loginData: LoginDto = { EmailUsuario, Password };
            const response = await axios.post<LoginResponse>('https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/ligatop/autenticacion/login', loginData);

            const { token, emailUsuario } = response.data;

            login(token, emailUsuario);
            navigate('/profile');
        } catch (err: any) {
            console.error('Error durante el inicio de sesión:', err.response?.data || err.message);
            // Mejora el manejo de errores para mostrar detalles de validación del backend si existen
            if (err.response && err.response.data && err.response.data.errors) {
                let errorMessages = '';
                for (const key in err.response.data.errors) {
                    if (err.response.data.errors.hasOwnProperty(key)) {
                        errorMessages += `${key}: ${err.response.data.errors[key].join(', ')}\n`;
                    }
                }
                setError(errorMessages || 'Credenciales inválidas. Por favor, inténtalo de nuevo.');
            } else {
                setError(err.response?.data?.mensaje || 'Credenciales inválidas. Por favor, inténtalo de nuevo.');
            }
        }
    };

    return (
        // Contenedor principal: ocupa toda la altura, fondo oscuro, centrado
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
            {/* Tarjeta del formulario: fondo un poco más claro (o el mismo), bordes redondeados, sombra */}
            <div className="card p-4 shadow-lg bg-dark border border-primary rounded-4" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4 text-primary fw-bold display-5">
                        INICIAR <span className="text-white">SESION</span>
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {/* Campo Email */}
                        <div className="mb-3">
                            <label htmlFor="emailUsuario" className="form-label text-white-50">
                                <FontAwesomeIcon icon={faEnvelope} className="me-2 text-primary" />
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control form-control-lg bg-dark text-white border-primary"
                                id="emailUsuario"
                                value={EmailUsuario}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Campo Contraseña */}
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label text-white-50">
                                <FontAwesomeIcon icon={faLock} className="me-2 text-primary" />
                                Contrasena
                            </label>
                            <input
                                type="password"
                                className="form-control form-control-lg bg-dark text-white border-primary"
                                id="password"
                                value={Password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Mensaje de error */}
                        {error && <div className="alert alert-danger text-center mb-3 border-0 rounded-pill" role="alert">{error}</div>}

                        {/* Botón de Iniciar Sesión: primario, grande, ancho completo, negrita, con sombra */}
                        <button type="submit" className="btn btn-primary btn-lg w-100 mb-3 fw-bold shadow">
                            INICIAR SESION
                        </button>
                    </form>
                    <p className="text-center text-white-50">
                        ..No tienes cuenta? <a href="/register" className="text-primary text-decoration-none fw-bold">RegIstrate aquI</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
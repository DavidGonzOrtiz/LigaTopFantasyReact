// src/components/RegisterPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { RegisterDto } from '../../Types/auth';

import './styles.css'
// Importa FontAwesome si lo estás usando
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

function RegisterPage() {
    const [NombreUsuario, setNombreUsuario] = useState<string>('');
    const [EmailUsuario, setEmailUsuario] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (Password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            const registerData: RegisterDto = { NombreUsuario, EmailUsuario, Password };
            const response = await axios.post('https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/ligatop/autenticacion/registro', registerData);

            setSuccess(response.data?.mensaje || 'Registro exitoso. Ahora puedes iniciar sesión.');
            setNombreUsuario('');
            setEmailUsuario('');
            setPassword('');
            setConfirmPassword('');
            navigate('/login');
        } catch (err: any) {
            console.error('Error durante el registro:', err.response?.data || err.message);

            if (err.response && err.response.data && err.response.data.errors) {
                let errorMessages = '';
                for (const key in err.response.data.errors) {
                    if (err.response.data.errors.hasOwnProperty(key)) {
                        errorMessages += `${key}: ${err.response.data.errors[key].join(', ')}\n`;
                    }
                }
                setError(errorMessages || 'Error de validación desconocido.');
            } else {
                setError(err.response?.data?.mensaje || 'Error al registrar el usuario. Por favor, inténtalo de nuevo.');
            }
        }
    };

    return (
        // Contenedor principal: ocupa toda la altura, fondo oscuro, centrado
        // NOTA: 'bg-dark' aquí se aplica al contenedor del formulario, no al <body>
        // El <body> se oscurecerá con el CSS global de `src/index.css`
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white mt-5">
            {/* Tarjeta del formulario: fondo un poco más claro (o el mismo), bordes redondeados, sombra */}
            <div className="card p-4 shadow-lg bg-dark border border-primary rounded-4" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4 text-primary fw-bold display-5">
                        REGISTRO <span className="text-white">TOP</span>
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {/* Campo Nombre de Usuario */}
                        <div className="mb-3">
                            <label htmlFor="nombreUsuario" className="form-label text-white-50">
                                <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-lg bg-dark text-white border-primary"
                                id="nombreUsuario"
                                value={NombreUsuario}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombreUsuario(e.target.value)}
                                required
                            />
                        </div>

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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailUsuario(e.target.value)}
                                required
                            />
                        </div>

                        {/* Campo Contraseña */}
                        <div className="mb-3">
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

                        {/* Campo Confirmar Contraseña */}
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="form-label text-white-50">
                                <FontAwesomeIcon icon={faLock} className="me-2 text-primary" />
                                Confirmar Contrasena
                            </label>
                            <input
                                type="password"
                                className="form-control form-control-lg bg-dark text-white border-primary"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Mensajes de error/éxito */}
                        {error && <div className="alert alert-danger text-center mb-3 border-0 rounded-pill" role="alert">{error}</div>}
                        {success && <div className="alert alert-success text-center mb-3 border-0 rounded-pill" role="alert">{success}</div>}

                        {/* Botón de registro: primario, grande, ancho completo, negrita, con sombra */}
                        <button type="submit" className="btn btn-primary btn-lg w-100 mb-3 fw-bold shadow">
                            REGISTRARSE
                        </button>
                    </form>
                    <p className="text-center text-white-50">
                        ..Ya tienes cuenta? <a href="/login" className="text-primary text-decoration-none fw-bold">Inicia Sesion aqui</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
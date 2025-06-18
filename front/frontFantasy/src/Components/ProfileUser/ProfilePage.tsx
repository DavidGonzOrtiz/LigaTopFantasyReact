// src/components/ProfilePage.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { UserProfileDto } from '../../Types/auth';

function ProfilePage() {
    const [profileData, setProfileData] = useState<UserProfileDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get<UserProfileDto>('https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/usuario/perfilUsuario');
                setProfileData(response.data);
            } catch (err: any) {
                console.error('Error al obtener el perfil:', err.response?.data || err.message);
                setError(err.response?.data?.mensaje || 'Error al cargar el perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center profile-loading-container"> {/* Clase para centrado y estilos */}
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando perfil...</span>
                </div>
                <p className="ms-3 mt-3 text-light">Cargando perfil...</p> {/* Usamos text-light para visibilidad */}
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error al cargar el perfil</h4>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">Por favor, intente de nuevo más tarde o contacte al soporte.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-5 profile-page-container"> {/* Contenedor principal del perfil */}
            <h1 className="mb-4 text-center fancy-title">Perfil de Usuario</h1> {/* Reutilizamos fancy-title */}

            {profileData ? (
                <div className="card profile-card mb-4"> {/* Clase para la tarjeta principal */}
                    <div className="card-header profile-card-header"> {/* Clase para el encabezado de la tarjeta */}
                        <h2 className="card-title profile-section-title">Información General</h2>
                    </div>
                    <div className="card-body profile-card-body"> {/* Clase para el cuerpo de la tarjeta */}
                        <div className="profile-detail-item"> {/* Clase para cada línea de detalle */}
                            <strong>Nombre de Usuario:</strong> <span className="detail-value">{profileData.nombreUsuario}</span>
                        </div>
                        <div className="profile-detail-item">
                            <strong>Email:</strong> <span className="detail-value">{profileData.emailUsuario}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-warning text-center bg-dark text-white border-warning" role="alert">
                    No se pudo cargar el perfil.
                </div>
            )}

            {profileData && profileData.usuarioLigas.length > 0 && (
                <div className="card profile-card mb-4">
                    <div className="card-header profile-card-header">
                        <h3 className="card-title profile-section-title">Ligas Inscritas</h3>
                    </div>
                    <div className="card-body profile-card-body">
                        <ul className="list-group profile-list-group"> {/* Clase para la lista */}
                            {profileData.usuarioLigas.map((liga, index) => (
                                <li key={index} className="list-group-item profile-list-item"> {/* Clase para cada item de la lista */}
                                    {liga.nombreLiga}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {profileData && profileData.usuarioLigas.length === 0 && (
                <div className="card profile-card mb-4">
                    <div className="card-header profile-card-header">
                        <h3 className="card-title profile-section-title">Ligas Inscritas</h3>
                    </div>
                    <div className="card-body profile-card-body">
                        <p className="text-muted">No estás inscrito en ninguna liga aún.</p> {/* Mantenemos text-muted de Bootstrap si es discreto o lo reemplazamos */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
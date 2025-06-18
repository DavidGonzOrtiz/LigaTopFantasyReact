// src/pages/LigasUsuariosPage.tsx
// ¡RENOMBRA ESTE ARCHIVO A UserLeaguesSection.tsx si solo quieres usarlo como sección!
// O mantenlo como LigasUsuariosPage.tsx y hazlo condicional como se muestra.
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LigaPresupuestoDto } from '../../Types/auth';

interface LigasUsuariosPageProps {
    isEmbedded?: boolean; // Nueva prop para indicar si está incrustado
    refreshTrigger?: number; // Para forzar la recarga desde el componente padre
}

const LigasUsuariosPage: React.FC<LigasUsuariosPageProps> = ({ isEmbedded = false, refreshTrigger }) => {
    const [ligas, setLigas] = useState<LigaPresupuestoDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener las ligas, que puede ser llamada externamente para refrescar
    const fetchLigas = async () => {
        setLoading(true);
        setError(null); // Limpiar errores previos al intentar recargar
        try {
            const API_URL = 'https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/usuario/LigasUsuarios';

            const response = await axios.get<LigaPresupuestoDto[]>(API_URL, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setLigas(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.mensaje || err.message || "Error desconocido al cargar las ligas.";
                setError(errorMessage);
                console.error("Error al obtener las ligas:", err.response?.data || err.message);
            } else {
                setError("Ha ocurrido un error inesperado.");
                console.error("Error inesperado:", err);
            }
        }
    };

    useEffect(() => {
        fetchLigas();
    }, [refreshTrigger]); // Ejecutar fetch cuando se monta y cuando cambia refreshTrigger

    // Contenido de la lista de ligas
    const renderLeagueListContent = () => {
        if (loading) {
            return (
                <div className={`alert alert-info ${isEmbedded ? 'league-list-alert' : ''}`} style={{ textAlign: 'center' }}>
                    Cargando ligas...
                </div>
            );
        }

        if (ligas.length === 0) {
            return (
                <div className={`alert alert-warning ${isEmbedded ? 'league-list-alert' : ''}`} style={{ textAlign: 'center' }}>
                    No estas inscrito en ninguna liga todavia.
                </div>
            );
        }

        if (error) {
            return (
                <div className={`alert alert-danger ${isEmbedded ? 'league-list-alert' : ''}`} style={{ textAlign: 'center' }}>

                </div>
            );
        }

        return (
            <div className="user-leagues-list-container"> {/* Contenedor para la lista, puedes aplicar estilos aquí */}
                <ul className="list-group" style={{ listStyle: 'none', padding: 0 }}>
                    {ligas.map((liga, index) => (
                        <li key={index} className="list-group-item league-item-card" style={{
                            backgroundColor: 'rgba(26, 26, 46, 0.9)', // Fondo más oscuro si está incrustado
                            border: '1px solid #343a40',
                            borderRadius: '8px',
                            marginBottom: '10px',
                            padding: '15px',
                            transition: 'background-color 0.2s ease, transform 0.2s ease',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}>
                            <Link
                                to={`/detalles-liga/${liga.nombreLiga.replace(/\s+/g, '-')}`} // ¡RECUERDA USAR LIGA.ID SI ESTÁ DISPONIBLE!
                                className="text-decoration-none"
                                style={{ color: '#e0e6eb', width: '100%', display: 'block' }}
                            >
                                <div>
                                    <h5 className="mb-1" style={{ color: '#6c9eeb' }}>{liga.nombreLiga}</h5>
                                    <small style={{ color: '#aab6c2' }}>Presupuesto: {liga.presupuesto}</small>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Renderizado condicional/deta
    if (isEmbedded) {
        return (
            <> {/* Fragmento para devolver múltiples elementos sin un div extra */}
                {renderLeagueListContent()}
            </>
        );
    } else {
        // Renderizado como página completa (con su propia "carta")
        return (
            <div className="modal-content-card" style={{ maxWidth: '800px', width: '90%', margin: '40px auto', animation: 'none' }}>
                <div className="modal-header-card">
                    <h2 className="modal-title-card">Mis Ligas</h2>
                </div>
                <div className="modal-body-card">
                    {renderLeagueListContent()}
                </div>
            </div>
        );
    }
};

export default LigasUsuariosPage;
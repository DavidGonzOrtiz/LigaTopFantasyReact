// src/components/Alineacion/AlineacionTitularPage.tsx
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import './AlineacionTitular.css'; // Asegúrate de que esta ruta sea correcta para tus estilos de AlineacionTitular

interface JugadoresTitularesDTO {
    jugadorId: string; // Corregido de 'jugadirId' a 'jugadorId'
    nombreJugador: string;
    posicion: string;
    puntos: number;
}

interface AlineacionTitularPageProps {
    ligaId: string;
    jornada: number | null; // Ahora acepta la jornada como prop
}

const AlineacionTitularPage: React.FC<AlineacionTitularPageProps> = ({ ligaId, jornada }) => {
    const { user, isLoading: authLoading } = useAuth();
    const userId = user?.id;

    const [titulares, setTitulares] = useState<JugadoresTitularesDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const backendBaseUrl = 'https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net'; // Asegúrate de que esta URL base sea correcta

    const fetchTitulares = useCallback(async () => {
        // No intentar cargar si el usuario no está autenticado, la liga no está definida o la autenticación aún está cargando
        if (!userId || !ligaId || authLoading) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Construimos la URL con el parámetro de jornada opcional
            let url = `${backendBaseUrl}/api/usuario/titulares?usuarioId=${userId}&ligaId=${ligaId}`;
            if (jornada !== null) {
                url += `&jornada=${jornada}`;
            }

            console.log("Fetching titulares from URL:", url); // Para depuración

            const response = await axios.get<JugadoresTitularesDTO[]>(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTitulares(response.data);
        } catch (err: any) {
            console.error("Error al cargar los titulares:", err.response?.data || err.message || err);
            if (axios.isAxiosError(err) && err.response?.data) {
                // CAMBIO: Mensaje de error general si el backend no proporciona uno específico
                setError(err.response.data.message || "No hay alineación titular disponible.");
            } else {
                // CAMBIO: Mensaje de error para fallos de red o desconocidos
                setError("No hay alineación titular disponible.");
            }
            setTitulares([]); // Limpiar titulares en caso de error
        } finally {
            setLoading(false);
        }
    }, [userId, ligaId, jornada, authLoading, backendBaseUrl]); // Depende de userId, ligaId, jornada y authLoading

    useEffect(() => {
        fetchTitulares();
    }, [fetchTitulares]); // Llama a fetchTitulares cada vez que cambian sus dependencias

    const posicionOrder: Record<string, number> = {
        Portero: 0,
        Defensa: 1,
        Centrocampista: 2,
        Delantero: 3,
    };

    if (authLoading || loading) {
        return <div className="alineacion-titular-page-container loading-state">Cargando alineación titular...</div>;
    }

    if (error) {
        // Este div mostrará el mensaje "No hay alineación titular disponible." en caso de error
        return <div className="alineacion-titular-page-container error-state" style={{ color: 'red' }}>{error}</div>;
    }

    if (titulares.length === 0) {
        // Este mensaje se muestra cuando la carga fue exitosa pero no hay jugadores
        return (
            <div className="alineacion-titular-page-container no-data-state">
                No se encontraron jugadores titulares para esta liga
                {jornada !== null ? ` en la jornada ${jornada}.` : '.'}
            </div>
        );
    }

    const titularesOrdenados = [...titulares].sort(
        (a, b) => (posicionOrder[a.posicion] ?? 99) - (posicionOrder[b.posicion] ?? 99)
    );

    return (
        <div className="alineacion-titular-page-container">
            {/* Título dinámico para reflejar la jornada */}
            <h1>Alineación Titular {jornada !== null ? `(Jornada ${jornada})` : '(Actual)'}</h1>

            <div className="campo-futbol">
                {['Portero', 'Defensa', 'Centrocampista', 'Delantero'].map((posicion) => {
                    const jugadoresPorPosicion = titularesOrdenados.filter(j => j.posicion === posicion);
                    if (jugadoresPorPosicion.length === 0) return null;

                    return (
                        <div key={posicion} className={`linea linea-${posicion.toLowerCase()}`}>
                            {jugadoresPorPosicion.map(jugador => (
                                <div key={jugador.jugadorId} className="jugador-titular"> {/* Usar jugadorId */}
                                    <p className="jugador-nombre">{jugador.nombreJugador}</p>
                                    <p className="jugador-posicion">Posición: {jugador.posicion}</p>
                                    <p className="jugador-puntos">Puntos: {jugador.puntos}</p>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AlineacionTitularPage;

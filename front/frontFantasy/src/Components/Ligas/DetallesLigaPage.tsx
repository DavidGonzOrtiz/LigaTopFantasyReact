// src/pages/LeagueDetailsPage.tsx
import './DetallesLigaPage.css';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';

import type {
    PlayerDisplayData,
    LigaDetallesDto,
} from '../../Types/auth';

import PlayerCardDisplay from '../Jugadores/PlayerCardDisplay';
import AlineacionTitularPage from '../Alineacion/AlineacionTitularPage';
import ShareLigaButton from './CompartirLiga';

const LeagueDetailsPage: React.FC = () => {
    const { leagueNameUrl } = useParams<{ leagueNameUrl: string }>();
    const leagueName = leagueNameUrl ? leagueNameUrl.replace(/-/g, ' ') : '';

    const { user, isLoading: authLoading } = useAuth();
    const userId = user?.id;

    const [leagueDetails, setLeagueDetails] = useState<LigaDetallesDto | null>(null);
    const [userPlayers, setUserPlayers] = useState<PlayerDisplayData[]>([]);
    const [allJornadas, setAllJornadas] = useState<number[]>([]);
    const [selectedJornada, setSelectedJornada] = useState<number | null>(null);

    const [loadingLeague, setLoadingLeague] = useState<boolean>(true);
    const [loadingPlayers, setLoadingPlayers] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const backendBaseUrl = 'https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net';

    // --- Fetch plantilla del usuario en liga y jornada ---
    const fetchUserPlayers = useCallback(async (currentUserId: string, ligaId: string, jornada: number | null) => {
        setLoadingPlayers(true);
        setError(null);
        try {
            let API_URL = `${backendBaseUrl}/api/usuario/${currentUserId}/ligas/${ligaId}/plantilla`;
            if (jornada !== null) {
                API_URL += `?jornada=${jornada}`;
            }
            const response = await axios.get<PlayerDisplayData[]>(API_URL, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUserPlayers(response.data);
        } catch (err) {
            console.error("Error al obtener los jugadores del usuario:", err);
            setError("Error al cargar tu plantilla.");
            setUserPlayers([]);
        } finally {
            setLoadingPlayers(false);
        }
    }, [backendBaseUrl]);

    // --- Fetch detalles de la liga (incluye clasificación y jornadas) ---
    useEffect(() => {
        const fetchLeagueData = async () => {
            if (authLoading) {
                setLoadingLeague(true);
                return;
            }

            if (!userId) {
                setError("No se pudo obtener el ID de usuario. Por favor, inicia sesión.");
                setLoadingLeague(false);
                return;
            }

            if (!leagueName) {
                setError("Nombre de liga no especificado.");
                setLoadingLeague(false);
                return;
            }

            setLoadingLeague(true);
            setError(null);

            try {
                const leagueDetailsAPI_URL = `${backendBaseUrl}/api/usuario/ligas/${encodeURIComponent(leagueName)}/detalles?usuarioId=${userId}`;
                const detailsResponse = await axios.get<LigaDetallesDto>(leagueDetailsAPI_URL, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                setLeagueDetails(detailsResponse.data);

                if (detailsResponse.data.jornadasDisponibles && detailsResponse.data.jornadasDisponibles.length > 0) {
                    setAllJornadas(detailsResponse.data.jornadasDisponibles);
                    const latestJornada = Math.max(...detailsResponse.data.jornadasDisponibles);
                    setSelectedJornada(latestJornada); // Selecciona la última jornada por defecto

                    if (detailsResponse.data.ligaId) {
                        await fetchUserPlayers(userId, detailsResponse.data.ligaId, latestJornada);
                    }
                } else {
                    // No hay jornadas disponibles: carga plantilla sin filtro de jornada
                    setAllJornadas([]);
                    setSelectedJornada(null);
                    if (detailsResponse.data.ligaId) {
                        await fetchUserPlayers(userId, detailsResponse.data.ligaId, null);
                    }
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const errorMessage = err.response?.data?.mensaje || err.message || "Error desconocido al cargar los detalles de la liga.";
                    setError(errorMessage);
                    console.error("Error al obtener los detalles de la liga:", err.response?.data || err.message);
                } else {
                    setError("Ha ocurrido un error inesperado al cargar la liga.");
                    console.error("Error inesperado:", err);
                }
            } finally {
                setLoadingLeague(false);
            }
        };

        fetchLeagueData();
    }, [leagueNameUrl, userId, leagueName, fetchUserPlayers, authLoading, backendBaseUrl]);

    // --- Cuando cambia la jornada seleccionada, recargar plantilla ---
    useEffect(() => {
        if (userId && leagueDetails?.ligaId) {
            fetchUserPlayers(userId, leagueDetails.ligaId, selectedJornada);
        }
    }, [selectedJornada, userId, leagueDetails?.ligaId, fetchUserPlayers]);

    // --- Renderizado ---
    if (loadingLeague || authLoading) {
        return (
            <div className="league-details-page-container loading-state">
                <div className="league-details-card">Cargando detalles de la liga...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="league-details-page-container error-state">
                <div className="league-details-card">
                    <div className="alert alert-danger" style={{ textAlign: 'center' }}>{error}</div>
                </div>
            </div>
        );
    }

    if (!leagueDetails) {
        return (
            <div className="league-details-page-container no-data-state">
                <div className="league-details-card">
                    <div className="alert alert-warning" style={{ textAlign: 'center' }}>
                        No se encontraron detalles para esta liga.
                    </div>
                </div>
            </div>
        );
    }

    const currentUserPoints = leagueDetails.puntosActualesUsuario;
    const alineacionPageUrl = `/ligas/${leagueDetails.ligaId}/alineacion`;


    const handleSimularPuntos = async () => {
        if (!leagueDetails?.ligaId || !userId) {
            alert("Faltan datos para simular puntos.");
            return;
        }

        const jornadaGuid = leagueDetails.jornadasDisponibles[0]; // Solo una jornada
        if (!jornadaGuid) {
            alert("No se encontró el ID de la jornada.");
            return;
        }

        try {
            const jornadaGuid = "b6b306c4-451d-4c1e-a87b-8ec198a6b50e"; // El GUID real de la jornada
            const ligaId = leagueDetails?.ligaId;
            const response = await axios.post(
                'https://localhost:7079/api/administrador/simular-puntos',
                {
                    jornadaId: jornadaGuid,
                    ligaid: ligaId,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );


            const puntosSimulados = response.data?.puntosTotales ?? 0;
            alert(`Simulación completada. Puntos estimados: ${puntosSimulados}`);
        } catch (error) {
            console.error("Error al simular puntos:", error);
            alert("No se pudo simular los puntos. Intenta más tarde.");
        }
    };

    return (
        <div className="league-details-page-container">
            <div className="league-details-card">
                <h1 className="league-title">{leagueDetails.nombreLiga}</h1>
                <p className="my-points">Mis puntos actuales: <strong>{currentUserPoints}</strong></p>

                <ShareLigaButton
                    ligaId={leagueDetails.ligaId}
                    backendBaseUrl={backendBaseUrl}
                // Add Bootstrap classes to your ShareLigaButton if it's a simple button
                // For example, if it renders a <button> internally:
                // className="btn btn-secondary btn-lg"
                />

                {/* Main Action Buttons Group */}
                <div className="league-actions-group">
                    <Link to={alineacionPageUrl} className="btn btn-primary btn-sm m-1">
                        Gestionar Alineación
                    </Link>

                    <Link to={`/mercado/${leagueDetails.ligaId}`} className="btn btn-primary btn-sm m-1">
                        Ir al Mercado
                    </Link>

                    <button className="btn btn-primary btn-sm m-1" onClick={handleSimularPuntos}>
                        Simular Puntos
                    </button>

                </div>
                {/* ShareLigaButton is now part of the group, styled with Bootstrap secondary if applicable */}


                <div className="content-columns">
                    <div className="ranking-column">
                        <h2>Clasificación</h2>
                        {leagueDetails.clasificacionUsuarios && leagueDetails.clasificacionUsuarios.length > 0 ? (
                            <ul className="ranking-list">
                                {leagueDetails.clasificacionUsuarios.map((rankingItem, index) => (
                                    <li key={index} className="ranking-item">
                                        <span className="ranking-position">{index + 1}.</span>
                                        <Link
                                            to={`/ligas/${leagueDetails.ligaId}/plantilla/${encodeURIComponent(rankingItem.nombreUsuario)}`}
                                            className="ranking-username-link"
                                            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                        >
                                            {rankingItem.nombreUsuario}
                                        </Link>
                                        <span className="ranking-score">{rankingItem.puntuacionTotal} pts</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-data-message">No hay datos de clasificación aún.</p>
                        )}
                    </div>

                    <div className="my-players-column">
                        <h2>Mi Plantilla</h2>
                        <div className="jornada-filter-controls">
                            <label htmlFor="jornada-select">Jornada:</label>
                            <select
                                id="jornada-select"
                                className="jornada-dropdown"
                                value={selectedJornada === null ? '' : selectedJornada.toString()}
                                onChange={(e) => setSelectedJornada(e.target.value === '' ? null : Number(e.target.value))}
                                disabled={allJornadas.length === 0 || loadingPlayers}
                            >
                                <option value="">Todas las jornadas</option>
                                {allJornadas.map(jornada => (
                                    <option key={jornada} value={jornada}>{`Jornada ${jornada}`}</option>
                                ))}
                            </select>
                        </div>

                        {loadingPlayers ? (
                            <p className="no-data-message">Cargando plantilla...</p>
                        ) : userPlayers.length === 0 ? (
                            <p className="no-data-message">No se encontraron jugadores para esta jornada o no has formado tu plantilla aún.</p>
                        ) : (
                            <div className="player-list-container">
                                <div className="player-cards-grid">
                                    {userPlayers.map(player => (
                                        <PlayerCardDisplay key={player.jugadorId} player={player} isVisible={true} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Columna de Mi Plantilla titular */}
                    {/* PASAMOS selectedJornada como prop */}
                    <div className="league-details-card">
                        {leagueDetails.ligaId && (
                            <AlineacionTitularPage
                                ligaId={leagueDetails.ligaId}
                                jornada={selectedJornada} // <--- CAMBIO AQUÍ
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeagueDetailsPage;
// src/components/Alineacion/AlineacionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';
import './AlineacionPage.css';

interface JugadorPorPosicionDTO {
    jugadorId: number;
    nombreJugador: string;
    posicion: string;
    nombreEquipo: string;
    esTitular: boolean;
}

interface AlineacionDTO {
    plantillaId?: string;
    titulares: number[];
    tipoAlineacion: string;
}

interface JugadoresAgrupados {
    [posicion: string]: JugadorPorPosicionDTO[];
}

const AlineacionPage: React.FC = () => {
    const { ligaId } = useParams<{ ligaId: string }>();
    const { user, isLoading: authLoading } = useAuth();
    const userId = user?.id;

    const [jugadoresPlantilla, setJugadoresPlantilla] = useState<JugadoresAgrupados>({});
    const [selectedFormation, setSelectedFormation] = useState<string>('');
    const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    interface Jugador {
        jugadorId: number;
        nombreJugador: string;
        precioJugador: number;
        nacionalidad: string;
        nombreEquipo: string;
        puntosJugador: number;
        posicion: string;
        equipoId: number;
    }

    const [plantilla, setPlantilla] = useState<Jugador[]>([]);

    const obtenerPlantillaId = async (userIdParam: string, ligaIdParam: string): Promise<string | null> => {
        try {
            console.log(`Llamando obtenerPlantillaId con ligaId: ${ligaIdParam} y userId: ${userIdParam}`);
            const response = await axios.get(`https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/usuario/plantillaId?usuarioId=${userIdParam}&ligaId=${ligaIdParam}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("Respuesta obtenerPlantillaId:", response.data);
            // response.data es directamente el string del GUID
            const plantillaId = response.data;
            if (!plantillaId) {
                console.warn("No se encontró plantillaId en la respuesta");
                return null;
            }
            return plantillaId;
        } catch (error) {
            console.error("Error en obtenerPlantillaId:", error);
            return null;
        }
    };
    useEffect(() => {
        if (!userId || !ligaId) {
            console.warn("Usuario o ligaId no definidos.");
            setError("Usuario no autenticado o ID de liga no especificado.");
            setLoading(false);
            return;
        }

        const fetchPlantilla = async () => {
            try {
                console.log(`Obteniendo plantilla para usuario ${userId} en liga ${ligaId}`);
                const response = await axios.get<Jugador[]>(
                    `https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/usuario/${userId}/ligas/${ligaId}/plantilla`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                console.log("Respuesta plantilla:", response.data);
                setPlantilla(response.data);
            } catch (err) {
                console.error('Error al obtener plantilla:', err);
                setError("No se pudo cargar la Plantilla para esta liga. Asegúrate de que el usuario tiene una plantilla activa.");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && userId && ligaId) {
            fetchPlantilla();
        }
    }, [authLoading, userId, ligaId]);

    const agruparPorPosicion = (jugadores: JugadorPorPosicionDTO[]): JugadoresAgrupados => {
        const ordenPosiciones = ['Portero', 'Defensa', 'Centrocampista', 'Delantero'];
        const grouped: JugadoresAgrupados = {};

        // Inicializar con el orden deseado
        ordenPosiciones.forEach(pos => {
            grouped[pos] = [];
        });

        // Llenar los grupos con los jugadores
        jugadores.forEach(jugador => {
            if (grouped[jugador.posicion]) {
                grouped[jugador.posicion].push(jugador);
            } else {
                // Si hay una posición que no está en nuestro orden predefinido, la añadimos al final
                if (!Object.prototype.hasOwnProperty.call(grouped, jugador.posicion)) {
                    grouped[jugador.posicion] = [];
                }
                grouped[jugador.posicion].push(jugador);
            }
        });
        return grouped;
    };

    useEffect(() => {
        if (plantilla.length > 0) {
            const jugadoresPorPosicion = agruparPorPosicion(
                plantilla.map(j => ({
                    jugadorId: j.jugadorId,
                    nombreJugador: j.nombreJugador,
                    posicion: j.posicion,
                    nombreEquipo: j.nombreEquipo,
                    esTitular: false,
                }))
            );
            setJugadoresPlantilla(jugadoresPorPosicion);
        } else {
            setJugadoresPlantilla({});
        }
    }, [plantilla]);

    const handlePlayerSelection = (jugadorId: number) => {
        setSelectedPlayers(prevSelected => {
            if (prevSelected.includes(jugadorId)) {
                return prevSelected.filter(id => id !== jugadorId);
            } else {
                if (prevSelected.length < 11) {
                    return [...prevSelected, jugadorId];
                } else {
                    setMessage('Ya has seleccionado el máximo de 11 jugadores titulares.');
                    setTimeout(() => setMessage(null), 3000);
                    return prevSelected;
                }
            }
        });
    };
    const isPlayerSelected = (jugadorId: number) => selectedPlayers.includes(jugadorId);

    const handleSubmitAlineacion = async () => {
        setMessage(null);
        setError(null);

        if (!selectedFormation) {
            setError("Por favor, selecciona un tipo de alineación.");
            return;
        }

        if (selectedPlayers.length !== 11) {
            setError(`Debes seleccionar exactamente 11 jugadores titulares. (Actualmente: ${selectedPlayers.length})`);
            return;
        }

        if (!ligaId) {
            setError("ID de liga no disponible.");
            return;
        }

        if (!userId) {
            setError("Usuario no autenticado.");
            return;
        }

        setLoading(true);
        console.log("Iniciando envío de alineación...");

        const plantillaId = await obtenerPlantillaId(userId, ligaId);
        console.log("plantillaId obtenido:", plantillaId);
        if (!plantillaId) {
            setError("No se pudo obtener la plantilla del usuario.");
            setLoading(false);
            return;
        }

        const alineacionData: AlineacionDTO = {
            plantillaId,
            titulares: selectedPlayers,
            tipoAlineacion: selectedFormation,
        };

        console.log("Datos a enviar en alineación:", alineacionData);

        try {
            const response = await axios.post(
                'https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/usuario/alineacion/guardar',
                alineacionData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            console.log("Respuesta del servidor:", response);
            setMessage("Alineación guardada correctamente.");
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                console.error("Error al guardar alineación (Axios):", err.response?.data);
                setError(err.response?.data || "Error desconocido del servidor.");
            } else {
                console.error("Error desconocido al guardar alineación:", err);
                setError("Error al guardar la alineación. Inténtalo de nuevo.");
            }
        } finally {
            setLoading(false);
            setTimeout(() => {
                setMessage(null);
                setError(null);
            }, 5000);
        }
    };


    if (loading && plantilla.length === 0) {
        return <div className="alineacion-container loading-state">Cargando datos de la plantilla...</div>;
    }

    if (error && plantilla.length === 0) {
        return (
            <div className="alineacion-container error-state">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    if (!loading && plantilla.length === 0) {
        return (
            <div className="alineacion-container no-data-state">
                <div className="alert alert-warning">No se encontró una plantilla válida para este usuario en la liga actual.</div>
            </div>
        );
    }

    const orderedPositions = ['Portero', 'Defensa', 'Centrocampista', 'Delantero'];

    return (
        <div className="alineacion-container">
            <h1 className="page-title">Crear / Editar Alineación</h1>

            {loading && plantilla.length > 0 && (
                <div className="loading-players-state">Cargando jugadores...</div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <div className="alineacion-card">
                <div className="form-controls">
                    <div className="form-group">
                        <label htmlFor="formation-select">Selecciona Formación:</label>
                        <select
                            id="formation-select"
                            value={selectedFormation}
                            onChange={(e) => setSelectedFormation(e.target.value)}
                        >
                            <option value="">-- Selecciona --</option>
                            <option value="433">4-3-3</option>
                            <option value="442">4-4-2</option>
                        </select>
                    </div>
                </div>

                {Object.keys(jugadoresPlantilla).length === 0 && !loading && (
                    <div>No hay jugadores para mostrar en tu plantilla.</div>
                )}

                {orderedPositions.map(posicion => {
                    const jugadores = jugadoresPlantilla[posicion];
                    if (!jugadores || jugadores.length === 0) return null; // No renderizar si no hay jugadores para esa posición

                    return (
                        <div key={posicion} className="posicion-section">
                            <h3>{posicion}</h3>
                            <div className="jugadores-cards-container">
                                {jugadores.map(jugador => (
                                    <div key={jugador.jugadorId} className={`jugador-card ${isPlayerSelected(jugador.jugadorId) ? 'selected' : ''}`}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={isPlayerSelected(jugador.jugadorId)}
                                                onChange={() => handlePlayerSelection(jugador.jugadorId)}
                                                disabled={
                                                    !isPlayerSelected(jugador.jugadorId) && selectedPlayers.length >= 11
                                                }
                                            />
                                            <div className="jugador-info">
                                                <h4>{jugador.nombreJugador}</h4>
                                                <p>{jugador.nombreEquipo}</p>
                                                <p>{jugador.posicion}</p>
                                                {isPlayerSelected(jugador.jugadorId) && <span className="titular-badge">Titular</span>}
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                <div className="button-container">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-outline-light btn-back"
                    >
                        Atrás
                    </button>

                    <button
                        className="btn btn-primary btn-submit"
                        onClick={handleSubmitAlineacion}
                        disabled={loading}
                    >
                        Guardar Alineación
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlineacionPage;
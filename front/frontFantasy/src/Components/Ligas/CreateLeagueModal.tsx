// src/components/Ligas/CreateLeagueModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateLeagueModal.css';
import PlayerCardDisplay from '../Jugadores/PlayerCardDisplay';
// Importa PlayerDisplayData y Asegúrate de que CrearLigaResponseDto incluye ligaId
import type { PlayerDisplayData, CrearLigaResponseDto } from '../../Types/auth';
import { useAuth } from '../../Context/AuthContext';

// --- AJUSTE: Actualizar el tipo CrearLigaResponseDto si aún no incluye 'ligaId' ---
// (Si ya lo tienes definido en Types/auth.ts, solo asegúrate de que tiene 'ligaId: string;')
// Ejemplo de cómo debería ser en Types/auth.ts:
// export interface CrearLigaResponseDto {
//     exito: boolean;
//     mensaje: string;
//     ligaId: string; // <-- Asegúrate de que esta propiedad exista
// }

interface CreateLeagueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLeagueCreated: (success: boolean, message: string) => void;
}

const CreateLeagueModal: React.FC<CreateLeagueModalProps> = ({ isOpen, onClose, onLeagueCreated }) => {
    const { token, user } = useAuth();
    const [leagueName, setLeagueName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [assignedPlayers, setAssignedPlayers] = useState<PlayerDisplayData[]>([]);
    const [displayedPlayers, setDisplayedPlayers] = useState<PlayerDisplayData[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [showPlayersSequence, setShowPlayersSequence] = useState<boolean>(false);
    // --- NUEVO ESTADO PARA ALMACENAR EL ID DE LA LIGA CREADA ---
    const [_, setCurrentLeagueId] = useState<string | null>(null);


    // --- LOGS DE DEPURACIÓN IMPORTANTES ---
    console.log('--- Render CreateLeagueModal ---');
    console.log('isOpen:', isOpen);
    console.log('States: assignedPlayers.length:', assignedPlayers.length, 'displayedPlayers.length:', displayedPlayers.length, 'currentIndex:', currentIndex, 'showPlayersSequence:', showPlayersSequence);
    // --- FIN LOGS DE DEPURACIÓN ---

    // Reiniciar el estado cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            console.log('Modal opened, resetting state...');
            setLeagueName('');
            setLoading(false);
            setError(null);
            setSuccessMessage(null);
            setAssignedPlayers([]);
            setDisplayedPlayers([]);
            setCurrentIndex(0);
            setShowPlayersSequence(false);
            setCurrentLeagueId(null); // --- REINICIAR EL ID DE LA LIGA CREADA ---
        }
    }, [isOpen]);

    // Lógica para mostrar jugadores uno por uno
    useEffect(() => {
        console.log('--> Player sequence useEffect triggered. Current state:', { showPlayersSequence, assignedPlayersLength: assignedPlayers.length, currentIndex });

        // Si la secuencia debe mostrarse, hay jugadores asignados y aún no se han mostrado todos
        if (showPlayersSequence && assignedPlayers.length > 0 && currentIndex < assignedPlayers.length) {
            console.log(`Setting timeout to display player ${currentIndex + 1} (${assignedPlayers[currentIndex]?.nombreJugador})...`);
            const timer = setTimeout(() => {
                setDisplayedPlayers((prevPlayers) => {
                    const newPlayers = [...prevPlayers, assignedPlayers[currentIndex]];
                    console.log('  -> displayedPlayers updated. New count:', newPlayers.length);
                    return newPlayers;
                });
                setCurrentIndex((prevIndex) => {
                    const newIndex = prevIndex + 1;
                    console.log('  -> currentIndex updated to:', newIndex);
                    return newIndex;
                });
            }, 700); // Retraso de 700ms entre cada jugador

            return () => {
                console.log('  -> Clearing timeout for player sequence.');
                clearTimeout(timer);
            };
        } else if (showPlayersSequence && currentIndex >= assignedPlayers.length && assignedPlayers.length > 0) {
            // Cuando todos los jugadores se han mostrado
            console.log('--> All players displayed. Finalizing sequence.');
            setSuccessMessage("¡Tu plantilla inicial está lista! Prepárate para la acción.");
        }
    }, [showPlayersSequence, assignedPlayers, currentIndex]);


    // --- AJUSTE: fetchPlayersForUser ahora toma ligaId ---
    const fetchPlayersForUser = async (ligaId: string) => {
        if (!token) {
            setError('No autenticado. Por favor, inicia sesión.');
            console.error('fetchPlayersForUser: No token available.');
            return;
        }
        try {
            console.log('### Fetching players from miPlantilla API for ligaId:', ligaId);
            // --- AJUSTE: Cambiar la URL para incluir ligaId ---
            const response = await axios.get<PlayerDisplayData[]>(`https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/usuario/miPlantilla/${ligaId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('### Players fetched successfully. Response data:', response.data);
            setAssignedPlayers(response.data || []); // Asegúrate de que esto sea un array, aunque esté vacío.

            // Solo inicia la secuencia si realmente hay jugadores
            if (response.data && response.data.length > 0) {
                setShowPlayersSequence(true); // Inicia la visualización de jugadores
                setCurrentIndex(0); // Asegúrate de que currentIndex se resetea a 0
            } else {
                setSuccessMessage("Liga creada, pero no se asignaron jugadores. Contacta al soporte o inténtalo de nuevo.");
                console.warn("No players assigned after league creation by miPlantilla endpoint.");
            }
        } catch (err: any) {
            console.error('### Error al obtener jugadores de la plantilla:', err.response?.data || err.message);
            setError(err.response?.data?.mensaje || err.message || 'Error al cargar los jugadores de la plantilla.');
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);
        setAssignedPlayers([]); // Limpiar jugadores previos
        setDisplayedPlayers([]); // Limpiar jugadores mostrados previamente
        setCurrentIndex(0); // Reiniciar el índice
        setShowPlayersSequence(false); // Ocultar la secuencia de jugadores inicialmente
        setCurrentLeagueId(null); // --- REINICIAR EL ID DE LA LIGA CREADA ---

        if (!leagueName.trim()) {
            setError('El nombre de la liga no puede estar vacío.');
            setLoading(false);
            return;
        }

        if (!token || !user?.id) {
            setError('No autenticado. Por favor, inicia sesión.');
            setLoading(false);
            onLeagueCreated(false, 'No autenticado.');
            return;
        }

        try {
            console.log('### Submitting league creation for:', leagueName);
            const createLeagueResponse = await axios.post<CrearLigaResponseDto>('https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/usuario/CrearLiga', {
                nombreLiga: leagueName,
                userId: user.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (createLeagueResponse.data.exito) {
                console.log('### Liga created successfully. Message:', createLeagueResponse.data.mensaje);
                // --- AJUSTE: Capturar el ligaId de la respuesta ---
                const createdLigaId = createLeagueResponse.data.ligaId;
                if (createdLigaId) {
                    setCurrentLeagueId(createdLigaId); // Guardar el ID de la liga
                    setSuccessMessage('Liga creada. Obteniendo y asignando jugadores...');
                    onLeagueCreated(true, 'Liga creada con éxito.');
                    // --- AJUSTE: Llama a la función para obtener jugadores con el ligaId ---
                    await fetchPlayersForUser(createdLigaId);
                } else {
                    console.error('### Liga creada exitosamente, pero no se recibió un ligaId de la respuesta.');
                    setError('Liga creada, pero no se pudo obtener el ID de la liga para asignar jugadores.');
                    onLeagueCreated(false, 'Liga creada, pero ID no encontrado.');
                }
            } else {
                console.error('### Error creating league (backend response):', createLeagueResponse.data.mensaje);
                setError(createLeagueResponse.data.mensaje || 'Hubo un problema al crear la liga.');
                onLeagueCreated(false, createLeagueResponse.data.mensaje || 'Hubo un problema al crear la liga.');
            }
        } catch (err: any) {
            console.error('### Error in handleSubmit (creating league API call):', err.response?.data || err.message);
            const errorMessage = err.response?.data?.mensaje || err.message || 'Error desconocido al crear la liga.';
            setError(errorMessage);
            onLeagueCreated(false, errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-card modal-large-size">
                <div className="modal-header-card">
                    <h2 className="modal-title-card">Crear Nueva Liga</h2>
                    <button className="modal-close-button-card" onClick={onClose} disabled={loading || (showPlayersSequence && currentIndex < assignedPlayers.length)}>
                        &times;
                    </button>
                </div>
                <div className="modal-body-card">
                    {error && <div className="alert alert-danger mb-3">{error}</div>}
                    {successMessage && <div className="alert alert-success mb-3">{successMessage}</div>}

                    {/* Renderizado condicional: muestra el formulario O el área de visualización de jugadores */}
                    {assignedPlayers.length === 0 && !showPlayersSequence ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group-card mb-4">
                                <label htmlFor="leagueName" className="form-label-card">Nombre de la Liga:</label>
                                <input
                                    type="text"
                                    id="leagueName"
                                    className="form-control-card"
                                    value={leagueName}
                                    onChange={(e) => setLeagueName(e.target.value)}
                                    placeholder="Ej. Liga Fantástica de Verano"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div className="modal-footer-card">
                                <button
                                    type="button"
                                    className="btn btn-secondary-card-modal me-3"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary-card-modal"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="ms-2">Creando Liga...</span>
                                        </>
                                    ) : (
                                        'Crear Liga'
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // Contenido para mostrar jugadores (visible después de la creación de la liga y la obtención)
                        <div>
                            <p className="text-center text-light mb-4">
                                {showPlayersSequence && currentIndex < assignedPlayers.length ?
                                    "¡Felicidades! Se ha creado tu liga. Asignando jugadores a tu plantilla inicial:" :
                                    "¡Tu plantilla inicial está lista! Prepárate para la acción."
                                }
                            </p>
                            <div className="player-display-area">
                                {/* --- AJUSTE: Usar key={`${player.jugadorId}-${index}`} para evitar errores de React --- */}
                                {displayedPlayers.map((player, index) => (
                                    <PlayerCardDisplay key={`${player.jugadorId}-${index}`} player={player} isVisible={true} />
                                ))}
                                {showPlayersSequence && currentIndex < assignedPlayers.length && (
                                    <div className="text-center mt-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Cargando jugadores...</span>
                                        </div>
                                        <p className="text-muted mt-2">Cargando jugador {currentIndex + 1} de {assignedPlayers.length}...</p>
                                    </div>
                                )}
                            </div>
                            {/* Botón para cerrar el modal una vez que se han mostrado todos los jugadores */}
                            {currentIndex >= assignedPlayers.length && assignedPlayers.length > 0 && (
                                <div className="modal-footer-card mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-primary-card-modal"
                                        onClick={onClose}
                                    >
                                        Entendido
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateLeagueModal;
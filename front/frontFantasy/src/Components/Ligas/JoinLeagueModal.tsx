import axios from 'axios';
import { type FC, useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import type { JoinLeagueResponseDto, PlayerDisplayData } from '../../Types/auth'; // <--- CAMBIO AQUÍ: Importa UnirseALigaResponse
import PlayerCardDisplay from '../Jugadores/PlayerCardDisplay'; // Asegúrate de que la ruta sea correcta
import './CreateLeagueModal.css'; // Reutilizamos el CSS (asegúrate de que la ruta sea correcta)

// Eliminamos la definición duplicada de JoinLeagueResponseDto ya que usaremos UnirseALigaResponse
// interface JoinLeagueResponseDto {
//     exito: boolean;
//     mensaje: string;
//     ligaId: string;
//     codigoUnico?: string;
// }

interface JoinLeagueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLeagueJoined: (success: boolean, message: string) => void;
}

const JoinLeagueModal: FC<JoinLeagueModalProps> = ({ isOpen, onClose, onLeagueJoined }) => {
    const { user, token } = useAuth();
    const [leagueCode, setLeagueCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // --- NUEVOS ESTADOS PARA LA VISUALIZACIÓN DE JUGADORES (Copiados de CreateLeagueModal) ---
    const [assignedPlayers, setAssignedPlayers] = useState<PlayerDisplayData[]>([]);
    const [displayedPlayers, setDisplayedPlayers] = useState<PlayerDisplayData[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [showPlayersSequence, setShowPlayersSequence] = useState<boolean>(false);
    // --- FIN NUEVOS ESTADOS ---

    // Reiniciar el estado cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setLeagueCode('');
            setIsLoading(false);
            setError(null);
            setSuccessMessage(null);
            setAssignedPlayers([]);
            setDisplayedPlayers([]);
            setCurrentIndex(0);
            setShowPlayersSequence(false);
            console.log('Join League Modal opened, resetting state...');
        }
    }, [isOpen]);

    // Lógica para mostrar jugadores uno por uno (Copiada de CreateLeagueModal)
    useEffect(() => {
        console.log('--> Join League Player sequence useEffect triggered. Current state:', { showPlayersSequence, assignedPlayersLength: assignedPlayers.length, currentIndex });

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
            }, 700); // Retraso entre jugadores

            return () => {
                console.log('  -> Clearing timeout for player sequence.');
                clearTimeout(timer);
            };
        } else if (showPlayersSequence && currentIndex >= assignedPlayers.length && assignedPlayers.length > 0) {
            console.log('--> All players displayed. Finalizing sequence for Join League.');
            setSuccessMessage("¡Te has unido a la liga y tu plantilla inicial está lista!");
        } else if (showPlayersSequence && assignedPlayers.length === 0 && currentIndex === 0) {
            // Caso donde showPlayersSequence es true pero no hay jugadores
            setSuccessMessage("Te has unido a la liga, pero no se asignaron jugadores. Contacta al soporte.");
        }
    }, [showPlayersSequence, assignedPlayers, currentIndex]);


    // Función para obtener los jugadores (Copiada de CreateLeagueModal)
    const fetchPlayersForUser = async (ligaId: string) => {
        if (!token) {
            setError('No autenticado. Por favor, inicia sesión.');
            console.error('fetchPlayersForUser (Join League): No token available.');
            return;
        }
        try {
            console.log('### Fetching players from miPlantilla API for ligaId (Join League):', ligaId);
            const response = await axios.get<PlayerDisplayData[]>(`https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/usuario/miPlantilla/${ligaId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('### Players fetched successfully (Join League). Response data:', response.data);
            setAssignedPlayers(response.data || []);

            if (response.data && response.data.length > 0) {
                setShowPlayersSequence(true);
                setCurrentIndex(0);
            } else {
                setSuccessMessage("Te has unido a la liga, pero no se asignaron jugadores. Contacta al soporte o inténtalo de nuevo.");
                console.warn("No players assigned after joining league by miPlantilla endpoint.");
            }
        } catch (err: any) {
            console.error('### Error al obtener jugadores de la plantilla (Join League):', err.response?.data || err.message);
            setError(err.response?.data?.mensaje || err.message || 'Error al cargar los jugadores de la plantilla después de unirte.');
        }
    };


    const handleJoin = async () => {
        if (!user || !token) {
            setError("Debes iniciar sesión para unirte a una liga.");
            return;
        }
        if (!leagueCode.trim()) {
            setError("Por favor, introduce un código de liga.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        setAssignedPlayers([]); // Limpiar estados de jugadores al iniciar
        setDisplayedPlayers([]);
        setCurrentIndex(0);
        setShowPlayersSequence(false);

        try {
            const API_URL = 'https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/usuario/InscribirUsuariosLiga';
            console.log('Attempting to join league with code:', leagueCode);
            // USAMOS TU INTERFACE: UnirseALigaResponse
            const response = await axios.post<JoinLeagueResponseDto>(
                API_URL,
                { codigoUnico: leagueCode },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // La respuesta de tu backend SIEMPRE debería tener `exito: true/false` y `mensaje`.
            // También `ligaId` si el éxito es `true`.
            if (response.status === 200 && response.data.exito) {
                const message = response.data?.mensaje || 'Te has unido a la liga exitosamente.';
                setSuccessMessage(message);
                onLeagueJoined(true, message); // Notifica al componente padre

                // --- CAPTURAR LIGAID Y DISPARAR FETCH DE JUGADORES ---
                const joinedLigaId = response.data.ligaId;
                if (joinedLigaId) {
                    setSuccessMessage('¡Te has unido a la liga! Obteniendo y asignando jugadores...');
                    await fetchPlayersForUser(joinedLigaId);
                } else {
                    console.error('### Liga unida exitosamente, pero no se recibió un ligaId de la respuesta.');
                    setError('Te uniste a la liga, pero no se pudo obtener el ID para asignar jugadores.');
                }
                // --- FIN CAPTURA LIGAID ---

                setLeagueCode(''); // Limpiar el input después de unirse
            } else {
                // Si el backend devuelve 200 pero Exito es false
                const message = response.data?.mensaje || 'Error desconocido al unirse a la liga.';
                setError(message);
                onLeagueJoined(false, message);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // Esto maneja errores como 400, 401, 500 del backend
                const errorMessage = err.response?.data?.mensaje || err.message || 'Error al unirse a la liga.';
                setError(errorMessage);
                onLeagueJoined(false, errorMessage);
            } else {
                const errorMessage = 'Ha ocurrido un error inesperado.';
                setError(errorMessage);
                onLeagueJoined(false, errorMessage);
            }
        } finally {
            // Solo desactiva isLoading si no estamos en la secuencia de jugadores
            // ya que la secuencia también implica 'carga' de cierta forma.
            if (!showPlayersSequence) {
                setIsLoading(false);
            }
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content-card join-league-modal-size">
                <div className="modal-header-card">
                    <h2 className="modal-title-card">Unirse a una Liga</h2>
                    <button className="modal-close-button-card" onClick={() => {
                        setLeagueCode('');
                        setError(null);
                        setSuccessMessage(null);
                        setAssignedPlayers([]); // Limpiar al cerrar
                        setDisplayedPlayers([]);
                        setCurrentIndex(0);
                        setShowPlayersSequence(false);
                        onClose();
                    }} disabled={isLoading || (showPlayersSequence && currentIndex < assignedPlayers.length)}>
                        &times;
                    </button>
                </div>
                <div className="modal-body-card">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {/* El mensaje de éxito solo se muestra si NO estamos en la secuencia de jugadores */}
                    {successMessage && !showPlayersSequence && <div className="alert alert-success">{successMessage}</div>}

                    {/* Renderizado condicional: muestra el formulario O el área de visualización de jugadores */}
                    {assignedPlayers.length === 0 && !showPlayersSequence ? (
                        // Muestra el formulario si no hay jugadores asignados y no estamos en la secuencia
                        <>
                            <p className="modal-description">Introduce el código único de la liga a la que quieres unirte.</p>
                            <div className="form-group-card">
                                <label htmlFor="leagueCode" className="form-label-card">Código de Liga:</label>
                                <input
                                    type="text"
                                    id="leagueCode"
                                    className="form-control-card"
                                    value={leagueCode}
                                    onChange={(e) => setLeagueCode(e.target.value)}
                                    placeholder="Ej: FANTASY123"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="modal-footer-card">
                                <button
                                    className="btn-primary-card-modal"
                                    onClick={handleJoin}
                                    disabled={isLoading || !leagueCode.trim()}
                                >
                                    {isLoading ? 'Uniéndose...' : 'Unirse'}
                                </button>
                                <button 
                                    className="btn-secondary-card-modal ms-2"
                                    onClick={() => {
                                        setLeagueCode('');
                                        setError(null);
                                        setSuccessMessage(null);
                                        onClose();
                                    }}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </>
                    ) : (
                        // Contenido para mostrar jugadores
                        <div>
                            <p className="text-center text-light mb-4">
                                {showPlayersSequence && currentIndex < assignedPlayers.length ?
                                    "¡Felicidades! Te has unido a la liga. Asignando jugadores a tu plantilla inicial:" :
                                    "¡Tu plantilla inicial está lista! Prepárate para la acción."
                                }
                            </p>
                            <div className="player-display-area">
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
                                        onClick={() => {
                                            setAssignedPlayers([]); // Limpiar al cerrar
                                            setDisplayedPlayers([]);
                                            setCurrentIndex(0);
                                            setShowPlayersSequence(false);
                                            onClose();
                                        }}
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

export default JoinLeagueModal;
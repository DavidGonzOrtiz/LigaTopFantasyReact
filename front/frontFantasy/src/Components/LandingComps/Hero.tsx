import axios from 'axios';
import { type FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import heroImage from '../../assets/Landing/images/Hero.jpg';
import CreateLeagueModal from '../Ligas/CreateLeagueModal';
import JoinLeagueModal from '../Ligas/JoinLeagueModal'; // ¡IMPORTA EL NUEVO MODAL!
import LigasUsuariosPage from '../Ligas/LigasUsuariosPage';
import './Hero.css';

// Modificar la interfaz PartidoDTO para incluir numeroJornada
interface PartidoDTO {
    fecha: string; // "YYYY-MM-DDTHH:mm:ss"
    nombreEquipoLocal: string;
    escudoLocalUrl: string;
    nombreEquipoVisitante: string;
    escudoVisitanteUrl: string;
    golesLocal: number | null;
    golesVisitante: number | null;
    numeroJornada: number; // Campo añadido para la jornada
}

interface MatchGroup {
    jornadaKey: string; // Usaremos "J" + numeroJornada para la clave
    matches: PartidoDTO[];
}

const Hero: FC = () => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const [isCreateLeagueModalOpen, setIsCreateLeagueModalOpen] = useState(false);
    const [isJoinLeagueModalOpen, setIsJoinLeagueModalOpen] = useState(false); // Mantén este estado
    const [refreshLeaguesTrigger, setRefreshLeaguesTrigger] = useState(0);

    // NUEVOS ESTADOS para los partidos
    const [_, setAllMatches] = useState<PartidoDTO[]>([]);
    const [matchesLoading, setMatchesLoading] = useState<boolean>(true);
    const [matchesError, setMatchesError] = useState<string | null>(null);
    const [jornadas, setJornadas] = useState<MatchGroup[]>([]);
    const [activeJornadaKey, setActiveJornadaKey] = useState<string | null>(null);

    // Función para formatear la fecha a un string legible
    const formatDateForJornada = (dateString: string): string => {
        const date = new Date(dateString);
        // Formato DD/MM/YYYY
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    // Función para extraer la hora si existe
    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        // Formato HH:mm
        return new Intl.DateTimeFormat('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    useEffect(() => {
        const fetchMatches = async () => {
            setMatchesLoading(true);
            setMatchesError(null);
            try {
                const API_URL = 'https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/Partidos/partidos-con-detalles';
                const response = await axios.get<PartidoDTO[]>(API_URL);
                setAllMatches(response.data);

                // Agrupar partidos por numeroJornada
                const groupedMatches: { [key: string]: PartidoDTO[] } = {};
                response.data.forEach(match => {
                    const jornadaKey = `J${match.numeroJornada}`; // Crear la clave como "J1", "J2", etc.
                    if (!groupedMatches[jornadaKey]) {
                        groupedMatches[jornadaKey] = [];
                    }
                    groupedMatches[jornadaKey].push(match);
                });

                // Convertir el objeto agrupado a un array de MatchGroup
                // Y ordenarlo por el número de jornada para que J1 vaya antes que J2, etc.
                const newJornadas: MatchGroup[] = Object.keys(groupedMatches)
                    .sort((a, b) => {
                        const numA = parseInt(a.substring(1)); // Extraer el número de "J1" -> 1
                        const numB = parseInt(b.substring(1));
                        return numA - numB;
                    })
                    .map(jornadaKey => ({
                        jornadaKey, // La clave ya es "J1", "J2", etc.
                        matches: groupedMatches[jornadaKey]
                    }));

                setJornadas(newJornadas);
                if (newJornadas.length > 0) {
                    setActiveJornadaKey(newJornadas[0].jornadaKey); // Seleccionar la primera jornada por defecto
                }

                setMatchesLoading(false);
            } catch (err) {
                setMatchesLoading(false);
                if (axios.isAxiosError(err)) {
                    setMatchesError(err.message || "Error desconocido al cargar los partidos.");
                    console.error("Error al obtener partidos:", err.response?.data || err.message);
                } else {
                    setMatchesError("Ha ocurrido un error inesperado al cargar los partidos.");
                    console.error("Error inesperado:", err);
                }
            }
        };

        fetchMatches();
    }, []); // Se ejecuta solo una vez al montar el componente

    const handleLeagueCreated = (success: boolean, message: string) => {
        if (success) {
            console.log(message);
            setRefreshLeaguesTrigger(prev => prev + 1); // Activa la recarga de ligas del usuario
        } else {
            console.error('Error al crear liga:', message);
            setIsCreateLeagueModalOpen(false);
        }
    };

    // Nueva función para manejar la unión a una liga
    const handleLeagueJoined = (success: boolean, message: string) => {
        if (success) {
            console.log(message);
            setRefreshLeaguesTrigger(prev => prev + 1); // También recarga las ligas del usuario
            // Podrías mostrar una notificación de éxito aquí
        } else {
            console.error('Error al unirse a liga:', message);
            // Mostrar el mensaje de error al usuario
            setIsJoinLeagueModalOpen(false); // Cierra el modal después de la operación
        }

    };

    // Tu handleJoinLeague existente ahora solo abre el modal
    const handleJoinLeagueClick = () => {
        setIsJoinLeagueModalOpen(true);
        console.log("Abrir modal para unirse a una liga");
    };

    const currentMatchesForDisplay = jornadas.find(j => j.jornadaKey === activeJornadaKey)?.matches || [];

    if (isLoading) {
        return (
            <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="hero-card-container d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="hero-section"
            style={{ backgroundImage: `url(${heroImage})` }}
        >
            <div className="hero-card-container">
                {isAuthenticated ? (
                    <div className="hero-card hero-card-dashboard">
                        <div className="hero-dashboard-header"> {/* Renombrada */}
                            <h1 className="hero-card-title-logged-in">¡Bienvenido de nuevo{user?.username ? `, ${user.username}` : ''}!</h1>
                            <p className="hero-card-subtitle-logged-in mb-4">Gestiona tus ligas y mantente al día con los próximos partidos.</p>
                            <div className="hero-card-actions mb-4">
                                <button
                                    className="btn btn-primary-card-action me-3 mb-2"
                                    onClick={() => setIsCreateLeagueModalOpen(true)}
                                >
                                    Crear Nueva Liga
                                </button>
                                <button
                                    className="btn btn-secondary-card-action mb-2"
                                    onClick={handleJoinLeagueClick}
                                >
                                    Unirse a Liga
                                </button>
                            </div>
                        </div>

                        <div className="hero-dashboard-content-grid">
                            <div className="hero-ligas-column">
                                <h3 className="hero-ligas-section-title">Tus Ligas</h3>
                                {/* Pasamos una clase específica para que LigasUsuariosPage no herede los estilos genéricos */}
                                <LigasUsuariosPage isEmbedded={true} refreshTrigger={refreshLeaguesTrigger} /*containerClassName="hero-ligas-list-container" */ /> 
                            </div>

                            <div className="hero-matches-column">
                                <h3 className="hero-matches-section-title">Próximos Partidos</h3>
                                {matchesLoading ? (
                                    <div className="alert alert-info hero-league-list-alert" style={{ textAlign: 'center' }}>
                                        Cargando partidos...
                                    </div>
                                ) : matchesError ? (
                                    <div className="alert alert-danger hero-league-list-alert" style={{ textAlign: 'center' }}>
                                        Error: {matchesError}
                                    </div>
                                ) : (
                                    <>
                                        <div className="hero-jornada-buttons">
                                            {jornadas.map((jornadaGroup) => (
                                                <button
                                                    key={jornadaGroup.jornadaKey}
                                                    className={`btn hero-jornada-btn ${activeJornadaKey === jornadaGroup.jornadaKey ? 'active' : ''}`}
                                                    onClick={() => setActiveJornadaKey(jornadaGroup.jornadaKey)}
                                                >
                                                    {jornadaGroup.jornadaKey}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="hero-matches-list">
                                            {currentMatchesForDisplay.length > 0 ? (
                                                currentMatchesForDisplay.map(match => (
                                                    <div key={`${match.fecha}-${match.nombreEquipoLocal}-${match.nombreEquipoVisitante}-${match.numeroJornada}`} className="hero-match-item-card">
                                                        <div className="hero-match-teams-container">
                                                            <div className="hero-team-info hero-team-local"> {/* Añadida hero-team-local */}
                                                                <img src={match.escudoLocalUrl} alt={`${match.nombreEquipoLocal} escudo`} className="hero-team-logo" />
                                                                <p className="hero-team-name">{match.nombreEquipoLocal}</p>
                                                            </div>
                                                            <p className="hero-match-vs">vs</p>
                                                            <div className="hero-team-info hero-team-visitante"> {/* Añadida hero-team-visitante */}
                                                                <img src={match.escudoVisitanteUrl} alt={`${match.nombreEquipoVisitante} escudo`} className="hero-team-logo" />
                                                                <p className="hero-team-name">{match.nombreEquipoVisitante}</p>
                                                            </div>
                                                        </div>
                                                        <p className="hero-match-details">
                                                            {formatDateForJornada(match.fecha)}
                                                            {match.fecha.includes('T') && formatTime(match.fecha) !== '00:00' ? ` - ${formatTime(match.fecha)}` : ''}
                                                        </p>
                                                        {match.golesLocal !== null && match.golesVisitante !== null && (
                                                            <p className="hero-match-score">
                                                                Resultado: {match.golesLocal} - {match.golesVisitante}
                                                            </p>
                                                        )}
                                                        <p className="hero-match-league"><small>La Liga</small></p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="alert alert-info hero-league-list-alert" style={{ textAlign: 'center' }}>
                                                    No hay partidos para esta jornada.
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="hero-card">
                        <h1 className="hero-card-title">Bienvenido a FantasyApp</h1>
                        <p className="hero-card-subtitle">Crea tu equipo, compite y gana la liga</p>
                        <div className="hero-card-actions">
                            <Link to="/login" className="btn btn-primary-card-action me-3">Iniciar Sesión</Link>
                            <Link to="/register" className="btn btn-secondary-card-action">Registrarse</Link>
                        </div>
                    </div>
                )}
            </div>

            <CreateLeagueModal
                isOpen={isCreateLeagueModalOpen}
                onClose={() => setIsCreateLeagueModalOpen(false)}
                onLeagueCreated={handleLeagueCreated}
            />

            {/* AÑADE ESTE MODAL DE UNIRSE A LIGA */}
            <JoinLeagueModal
                isOpen={isJoinLeagueModalOpen}
                onClose={() => setIsJoinLeagueModalOpen(false)}
                onLeagueJoined={handleLeagueJoined}
            />
        </section>
    );
};

export default Hero;
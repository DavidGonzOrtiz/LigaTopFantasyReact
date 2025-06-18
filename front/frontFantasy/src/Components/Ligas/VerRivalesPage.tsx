import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // ¡Importa Bootstrap CSS!
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PlayerDisplayData } from '../../Types/auth';
import jugadorGenerico from '../../assets/Landing/images/jugador.jpg'; // Ruta relativa a tu archivo de imagen
import './VerRivalesPage.css'; // Para estilos muy específicos si son necesarios


// Sub-componente para mostrar la tarjeta de cada deportista
const DeportistaCard: React.FC<{ deportista: PlayerDisplayData }> = ({ deportista }) => (
    <div className="card h-100 shadow-sm border-0"> {/* Tarjeta Bootstrap, altura 100%, sombra, sin borde */}
        <div className="card-body text-center">
            <div className="deportista-avatar mb-3">
                <img src={jugadorGenerico} // Usa la imagen del jugador o una genérica
                    alt={`${deportista.nombreJugador} Avatar`}
                    className="img-fluid rounded-circle" ></img>
            </div>
            <h5 className="card-title text-primary mb-1">
                <strong>{deportista.nombreJugador}</strong>
            </h5>
            <p className="card-text text-muted mb-1">
                <small>Posición: {deportista.posicion}</small>
            </p>
            <ul className="list-group list-group-flush mt-3">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                    Puntos: <span className="badge bg-success rounded-pill">{deportista.puntosJugador}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                    Precio: <span className="badge bg-info text-dark rounded-pill">{deportista.precioJugador} M</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                    Nacionalidad: <span className="badge bg-secondary rounded-pill">{deportista.nacionalidad || 'Desconocida'}</span>
                </li>
            </ul>
        </div>
    </div>
);

const PublicUserPlantillaPage: React.FC = () => {
    const { ligaId, nombreUsuario } = useParams<{ ligaId: string; nombreUsuario: string }>();
    const [players, setPlayers] = useState<PlayerDisplayData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const backendBaseUrl = 'https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net';

    useEffect(() => {
        const fetchPlantillaPublica = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!ligaId || !nombreUsuario) {
                    setError('Parámetros inválidos.');
                    setLoading(false);
                    return;
                }

                const url = `${backendBaseUrl}/api/usuario/plantilla-publica?nombreUsuario=${encodeURIComponent(nombreUsuario)}&ligaId=${ligaId}`;
                const response = await axios.get<PlayerDisplayData[]>(url);

                setPlayers(response.data);
            } catch (err) {
                setError('No se pudo cargar la plantilla pública.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlantillaPublica();
    }, [ligaId, nombreUsuario]);

    // Función para agrupar jugadores por posición
    const groupPlayersByPosition = (players: PlayerDisplayData[]) => {
        const grouped: { [key: string]: PlayerDisplayData[] } = {
            POR: [],
            DEF: [],
            MC: [],
            DEL: [],
            Otros: [] // Para posiciones no reconocidas
        };
        players.forEach(player => {
            if (grouped[player.posicion]) {
                grouped[player.posicion].push(player);
            } else {
                grouped.Otros.push(player);
            }
        });
        return grouped;
    };

    const groupedPlayers = groupPlayersByPosition(players);

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="alert alert-info text-center" role="alert">
                    Cargando plantilla pública...
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            </div>
        );
    }
    if (players.length === 0) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning text-center" role="alert">
                    No se encontró plantilla para este usuario en la liga.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4"> {/* Contenedor principal de Bootstrap */}
            <div className="card shadow-lg p-4 mb-4 bg-white rounded"> {/* Tarjeta principal grande */}
                <h2 className="text-center mb-4 text-primary display-5 fw-bold">
                    Plantilla de {nombreUsuario}
                </h2>
                <div className="text-center mb-4">
                    <button
                        onClick={() => navigate(-1)} // <--- Call navigate(-1) on click
                        className="btn btn-outline-light"
                    > Atrás
                    </button>
                </div>

                {Object.entries(groupedPlayers).map(([position, deportistas]) => (
                    deportistas.length > 0 && (
                        <div key={position} className="mb-4">
                            <h3 className="text-start mb-3 text-secondary border-bottom pb-2">
                                {position === 'POR' ? 'Porteros' :
                                    position === 'DEF' ? 'Defensas' :
                                        position === 'MC' ? 'Mediocentros' :
                                            position === 'DEL' ? 'Delanteros' :
                                                'Otros'}
                            </h3>
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"> {/* Grid responsivo */}
                                {deportistas.map(deportista => (
                                    <div key={deportista.jugadorId} className="col">
                                        <DeportistaCard deportista={deportista} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default PublicUserPlantillaPage;
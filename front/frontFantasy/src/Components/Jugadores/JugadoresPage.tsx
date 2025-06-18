// src/components/JugadoresPage.tsx
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

// Import your interface
import type { jugadoresPorID } from '../../Types/auth'; // ✔️ Asegúrate de que esta ruta sea correcta

function JugadoresPage() {
    const { equipoId } = useParams<{ equipoId: string }>();
    const [jugadores, setJugadores] = useState<jugadoresPorID[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [_, setTeamName] = useState<string>('Equipo');

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [playersPerPage] = useState<number>(10);

    useEffect(() => {
        const fetchJugadores = async () => {
            if (!equipoId) {
                setError('ID de equipo no proporcionado.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get<jugadoresPorID[]>(`https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/Futbol/Jugadores/${equipoId}`);
                setJugadores(response.data);

                if (response.data.length > 0) {
                    setTeamName(response.data[0].nombreEquipo);
                } else {
                    setTeamName("Equipo Desconocido");
                }

            } catch (err: any) {
                console.error('Error al obtener los jugadores:', err.response?.data || err.message);
                setError(err.response?.data?.mensaje || 'Error al cargar los jugadores.');
            } finally {
                setLoading(false);
            }
        };

        fetchJugadores();
    }, [equipoId]);

    const filteredJugadores = useMemo(() => {
        if (!searchTerm) {
            return jugadores;
        }
        return jugadores.filter(jugador =>
            jugador.nombreJugador.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [jugadores, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredJugadores]);

    const indexOfLastPlayer = currentPage * playersPerPage;
    const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
    const currentPlayers = filteredJugadores.slice(indexOfFirstPlayer, indexOfLastPlayer);

    const totalPages = Math.ceil(filteredJugadores.length / playersPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="container mt-5 text-center text-white"> {/* Added text-white */}
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando jugadores...</span>
                </div>
                <p className="mt-2">Cargando jugadores...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error al cargar los jugadores</h4>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">No se pudieron cargar los datos de los jugadores. Por favor, intente de nuevo más tarde.</p>
                </div>
                <Link to="/equipos" className="btn btn-warning mt-3">Volver a Equipos</Link> {/* Changed button style */}
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-5 players-page-container "> {/* Added custom class */}

            {/* --- Search Input --- */}
            <div className="mb-4 search-input-container"> {/* Added custom class */}
                <input
                    type="text"
                    className="form-control form-control-dark" // Added custom class for dark input
                    placeholder="Buscar jugador por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {/* -------------------- */}

            {currentPlayers.length > 0 ? (
                <>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {currentPlayers.map((jugador, index) => (
                            <div key={index} className="col">
                                <div className="card h-100 player-card"> {/* Added custom class */}
                                    <div className="card-body player-card-body"> {/* Added custom class */}
                                        <h5 className="card-title player-name-title">{jugador.nombreJugador}</h5> {/* Added custom class */}
                                        <p className="player-detail">
                                            <strong>Precio:</strong> <span className="detail-value">{jugador.precioJugador}</span> {/* Added custom class */}
                                        </p>
                                        <p className="player-detail">
                                            <strong>Nacionalidad:</strong> <span className="detail-value">{jugador.nacionalidad}</span> {/* Added custom class */}
                                        </p>
                                        <p className="player-detail">
                                            <strong>Puntos:</strong> <span className="detail-value player-points">{jugador.puntosJugador}</span> {/* Added custom class for points */}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- Pagination Controls --- */}
                    {totalPages > 1 && (
                        <nav aria-label="Page navigation" className="mt-4">
                            <ul className="pagination justify-content-center pagination-dark"> {/* Added custom class */}
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(currentPage - 1)} aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </button>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                        <button onClick={() => paginate(number)} className="page-link">
                                            {number}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(currentPage + 1)} aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                    {/* --------------------------- */}
                </>
            ) : (
                <div className="alert alert-info text-center bg-dark text-white border-info" role="alert"> {/* Changed alert style */}
                    {searchTerm ? "No se encontraron jugadores con ese nombre." : "No hay jugadores disponibles para este equipo."}
                </div>
            )}
            <div className="text-center mt-4">
                <Link to="/equipos" className="btn btn-warning btn-lg return-button">Volver a Equipos</Link> {/* Changed button style and size */}
            </div>
        </div>
    );
}

export default JugadoresPage;
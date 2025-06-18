// src/components/EquiposPage.tsx
import { useEffect, useState} from 'react'; // Importa useMemo
import axios from 'axios';
import { Link } from 'react-router-dom';

// Import your interfaces
import type { equiposDto } from '../../Types/auth';

function EquiposPage() {
    const [equipos, setEquipos] = useState<equiposDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // --- Estados para la paginaci�n ---
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [teamsPerPage] = useState<number>(7); // Mostrar 10 equipos por p�gina
    // ----------------------------------

    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const response = await axios.get<equiposDto[]>('https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/Futbol/Equipos');
                setEquipos(response.data);
            } catch (err: any) {
                console.error('Error al obtener los equipos:', err.response?.data || err.message);
                setError(err.response?.data?.mensaje || 'Error al cargar los equipos.');
            } finally {
                setLoading(false);
            }
        };

        fetchEquipos();
    }, []);

    // --- L�gica de paginaci�n ---
    // Calcular los equipos para la p�gina actual
    const indexOfLastTeam = currentPage * teamsPerPage;
    const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
    const currentTeams = equipos.slice(indexOfFirstTeam, indexOfLastTeam);

    // Calcular el n�mero total de p�ginas
    const totalPages = Math.ceil(equipos.length / teamsPerPage);

    // Funci�n para cambiar de p�gina
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    // ----------------------------

    if (loading) {
        return (
            <div className="container mt-5 text-center text-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando equipos...</span>
                </div>
                <p className="mt-2 text-light">Cargando equipos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error al cargar los equipos</h4>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">No se pudieron cargar los datos de los equipos. Por favor, intente de nuevo m�s tarde.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-5 teams-page-container">
            <h2 className="text-center fancy-title mb-5">Nuestros Equipos</h2>
            {currentTeams.length > 0 ? ( // Usamos currentTeams aqu�
                <>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {currentTeams.map((equipo) => ( // Mapeamos currentTeams
                            <div key={equipo.equipoId} className="col">
                                <Link
                                    to={`/equipos/${equipo.equipoId}/jugadores`}
                                    className="text-decoration-none"
                                >
                                    <div className="card h-100 team-card">
                                        <img
                                            src={equipo.imagenURL}
                                            className="card-img-top p-3 team-logo"
                                            alt={`Escudo de ${equipo.nombreEquipo}`}
                                            style={{ objectFit: 'contain', maxHeight: '180px' }}
                                        />
                                        <div className="card-body d-flex flex-column team-card-body">
                                            <h5 className="card-title team-name-title">{equipo.nombreEquipo}</h5>
                                            <p className="card-text team-detail">
                                                <strong>Estadio:</strong> <span className="detail-value">{equipo.estadio}</span>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* --- Controles de Paginaci�n --- */}
                    {totalPages > 1 && ( // Solo muestra la paginaci�n si hay m�s de una p�gina
                        <nav aria-label="Page navigation" className="mt-4">
                            <ul className="pagination justify-content-center pagination-dark">
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
                    {/* ------------------------------- */}
                </>
            ) : (
                <div className="alert alert-info text-center bg-dark text-white border-info" role="alert">
                    No hay equipos disponibles para mostrar en este momento.
                </div>
            )}
        </div>
    );
}

export default EquiposPage;
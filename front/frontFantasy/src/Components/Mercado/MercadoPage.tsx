import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate
import BidModal from './BidModal'; // Ajusta la ruta si BidModal.tsx está en otro lugar
import './MercadoPage.css';

// DTO del jugador en el mercado
interface JugadorMercadoDTO {
    mercadoId: string;
    jugadorId: number;
    nombreJugador: string;
    posicion: string;
    precioJugador: number;
    puntosJugador: number;
    nacionalidad: string;
    equipoId: string;
    nombreEquipo: string;
    fechaExpiracion: string; // Fecha en formato ISO
}
// Propiedades para el componente JugadorCard
interface JugadorCardProps {
    jugador: JugadorMercadoDTO;
    onMercadoExpirado: () => void;
    usuarioLigaId: string | null; // Ahora JugadorCard también recibe este ID
    ligaId: string | undefined; // Y el LigaId
    onOfertaRealizada: () => void; // Callback para refrescar el mercado
}

// --- Componente JugadorCard ---
// (Este componente estará en el mismo archivo, tal como lo tienes)
const JugadorCard: React.FC<JugadorCardProps> = ({
    jugador,
    onMercadoExpirado,
    usuarioLigaId,
    ligaId,
    onOfertaRealizada,
}) => {
    const [tiempoRestante, setTiempoRestante] = useState<string>('');
    const expiradoNotificado = useRef(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

    useEffect(() => {
        const calcularTiempoRestante = () => {
            const ahora = Date.now();
            const fechaIso = jugador.fechaExpiracion.endsWith('Z')
                ? jugador.fechaExpiracion
                : jugador.fechaExpiracion + 'Z';
            const expiracion = new Date(fechaIso).getTime();
            const diferencia = expiracion - ahora;

            if (diferencia <= 0) {
                setTiempoRestante('Mercado expirado');
                if (!expiradoNotificado.current) {
                    expiradoNotificado.current = true;
                    onMercadoExpirado(); // Dispara el refresco cuando expira
                }
                return;
            }

            const minutos = Math.floor((diferencia / 1000 / 60) % 60);
            const segundos = Math.floor((diferencia / 1000) % 60);
            const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

            let texto = '';
            if (dias > 0) texto += `${dias}d `;
            if (horas > 0 || dias > 0) texto += `${horas}h `;
            texto += `${minutos}m ${segundos}s`;

            setTiempoRestante(texto);
        };

        calcularTiempoRestante();
        const timerId = setInterval(calcularTiempoRestante, 1000);

        expiradoNotificado.current = false; // Resetear la notificación al montar/actualizar

        return () => clearInterval(timerId);
    }, [jugador.fechaExpiracion, onMercadoExpirado]);

    // Función para abrir el modal
    const handlePujar = () => {
        console.log('Intento de pujar:');
        console.log('Jugador:', jugador.nombreJugador);
        console.log('Mercado ID:', jugador.mercadoId);
        console.log('Usuario Liga ID recibido:', usuarioLigaId);
        console.log('Liga ID recibido:', ligaId);

        if (usuarioLigaId && ligaId) {
            setIsModalOpen(true);
        } else {
            alert('No se pudo cargar tu ID de usuario en la liga. Por favor, recarga la página o intenta más tarde.');
            console.error('Faltan IDs para abrir el modal de puja. usuarioLigaId:', usuarioLigaId, 'ligaId:', ligaId);
        }
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div
            className="jugador-card-mercado"
            style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}
        >
            <h3>{jugador.nombreJugador}</h3>
            <p><strong>Posición:</strong> {jugador.posicion}</p>
            <p><strong>Equipo:</strong> {jugador.nombreEquipo}</p>
            <p><strong>Puntos:</strong> {jugador.puntosJugador}</p>
            <p><strong>Precio:</strong> {jugador.precioJugador.toLocaleString()} €</p>
            <p><strong>Nacionalidad:</strong> {jugador.nacionalidad}</p>
            <p className="tiempo-restante">⏱️ {tiempoRestante}</p>
            {/* Solo muestra el botón si el mercado no ha expirado */}
            {tiempoRestante !== 'Mercado expirado' && (
                <button onClick={handlePujar}>Pujar</button>
            )}

            {/* Renderiza el modal solo si está abierto y tenemos los IDs necesarios */}
            {isModalOpen && usuarioLigaId && ligaId && (
                <BidModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    mercadoId={jugador.mercadoId} // Pasamos el mercadoId del jugador
                    jugadorNombre={jugador.nombreJugador}
                    precioActual={jugador.precioJugador}
                    usuarioLigaId={usuarioLigaId} // Pasamos el usuarioLigaId
                    ligaId={ligaId} // Pasamos el ligaId
                    onBidSuccess={onOfertaRealizada} // Pasamos el callback para refrescar la lista
                />
            )}
        </div>
    );
};

// --- Componente MercadoPage ---
const MercadoPage: React.FC = () => {
    const { ligaId } = useParams<{ ligaId: string }>();
    const navigate = useNavigate(); // Initialize useNavigate
    const [jugadores, setJugadores] = useState<JugadorMercadoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usuarioLigaId, setUsuarioLigaId] = useState<string | null>(null); // Estado para guardar UsuarioLigaId
    const [fetchingUsuarioLiga, setFetchingUsuarioLiga] = useState(true); // Nuevo estado para el usuarioLigaId

    // Function to navigate back
    const handleGoBack = () => {
        navigate(-1); // Navigates to the previous entry in the history stack
    };

    // Función para cargar los jugadores del mercado
    const fetchMercadoInterno = async () => {
        if (!ligaId) return;
        setLoading(true);
        try {
            const response = await axios.get(
                `https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/ligatop/mercado/mercado?ligaId=${ligaId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setJugadores(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar el mercado. Asegúrate de que estás autenticado.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Efecto para cargar el UsuarioLigaId y el mercado al inicio y refrescar el mercado periódicamente
    useEffect(() => {
        const fetchUsuarioLiga = async () => {
            if (!ligaId) {
                setFetchingUsuarioLiga(false);
                console.warn('LigaId no disponible para buscar UsuarioLigaId.');
                return;
            }
            setFetchingUsuarioLiga(true); // Indicamos que estamos buscando el usuarioLigaId
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/api/usuario/usuarioLigaId?ligaId=${ligaId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log('Respuesta de la API para usuarioLigaId:', response.data);
                // Asegúrate de que la propiedad en response.data se llama 'usuarioLigaId'
                // Si tu API devuelve 'UsuarioLigaId' (PascalCase), cámbialo aquí a response.data.UsuarioLigaId
                setUsuarioLigaId(response.data.usuarioLigaId);
                setError(null); // Limpiar errores previos si la llamada fue exitosa
            } catch (err: any) { // Usar 'any' para un manejo más flexible del error si no está tipado
                console.error('Error al obtener UsuarioLigaId:', err);
                let errorMessage = 'No se pudo obtener tu ID de usuario en la liga.';
                if (err.response && err.response.data) {
                    errorMessage = err.response.data; // Mensaje de error del backend
                }
                setError(errorMessage + ' No podrás realizar ofertas.');
                setUsuarioLigaId(null); // Asegurarse de que sea null en caso de error
            } finally {
                setFetchingUsuarioLiga(false); // Terminamos de buscar
            }
        };

        // --- ¡EL CAMBIO CRÍTICO ESTÁ AQUÍ! ---
        // Llama a las funciones fetch para que se ejecuten
        fetchUsuarioLiga(); // <-- ¡Esta línea es la que faltaba para ejecutar la llamada!
        fetchMercadoInterno();

        // Configura el intervalo para refrescar el mercado cada 30 segundos
        const intervalo = setInterval(fetchMercadoInterno, 30000);

        // Limpia el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalo);
    }, [ligaId]); // Se ejecuta cuando ligaId cambia

    // --- Condición de renderizado ---
    if (loading || fetchingUsuarioLiga) {
        return <p>Cargando mercado y tu información de liga...</p>;
    }
    if (error) {
        return <p className="error-message">{error}</p>;
    }
    if (jugadores.length === 0) {
        return <p>No hay jugadores en el mercado.</p>;
    }

    return (
        <div className="mercado-container">
            {/* New Back Button */}
            <button
                onClick={handleGoBack}
                className="btn btn-secondary back-button" // Use btn-secondary or create a custom class
            >
                Volver
            </button>

            <div className="jugadores-lista">
                {jugadores.map((jugador) => (
                    <JugadorCard
                        key={jugador.mercadoId}
                        jugador={jugador}
                        onMercadoExpirado={fetchMercadoInterno}
                        usuarioLigaId={usuarioLigaId}
                        ligaId={ligaId}
                        onOfertaRealizada={fetchMercadoInterno}
                    />
                ))}
            </div>
        </div>
    );
};

export default MercadoPage;
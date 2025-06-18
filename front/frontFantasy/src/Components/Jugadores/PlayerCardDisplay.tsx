import type { FC } from 'react';
import type { PlayerDisplayData } from '../../Types/auth';
import './PlayerCardDisplay.css'; // Asegúrate de que este archivo CSS existe y está estilizado

interface PlayerCardDisplayProps {
    player: PlayerDisplayData;
    isVisible: boolean; // Para controlar la animación de aparición
}

const PlayerCardDisplay: FC<PlayerCardDisplayProps> = ({ player, isVisible }) => {
    if (!player) return null;
    return (
        <div className={`player-card-display ${isVisible ? 'is-visible' : ''}`}>
            {/* Deberás asegurarte de que tu PlayerDisplayData incluye urlImagen o usar un valor por defecto */}
            {/*            <img src={player.urlImagen || '/src/assets/Default/DefaultPlayer.png'} alt={`${player.nombreJugador}`} className="player-image" />*/}
            <div className="player-info">
                <h3 className="player-name">{player.nombreJugador}</h3>
                <p className="player-position">Posición: {player.posicion}</p>
                <p className="player-value">Precio: ${player.precioJugador.toLocaleString()}</p>
                <p className="player-team">Equipo: {player.nombreEquipo}</p>
                <p className="player-points">Puntos: {player.puntosJugador}</p>
            </div>
        </div>
    );
};

export default PlayerCardDisplay;
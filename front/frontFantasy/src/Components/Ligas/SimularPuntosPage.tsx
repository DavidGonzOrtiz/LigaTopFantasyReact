import React from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext'; // ajusta la ruta si es necesario

interface SimularPuntosProps {
    jornadaId: string; // O `Guid` si usas directamente tipo GUID
    ligaId: string;
}

const BotonSimularPuntos: React.FC<SimularPuntosProps> = ({ jornadaId, ligaId }) => {
    const { user } = useAuth();

    const handleSimularPuntos = async () => {
        try {
            const response = await axios.post('/api/tu-controlador/simular-puntos', {
                jornadaId,
                ligaId,
            });

            alert(response.data); // o muestra un toast / mensaje visual
        } catch (error: any) {
            console.error('Error al simular puntos:', error);
            alert(error.response?.data || 'Ocurrió un error al simular puntos.');
        }
    };

    if (user?.rolId !== '1') return null; // Solo admins pueden ver este botón

    return (
        <button className="btn btn-primary" onClick={handleSimularPuntos}>
            Simular puntos
        </button>
    );
};

export default BotonSimularPuntos;

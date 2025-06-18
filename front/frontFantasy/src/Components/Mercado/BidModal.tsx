// src/components/BidModal.tsx
import React, { useState, useEffect } from 'react'; // Importa useEffect
import ReactDOM from 'react-dom'; // Importa ReactDOM
import axios from 'axios';
import './BidModal.css';

// ... (BidModalProps interface remains the same) ...
interface BidModalProps {
    isOpen: boolean;
    onClose: () => void;
    mercadoId: string;
    jugadorNombre: string;
    precioActual: number;
    usuarioLigaId: string;
    ligaId: string;
    onBidSuccess: () => void;
}

const BidModal: React.FC<BidModalProps> = ({
    isOpen,
    onClose,
    mercadoId,
    jugadorNombre,
    precioActual,
    usuarioLigaId,
    ligaId,
    onBidSuccess,
}) => {
    const [montoOferta, setMontoOferta] = useState<number>(precioActual + 1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Obtener la referencia al elemento donde se renderizará el modal
    const modalRoot = document.getElementById('modal-root');

    // Manejar el ciclo de vida del modal para prevenir que el scroll interactúe con el fondo
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Evita el scroll en el body
        } else {
            document.body.style.overflow = ''; // Restaura el scroll
        }
        // Cleanup function
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Si el modal no está abierto o modalRoot no existe, no renderizamos nada
    if (!isOpen || !modalRoot) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!usuarioLigaId || !ligaId || !mercadoId) {
            setError('Error interno: Faltan datos esenciales para realizar la oferta.');
            setLoading(false);
            return;
        }

        if (montoOferta <= precioActual) {
            setError('Tu oferta debe ser estrictamente mayor que el precio actual del jugador.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'https://ligatoprobertdavid20250618144714-gmfgeqaqgxh9cyer.northeurope-01.azurewebsites.net/ligatop/mercado/crear',
                {
                    mercadoId: mercadoId,
                    usuarioLigaId: usuarioLigaId,
                    ligaId: ligaId,
                    montoOferta: montoOferta,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setSuccess(response.data);
            onBidSuccess();
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (err: any) {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('Error al realizar la oferta. Por favor, inténtalo de nuevo más tarde.');
            }
            console.error('Error al crear oferta:', err);
        } finally {
            setLoading(false);
        }
    };

    // Renderiza el modal usando un Portal
    return ReactDOM.createPortal(
        <div className="bimodal-backdrop">
            <div className="bimodal-content">
                <h2>Pujar por {jugadorNombre}</h2>
                <p>Precio actual: <strong>{precioActual.toLocaleString()} €</strong></p>
                <form onSubmit={handleSubmit}>
                    <div className="bimodal-form-group">
                        <label htmlFor="montoOferta">Tu oferta (€):</label>
                        <input
                            type="number"
                            id="montoOferta"
                            value={montoOferta}
                            onChange={(e) => setMontoOferta(Number(e.target.value))}
                            min={precioActual + 1}
                            required
                            disabled={loading}
                        />
                    </div>
                    {error && <p className="bimodal-error-message">{error}</p>}
                    {success && <p className="bimodal-success-message">{success}</p>}
                    <div className="bimodal-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Enviando...' : 'Hacer Oferta'}
                        </button>
                        <button type="button" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        modalRoot!
    );
};

export default BidModal;
import axios from 'axios';
import React, { useState } from 'react';
import './CompartirLiga.css'; // Assuming you'll have a dedicated CSS file for this component if needed

interface ShareLigaButtonProps {
    ligaId: string;
    backendBaseUrl: string; // La URL base de tu API
}

const ShareLigaButton: React.FC<ShareLigaButtonProps> = ({ ligaId, backendBaseUrl }) => {
    const [showModal, setShowModal] = useState(false);
    const [codigoLiga, setCodigoLiga] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Para mostrar un estado de carga
    const handleGenerarCodigo = async () => {
        setIsLoading(true);
        setError(null);
        setCodigoLiga(null); // Limpiar código anterior
        try {
            const response = await axios.get(`${backendBaseUrl}/api/usuario/${ligaId}`);

            const fullMessage: string = response.data;
            const codeMatch = fullMessage.match(/Codigo de Liga: (.+)/);
            if (codeMatch && codeMatch[1]) {
                setCodigoLiga(codeMatch[1]);
            } else {
                setCodigoLiga(fullMessage);
            }
            setShowModal(true);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.mensaje || 'Error al generar el código de liga.');
            } else {
                setError('Ocurrió un error inesperado al generar el código.');
            }
            setShowModal(true); // Open modal to show the error
        } finally {
            setIsLoading(false);
        }
    };

    const handleCerrarModal = () => {
        setShowModal(false);
        setCodigoLiga(null); // Clear the code when closing the modal
        setError(null); // Clear errors when closing the modal
    };

    const handleCopyToClipboard = () => {
        if (codigoLiga) {
            navigator.clipboard.writeText(codigoLiga)
                .then(() => {
                    alert('Código copiado al portapapeles!');
                })
                .catch(err => {
                    console.error('Error al copiar el código: ', err);
                    alert('No se pudo copiar el código automáticamente. Por favor, cópialo manualmente.');
                });
        }
    };

    return (
        <div>
            {/* Button to generate and show the code */}
            <button
                onClick={handleGenerarCodigo}
                // Using btn-warning for a distinct look. You can use btn-secondary as discussed previously.
                className={`btn btn-warning btn-lg ${isLoading ? 'disabled' : ''}`} // Added btn-lg for consistency
                disabled={isLoading}
            >
                {isLoading ? 'Generando...' : 'Compartir Liga'}
            </button>

            {/* Bootstrap Modal */}
            {showModal && (
                <div
                    className="modal fade show d-block" // 'fade show d-block' for proper animation and visibility
                    tabIndex={-1}
                    role="dialog"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Overlay background
                    onClick={handleCerrarModal} // Close modal when clicking outside
                >
                    <div
                        className="modal-dialog modal-dialog-centered" // This class is key for centering
                        role="document"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
                    >
                        <div className="modal-content bg-dark text-white"> {/* Added dark background for contrast */}
                            <div className="modal-header border-bottom-0"> {/* Removed default border */}
                                <h5 className="modal-title">Código de Liga</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white" // Use btn-close-white for dark backgrounds
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={handleCerrarModal}
                                ></button>
                            </div>
                            <div className="modal-body text-center">
                                {error ? (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                ) : (
                                    <>
                                        <p className="lead fw-bold mb-3">
                                            Copia y comparte con amigos:
                                        </p>
                                        <div className="input-group mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={codigoLiga || ''}
                                                readOnly
                                                aria-label="Código de liga"
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={handleCopyToClipboard}
                                                disabled={!codigoLiga}
                                            >
                                                Copiar
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer border-top-0 justify-content-center"> {/* Removed border, centered button */}
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCerrarModal}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareLigaButton;
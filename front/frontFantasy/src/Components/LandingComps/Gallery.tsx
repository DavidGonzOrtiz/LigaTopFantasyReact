import type { FC } from 'react';
import './Gallery.css'; // ¡Recuerda que este CSS es crucial para el diseño!

// --- Importa tus imágenes reales desde la carpeta 'assets' ---
// Asegúrate de que las rutas sean correctas según la ubicación de tus imágenes.
// Por ejemplo, si tus imágenes están en 'src/assets/screenshots/':
import screenshot1 from '../../assets/Landing/images/screenshot1.jpeg';
import screenshot2 from '../../assets/Landing/images/screenshot2.jpeg';
import screenshot3 from '../../assets/Landing/images/screenshot3.jpeg';

// Si usas otros formatos como .png o .jpg, solo cambia la extensión.
// import screenshot1 from '../assets/screenshots/screenshot1.png';
// import screenshot2 from '../assets/screenshots/screenshot2.jpg';

const Gallery: FC = () => (
    <section className="gallery-section py-5 ">
        <div className="container py-4">
            <h2 className="display-4 fw-bold mb-5 text-center text-white text-uppercase">
                ..Crea tu <span className="text-gradient-sporty">Equipo de Campeones</span>
            </h2>
            <div className="row justify-content-center g-4"> {/* g-4 para un gap entre columnas */}
                {/* Array con las rutas de tus imágenes para mapear */}
                {[screenshot1, screenshot2, screenshot3].map((imgSrc, index) => (
                    <div className="col-lg-4 col-md-6 mb-4" key={index}>
                        <div className="gallery-item card h-100 shadow-lg border-0 rounded-3 overflow-hidden">
                            <img
                                src={imgSrc} // Aquí usamos la imagen importada
                                className="img-fluid w-100 gallery-image"
                                alt={`Captura de pantalla del juego ${index + 1}`}
                            />
                            <div className="gallery-overlay d-flex align-items-center justify-content-center">
                                <span className="overlay-text fs-4 fw-bold text-white">Fantasy Game {index + 1}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Gallery;
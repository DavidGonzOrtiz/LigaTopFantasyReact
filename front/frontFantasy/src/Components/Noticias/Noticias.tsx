// src/pages/Noticias.tsx
import React from 'react';
import './Noticias.css';
// Import the image as a module
import screenshot1Image from '../../assets/Landing/images/screenshot1.jpeg';
import screenshot1Image2 from '../../assets/Landing/images/screenshot2.jpeg';
import screenshot1Image3 from '../../assets/Landing/images/screenshot3.jpeg';

const Noticias: React.FC = () => {
    const newsArticles = [
        {
            id: 1,
            title: '¡Nueva Temporada a la Vista!',
            date: '15 de Junio de 2025',
            summary: 'Se anuncian emocionantes cambios y nuevas características para la próxima temporada de la liga.',
            content: 'Estamos encantados de anunciar que la nueva temporada traerá consigo una serie de mejoras significativas. Los usuarios podrán disfrutar de un sistema de puntuación revisado, nuevas oportunidades de fichajes y eventos especiales. Prepárense para la acción a partir del 1 de julio.',
            // Use the imported variable here:
            imageUrl: screenshot1Image
        },
        {
            id: 2,
            title: 'Consejos para Optimizar tu Plantilla',
            date: '10 de Junio de 2025',
            summary: 'Descubre las mejores estrategias para armar un equipo ganador en tu liga.',
            content: 'Nuestros expertos han analizado las tendencias del mercado y te ofrecen los mejores consejos para fichar jugadores, gestionar tu presupuesto y aprovechar al máximo cada jornada. ¡No te pierdas esta guía esencial para dominar la clasificación!',
            imageUrl: screenshot1Image2
        },
        {
            id: 3,
            title: 'Entrevista con el Campeón de la Temporada Pasada',
            date: '5 de Junio de 2025',
            summary: 'Hablamos con el usuario que se llevó el título en la última edición de la liga.',
            content: 'Juan Pérez, el campeón indiscutible de la temporada anterior, nos comparte sus secretos, sus momentos más difíciles y cómo logró superar a sus rivales. Una lectura inspiradora para todos los aspirantes a campeones.',
            imageUrl: screenshot1Image3
        },
    ];

    return (
        <div className="news-page-container">
            <h1 className="page-title">Últimas Noticias</h1>
            <div className="news-list">
                {newsArticles.map(article => (
                    <div key={article.id} className="news-card">
                        {/* The src will now correctly point to the resolved image path */}
                        <img src={article.imageUrl} alt={article.title} className="news-image" />
                        <div className="news-content">
                            <h2 className="news-title">{article.title}</h2>
                            <p className="news-date">{article.date}</p>
                            <p className="news-summary">{article.summary}</p>
                            <details className="news-details">
                                <summary>Leer más</summary>
                                <p>{article.content}</p>
                            </details>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Noticias;
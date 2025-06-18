// src/pages/Contacto.tsx
import React, { useState } from 'react';
import './Contacto.css'; // Asegúrate de crear este archivo CSS

const Contacto: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');
        setErrorMessage('');

        // Simular un envío de API
        try {
            // Validaciones básicas (puedes añadir más)
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                throw new Error('Por favor, completa todos los campos.');
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                throw new Error('Por favor, introduce un email válido.');
            }

            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula una demora de red

            // Aquí normalmente enviarías `formData` a tu backend
            console.log('Datos del formulario enviados:', formData);

            setFormStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Limpiar el formulario
        } catch (error: any) {
            setFormStatus('error');
            setErrorMessage(error.message || 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.');
            console.error('Error al enviar el formulario:', error);
        }
    };

    return (
        <div className="contact-page-container">
            <div className="contact-card">
                <p className="contact-intro">
                    ¿Tienes alguna pregunta, sugerencia o problema? ¡Estamos aquí para ayudarte!
                    Completa el siguiente formulario o utiliza la información de contacto a continuación.
                </p>

                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Nombre:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={formStatus === 'submitting'}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={formStatus === 'submitting'}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="subject">Asunto:</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            disabled={formStatus === 'submitting'}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Mensaje:</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            disabled={formStatus === 'submitting'}
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-button" disabled={formStatus === 'submitting'}>
                        {formStatus === 'submitting' ? 'Enviando...' : 'Enviar Mensaje'}
                    </button>

                    {formStatus === 'success' && (
                        <p className="form-message success">¡Mensaje enviado con éxito! Te responderemos pronto.</p>
                    )}
                    {formStatus === 'error' && (
                        <p className="form-message error">{errorMessage}</p>
                    )}
                </form>

                <div className="contact-info">
                    <h3>Otras formas de contacto:</h3>
                    <p>
                        <strong>Email:</strong> <a href="mailto:info@tu_liga_fantasia.com">info@tu_liga_fantasia.com</a>
                    </p>
                    <p>
                        <strong>Teléfono:</strong> <a href="tel:+34123456789">+34 123 456 789</a>
                    </p>
                    <p>
                        <strong>Dirección:</strong> Calle Ficticia 123, 28001 Madrid, España
                    </p>
                    <div className="social-links">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contacto;
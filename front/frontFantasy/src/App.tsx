// src/App.tsx
import './App.css';
import Header from './Components/Header';
import Landing from './Components/Landing'; // Tu componente de la página de inicio/landing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importa Router, Routes y Route
import { AuthProvider } from './Context/AuthContext'; // Importa tu proveedor de autenticación
import LoginPage from './Components/AuthComps/LoginPage'; // Tu componente de la página de login
import RegisterPage from './Components/AuthComps/RegisterPage'; // Tu componente de la página de registro
import PrivateRoute from './Components/AuthComps/PrivateRoute'; // Tu componente para proteger rutas
import ProfilePage from './Components/ProfileUser/ProfilePage'; // Tu componente de la página de perfil (ejemplo de ruta protegida)
import TeamsPage from './Components/Teams/TeamsPage';
import JugadoresPage from './Components/Jugadores/JugadoresPage';
import LigasUsuariosPage from './Components/Ligas/LigasUsuariosPage';
import DetallesLigaPage from './Components/Ligas/DetallesLigaPage'; 
import Contacto from './Components/Contacto/Contacto';
import Noticias from './Components/Noticias/Noticias';
import AlineacionPage from './Components/Alineacion/AlineacionPage';
import AlineacionTitularPage from './Components/Alineacion/AlineacionTitularPage';
import MercadoPage from './Components/Mercado/MercadoPage';
import PublicUserPlantillaPage from './Components/Ligas/VerRivalesPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header /> {/* El Header está aquí y probablemente es fixed-top */}

                {/* Este div compensará la altura del Header */}
                <div className="main-content-wrapper">
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <ProfilePage />
                                </PrivateRoute>
                            }
                        />
                        {/*RUTAS PARA MOSTRAR EQUIPOS */ }
                        <Route path="equipos" element={<TeamsPage />} />
                        <Route path="/equipos/:equipoId/jugadores" element={<JugadoresPage />} />
                        {/*RUTAS PARA MOSTRAR LIGAS DEL USUARIO ACTIVO */}
                        <Route path="/LigasUsuarios" element={<LigasUsuariosPage />} />
                        <Route path="/detalles-liga/:leagueNameUrl" element={<DetallesLigaPage />} />
                        {/*RUTAS PARA NOTICIAS */}
                        <Route path="/noticias" element={<Noticias />} />
                        {/*RUTAS PARA CONTACTOS */}
                        <Route path="/contacto" element={<Contacto />} />
                        {/*RUTAS PARA ALINEACION */}
                        <Route path="/ligas/:ligaId/alineacion" element={<AlineacionPage />} />
                        {/*RUTAS PARA ALINEACION TITULAR */ }
                        <Route path="/ligas/:ligaId/alineacion/titular" element={<AlineacionTitularPage ligaId={''} jornada={null} />} />
                        {/* RUTA PARA IR AL MERCADO */}
                        <Route path="/mercado/:ligaId" element={<MercadoPage />} />
                        {/* Rutas privadas para ver rivales y alineaciones de rivales */}
                        <Route path="/ligas/:ligaId/plantilla/:nombreUsuario" element={<PublicUserPlantillaPage />} />

                        {/* Ruta para volver a ligas */}
                        <Route path="/ligas/:ligaId" element={<DetallesLigaPage />} />

                        {/* Rutas privadas para las ligas */}
                        {/* Ruta para "no encontrado" */}
                        <Route path="*" element={<h1 className="text-center mt-5">404 - Página no encontrada</h1>} />
                    </Routes>
                </div>

                {/* <Footer /> */}
            </AuthProvider>
        </Router>
    );
}

export default App;
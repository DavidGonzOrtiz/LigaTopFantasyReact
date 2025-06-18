// src/components/PrivateRoute.tsx
import type { ReactNode } from 'react'; // Importamos ReactNode para tipar los children
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext'; // Importamos el hook de autenticación

//Este archivo tiene la funcion de proteger rutas privadas, asegurando que solo los usuarios autenticados puedan acceder a ellas.
//Si un usuario no autenticado intenta acceder a una ruta protegida, será redirigido a la página de inicio de sesión.


// Define las props para el componente PrivateRoute
interface PrivateRouteProps {
    children: ReactNode; // Los elementos hijos que PrivateRoute protegerá
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth(); // Obtenemos el estado de autenticación y carga

    // Muestra un mensaje de carga mientras se verifica el estado de autenticación
    if (isLoading) {
        return <div>Cargando autenticación...</div>;
    }

    // Si el usuario está autenticado, renderiza los hijos. Si no, redirige a la página de login.
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
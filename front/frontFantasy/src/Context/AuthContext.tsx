// src/context/AuthContext.tsx
import axios from 'axios';
import { jwtDecode, type JwtPayload } from 'jwt-decode'; // Importa JwtPayload para un tipado m�s preciso
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { UserData } from '../Types/auth'; // Aseg�rate de que la ruta sea correcta (types en min�scula es m�s com�n)

// Define la interfaz para el valor que provee el contexto
interface AuthContextType {
    isAuthenticated: boolean;
    user: UserData | null;
    token: string | null;
    // El segundo par�metro es 'newUserEmail: string' como acordamos para la llamada desde LoginPage
    login: (newToken: string, newUserEmail: string) => void;
    logout: () => void;
    isLoading: boolean;
}

// Crea el contexto con un valor inicial nulo, se garantiza que no ser� nulo al usar useAuth
const AuthContext = createContext<AuthContextType | null>(null);

// Define las props para el componente AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

// El componente proveedor del contexto de autenticaci�n
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Efecto para cargar el estado de autenticaci�n desde localStorage al inicio
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        // const storedUser = localStorage.getItem('user'); // <-- ELIMINAR: Ya no se usa

        if (storedToken) {
            try {
                // Decodificar el token para obtener los datos del usuario al cargar
                // Usamos 'JwtPayload' o 'any' para el resultado de jwtDecode
                const decodedToken: JwtPayload & {
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
                    'RolId'?: string; // Aseg�rate de la capitalizaci�n exacta del claim en tu JWT
                    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
                    // A�ade aqu� cualquier otro claim personalizado que esperes
                } = jwtDecode(storedToken);

                // Mapear los claims del token decodificado a tu interfaz UserData
                const userFromToken: UserData = {
                    id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
                    username: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
                    email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
                    rolId: decodedToken['RolId'], // <-- REVISAR: Usar 'RolId' si ese es el claim exacto, o 'rolId' si lo mapeaste
                    rol: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                    // Aseg�rate de que todos los campos obligatorios de UserData est�n presentes,
                    // y proporciona un valor por defecto si pueden ser undefined.
                };

                // Comprobaci�n b�sica para asegurar que los datos esenciales existen
                if (userFromToken.id && userFromToken.username && userFromToken.email) {
                    setIsAuthenticated(true);
                    setToken(storedToken);
                    setUser(userFromToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                } else {
                    throw new Error("Datos de usuario incompletos en el token.");
                }

            } catch (error) {
                console.error("Error al decodificar o parsear token desde localStorage:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user'); // Si lo usabas, ahora puedes quitarlo
                setIsAuthenticated(false);
                setToken(null);
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    // Funci�n para iniciar sesi�n: recibe el nuevo token y el email del usuario
    const login = (newToken: string) => { // 'newUserEmail' se recibe pero no se usa directamente en este m�todo
        try {
            // Decodificar el token para construir el objeto UserData
            const decodedToken: JwtPayload & {
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
                'RolId'?: string; // Aseg�rate de la capitalizaci�n exacta del claim en tu JWT
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
                // A�ade aqu� cualquier otro claim personalizado que esperes
            } = jwtDecode(newToken);

            const userFromToken: UserData = {
                id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
                username: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
                email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
                rolId: decodedToken['RolId'], // <-- REVISAR: Usar 'RolId' si ese es el claim exacto, o 'rolId' si lo mapeaste
                rol: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                // Aseg�rate de que todos los campos obligatorios de UserData est�n presentes
            };

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userFromToken)); // Guarda el objeto UserData completo
            setIsAuthenticated(true);
            setToken(newToken);
            setUser(userFromToken); // Establece el objeto UserData
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } catch (error) {
            console.error("Error al decodificar el token durante el login:", error);
            logout(); // Limpia cualquier estado inconsistente
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    if (isLoading) {
        return <div>Cargando autenticaci�n...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
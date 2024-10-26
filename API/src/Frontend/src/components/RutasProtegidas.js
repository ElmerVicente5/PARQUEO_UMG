// components/RutasProtegidas.js
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Asegúrate de importar el contexto correctamente

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { auth } = useContext(AuthContext); // Obtén el contexto de autenticación

    // Verificar si el token está presente
    if (!auth.token) {
        return <Navigate to="/" />; // Redirigir a la página de inicio de sesión
    }

    // Verificar si el rol del usuario está permitido
    if (allowedRoles && !allowedRoles.includes(auth.role)) {
        return <Navigate to="/unauthorized" />; // Redirigir a una página de acceso denegado o similar
    }

    return children; // Renderizar los hijos si el usuario está autenticado y tiene el rol permitido
};

export default ProtectedRoute;

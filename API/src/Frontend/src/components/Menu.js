import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Importar useLocation y useNavigate
import { AuthContext } from '../context/AuthContext'; // Importar AuthContext
import '../styles/Menu.css'; 

function Menu({ userName }) { 
    const { auth } = useContext(AuthContext); // Obtener auth desde el contexto
    const [isMenuVisible, setIsMenuVisible] = useState(true); // Mostrar el menú por defecto
    const location = useLocation(); // Obtener la ubicación actual
    const navigate = useNavigate(); // Crear un hook de navegación

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible); // Alterna la visibilidad del menú
        document.querySelector('.content-area').classList.toggle('menu-hidden');
    };

    // Función para determinar el título dinámico según la ruta
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard':
                return 'DASHBOARD UMG';
            case '/reportes':
                return 'Reportes';
            case '/reserva':
                return 'Reserva';
            case '/ver-reservas':
                return 'REGISTRO DE RESERVAS';
            case '/MisReservas':
                return 'Mis Reservas';
            case '/historial':
                return 'Historial';
            default:
                return 'DASHBOARD UMG'; // Título por defecto
        }
    };

    const openCamera1 = () => {
        window.open('http://localhost:5000/', '_blank'); // Abre el enlace en una nueva pestaña
    };

    const handleLogout = () => {
        sessionStorage.clear(); // Borra todo el sessionStorage
        navigate('/'); // Redirige a la página de inicio
    };

    return (
        <div className="menu-container d-flex">
            <header className="menu-header fixed-top w-100 d-flex justify-content-between align-items-center p-2">
                <div onClick={toggleMenu} className="toggle-icon">
                    <i className="fas fa-bars"></i>
                </div>
                {/* Aquí el título es dinámico */}
                <h1 className="flex-grow-1 text-center m-0">{getPageTitle()}</h1>
                <Link to="/configuracion-perfil" className="settings-icon mx-3" aria-label="Configuración">
                    <i className="fas fa-cog"></i>
                </Link>
            </header>

            {/* Menú lateral */}
            <div className={`menu-sidebar bg-dark text-white p-3 ${isMenuVisible ? '' : 'hidden'}`}>
                <div className="menu-user-profile text-center mb-4">
                    <i className="fas fa-user-circle fa-3x"></i>
                    <p className="user-name">{userName}</p>
                </div>
                <nav className="menu-nav d-flex flex-column">
                    <Link to="/dashboard" className="btn btn-outline-light mb-3">Dashboard</Link>

                    {/* Mostrar "Reportes" solo si el rol es Admin */}
                    {auth.role === 'Admin' && (
                        <Link to="/reportes" className="btn btn-outline-light mb-3">Reporte de Vehiculos</Link>
                    )}
                    {auth.role === 'Admin' && (
                        <Link to="/ver-reservas" className="btn btn-outline-light mb-3">Reportes de Reservas </Link>
                    )}
                    {auth.role === 'Admin' && (
                        <button onClick={openCamera1} className="btn btn-outline-light mb-3">Ver Cámara 1</button>
                    )}
                    {/* Nuevas opciones agregadas */}
                    <Link to="/reserva" className="btn btn-outline-light mb-3">Reserva</Link>
                    <Link to="/MisReservas" className="btn btn-outline-light mb-3">Ver mis Reservas</Link>
                   
                    
                    {/* Cambiado el Link por un botón que llama a handleLogout */}
                    <button onClick={handleLogout} className="btn btn-danger">Cerrar Sesión</button>
                </nav>
            </div>
        </div>
    );
}

export default Menu;

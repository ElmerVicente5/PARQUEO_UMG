import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Menu.css'; 



function Menu({ userName }) {
    const [isMenuVisible, setIsMenuVisible] = useState(true); // Mostrar el menú por defecto

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible); // Alterna la visibilidad del menú

        // Ajusta el contenido: Añade o quita la clase 'menu-hidden' para ajustar el contenido
        document.querySelector('.content-area').classList.toggle('menu-hidden');
    };

    return (
        <div className="menu-container d-flex">
            <header className="menu-header fixed-top w-100 d-flex justify-content-between align-items-center p-2">
                <div onClick={toggleMenu} className="toggle-icon">
                    <i className="fas fa-bars"></i>
                </div>
                <h1 className="flex-grow-1 text-center m-0">DASHBOARD UMG</h1>
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
                    <Link to="/reportes" className="btn btn-outline-light mb-3">Reportes</Link>
                    <Link to="/reserva" className="btn btn-outline-light mb-3">Reserva</Link>
                    <Link to="/" className="btn btn-danger">Cerrar Sesión</Link>
                </nav>
            </div>
        </div>
    );
}



export default Menu;

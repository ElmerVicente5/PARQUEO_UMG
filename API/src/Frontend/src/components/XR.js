import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function XR({ userName }) {
    const [isMenuVisible, setIsMenuVisible] = useState(true); // Mostrar  menú por defecto

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible); // Alterna la visibilidad del menú

        // Ajusta el contenedor de reportes agregando o quitando la clase 'menu-hidden' o 'menu-visible'
        const reportesContainer = document.querySelector('.reportes-container');
        if (reportesContainer) {
            if (isMenuVisible) {
                reportesContainer.classList.remove('menu-visible');
                reportesContainer.classList.add('menu-hidden');
            } else {
                reportesContainer.classList.remove('menu-hidden');
                reportesContainer.classList.add('menu-visible');
            }
        }
    };

   
    useEffect(() => {
        const reportesContainer = document.querySelector('.reportes-container');
        if (reportesContainer) {
            if (isMenuVisible) {
                reportesContainer.classList.add('menu-visible');
            } else {
                reportesContainer.classList.add('menu-hidden');
            }
        }
    }, [isMenuVisible]);

    return (
        <div className={`menu-container d-flex`}>
            <header className="menu-header fixed-top w-100 d-flex justify-content-between align-items-center p-2">
                <div onClick={toggleMenu} className="toggle-icon">
                    <i className="fas fa-bars"></i>
                </div>
                <h1 className="flex-grow-1 text-center m-0">REPORTES UMG</h1>
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

export default XR;

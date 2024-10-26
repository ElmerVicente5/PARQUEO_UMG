import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function XS({ userName }) {
    const [isMenuVisible, setIsMenuVisible] = useState(true);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);

        // Ajusta el contenedor de reserva agregando o quitando la clase 'menu-hidden-reserva' o 'menu-visible-reserva'
        const reservaContainer = document.querySelector('.reserva-container-custom');
        if (reservaContainer) {
            if (isMenuVisible) {
                reservaContainer.classList.remove('menu-visible-reserva');
                reservaContainer.classList.add('menu-hidden-reserva');
            } else {
                reservaContainer.classList.remove('menu-hidden-reserva');
                reservaContainer.classList.add('menu-visible-reserva');
            }
        }
    };

    useEffect(() => {
        const reservaContainer = document.querySelector('.reserva-container-custom');
        if (reservaContainer) {
            if (isMenuVisible) {
                reservaContainer.classList.add('menu-visible-reserva');
            } else {
                reservaContainer.classList.add('menu-hidden-reserva');
            }
        }
    }, [isMenuVisible]);

    return (
        <div className="menu-container d-flex">
            <header className="menu-header fixed-top w-100 d-flex justify-content-between align-items-center p-2 bg-dark text-white">
                <div onClick={toggleMenu} className="toggle-icon">
                    <i className="fas fa-bars"></i>
                </div>
                <h1 className="flex-grow-1 text-center m-0">RESERVAS UMG</h1>
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

export default XS;

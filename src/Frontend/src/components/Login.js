import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function IniciarSesion() {
    const [formulario, setFormulario] = useState({
        correo: '',
        contraseña: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Función para manejar los cambios en los inputs
    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    // Función de validación del correo
    const validarCorreo = (correo) => {
        return correo.endsWith('@miumg.edu.gt');
    };

    // Función de validación de la contraseña
    const validarContraseña = (contraseña) => {
        const tieneLongitudCorrecta = contraseña.length === 8;
        const tieneMayuscula = /[A-Z]/.test(contraseña);
        return tieneLongitudCorrecta && tieneMayuscula;
    };

    // Función para manejar el envío del formulario
    const manejarEnvio = (e) => {
        e.preventDefault();
        if (!validarCorreo(formulario.correo)) {
            setError('El correo debe pertenecer al dominio @miumg.edu.gt');
        } else if (!validarContraseña(formulario.contraseña)) {
            setError('La contraseña debe tener 8 caracteres y contener al menos una letra mayúscula');
        } else {
            setError('');
            console.log("Inicio de sesión exitoso:", formulario);
            navigate('/dashboard');
        }
    };

    return (
        <div className="contenedor-inicio-sesion">
            <div className="caja-inicio-sesion">
                <form onSubmit={manejarEnvio}>
                    <h2>ACCESO</h2>
                    <div className="grupo-input">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <input
                            type="email"
                            name="correo"
                            value={formulario.correo}
                            onChange={manejarCambio}
                            placeholder="Ingrese su correo electrónico"
                            required
                            id="correo"
                        />
                    </div>
                    <div className="grupo-input">
                        <label htmlFor="contraseña">Contraseña</label>
                        <input
                            type="password"
                            name="contraseña"
                            value={formulario.contraseña}
                            onChange={manejarCambio}
                            placeholder="Ingrese su contraseña"
                            required
                            id="contraseña"
                        />
                    </div>
                    {error && <p className="mensaje-error">{error}</p>}
                    <button type="submit" className="btn-enviar">Iniciar Sesión</button>
                </form>

                <div className="opciones-inicio-sesion">
                    <Link to="/forgot-password">¿Olvidó su contraseña?</Link>
                    <Link to="/register">Registrarse</Link>
                </div>
            </div>
        </div>
    );
}

export default IniciarSesion;

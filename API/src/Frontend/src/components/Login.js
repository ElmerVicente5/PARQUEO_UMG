import React, { useState } from 'react';
import axios from 'axios';
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
        const tieneLongitudCorrecta = contraseña.length >= 8; // Verifica si tiene 8 o más caracteres
        const tieneMayuscula = /[A-Z]/.test(contraseña); // Verifica si contiene al menos una letra mayúscula
        return tieneLongitudCorrecta && tieneMayuscula;
    };

    // Función para manejar el envío del formulario y hacer la solicitud a la API
    const manejarEnvio = async (e) => {
        e.preventDefault(); // Previene la recarga de la página
        if (!validarCorreo(formulario.correo)) {
            setError('El correo debe pertenecer al dominio @miumg.edu.gt');
        } else if (!validarContraseña(formulario.contraseña)) {
            setError('La contraseña debe tener 8 caracteres o más y contener al menos una letra mayúscula');
        } else {
            setError('');

            try {
                // Realiza la solicitud POST a la API
                const response = await axios.post('http://localhost:8000/api/usuario/login', {
                    email: formulario.correo,  // Asegúrate de que el campo se llame 'email' como lo espera el backend
                    password: formulario.contraseña // Asegúrate de que el campo se llame 'password' como lo espera el backend
                });

                // Verifica si el inicio de sesión fue exitoso
                if (response.status === 200) {
                    console.log("Inicio de sesión exitoso:", response.data);
                    // Redirige al dashboard después del inicio de sesión exitoso
                    navigate('/dashboard');
                } else {
                    // Si no fue un 200, muestra el mensaje de error devuelto
                    setError(response.data.message || 'Error inesperado');
                }
            } catch (error) {
                // Manejo de errores de la solicitud
                if (error.response) {
                    // Si el servidor respondió con un código de estado fuera del rango de 2xx
                    setError(error.response.data.message || 'Error inesperado');
                } else if (error.request) {
                    // Si la solicitud fue realizada pero no se recibió respuesta
                    setError('No se recibió respuesta del servidor.');
                } else {
                    // Algo ocurrió al configurar la solicitud
                    setError('Error al configurar la solicitud: ' + error.message);
                }
                console.error('Error al iniciar sesión:', error);
            }
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

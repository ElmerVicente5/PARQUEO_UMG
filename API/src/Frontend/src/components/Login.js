import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        // Captura el token desde la URL si fue redirigido desde la autenticación de Google
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
       
        if (token) {
            // Guardar el token en sessionStorage o localStorage
            sessionStorage.setItem('token', token);
            //sessionStorage.setItem('userRole', role); // Guardar el rol
            console.log('Token y rol guardados:', token);
            //console.log('Token guardado:', token);

            // Redirigir al dashboard
            navigate('/dashboard');
        }else{
            console.log('No se recibió token de Google o  el role');
        }
    }, [navigate]);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const validarCorreo = (correo) => {
        return correo.endsWith('@miumg.edu.gt');
    };

    const validarContraseña = (contraseña) => {
        const tieneLongitudCorrecta = contraseña.length >= 8;
        const tieneMayuscula = /[A-Z]/.test(contraseña);
        return tieneLongitudCorrecta && tieneMayuscula;
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        if (!validarCorreo(formulario.correo)) {
            setError('El correo debe pertenecer al dominio @miumg.edu.gt');
        } else if (!validarContraseña(formulario.contraseña)) {
            setError('La contraseña debe tener 8 caracteres o más y contener al menos una letra mayúscula');
        } else {
            setError('');
    
            try {
                const response = await axios.post('http://localhost:8000/api/usuario/login', {
                    email: formulario.correo,
                    password: formulario.contraseña
                });
    
                if (response.status === 200) {
                    console.log("Inicio de sesión exitoso:", response.data);
                    sessionStorage.setItem('token', response.data.token);
                    navigate('/dashboard');
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401 || error.response.status === 403) {
                        setError('Usuario o contraseña incorrectos.');
                    } else {
                        setError(error.response.data.message || 'Error inesperado');
                    }
                } else if (error.request) {
                    setError('No se recibió respuesta del servidor.');
                } else {
                    setError('Error al configurar la solicitud: ' + error.message);
                }
                console.error('Error al iniciar sesión:', error);
            }
        }
    };

    const iniciarSesionConGoogle = () => {
        window.location.href = 'http://localhost:8000/api/usuario/auth/google';
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

                <button onClick={iniciarSesionConGoogle} className="btn-enviar">
                    Iniciar sesión con Google
                </button>

                <div className="opciones-inicio-sesion">
                    <Link to="/forgot-password">¿Olvidó su contraseña?</Link>
                    <Link to="/register">Registrarse</Link>
                </div>
            </div>
        </div>
    );
}

export default IniciarSesion;

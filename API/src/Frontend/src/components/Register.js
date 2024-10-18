import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css';
import { useNavigate } from 'react-router-dom';

function Registro() {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        telefono: ''
    });

    const [error, setError] = useState(''); // Estado para manejar el error
    const [success, setSuccess] = useState(''); // Estado para manejar el mensaje de éxito
    const navigate = useNavigate(); // Navegación con React Router

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación del correo electrónico con dominio
        const emailDomain = '@miumg.edu.gt';
        if (!formData.email.endsWith(emailDomain)) {
            return setError(`El correo debe pertenecer al dominio ${emailDomain}`);
        }

        // Validación de la password
        const password = formData.password;
        const contraseñaRegex = /^(?=.*[A-Z]).{8,}$/; // Al menos 8 caracteres o más y una letra mayúscula
        if (!contraseñaRegex.test(password)) {
            return setError('La password debe tener 8 caracteres o más y debe incluir al menos una letra mayúscula.');
        }

        // Limpiar errores si la validación es exitosa
        setError('');
        setSuccess(''); // Limpiar mensaje de éxito

        try {
            // Realiza la solicitud POST a la API
            const response = await axios.post('http://localhost:8000/api/usuario/registrar', formData);

            // Verifica si la respuesta fue exitosa
            if (response.status === 201) { // Asegúrate de que el código de éxito sea el esperado
                setSuccess('Registro exitoso. Redirigiendo al inicio...');
                setTimeout(() => {
                    navigate('/'); // Redirigir al dashboard después del registro exitoso
                }, 2000); // Espera 2 segundos antes de redirigir
            } else {
                // Si no fue un 201, muestra el mensaje de error devuelto
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
            console.error('Error al registrar usuario:', error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="fondo-registro">
            <div className="contenedor-registro">
                <h2>Registro</h2>
                <form onSubmit={handleSubmit}>
                    {/* Grupo de campos del formulario */}
                    {['nombres', 'apellidos', 'email', 'password', 'telefono'].map((field) => (
                        <div key={field} className="grupo-entrada">
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                placeholder={`Ingrese su ${field}`}
                                required
                                aria-label={field}
                            />
                        </div>
                    ))}

                    {/* Mostrar error si existe */}
                    {error && <p className="mensaje-error">{error}</p>}
                    {/* Mostrar éxito si existe */}
                    {success && <p className="mensaje-exito">{success}</p>}

                    {/* Botones */}
                    <div className="grupo-botones">
                        <button type="button" className="boton-regresar" onClick={handleBack}>
                            Regresar
                        </button>
                        <button type="submit" className="boton-enviar">
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Registro;

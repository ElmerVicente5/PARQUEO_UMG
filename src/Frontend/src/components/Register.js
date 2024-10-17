import React, { useState } from 'react';
import '../styles/Register.css';
import { useNavigate } from 'react-router-dom';

function Registro() {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        contraseña: '',
        telefono: ''
    });

    const [error, setError] = useState(''); // Estado para manejar el error
    const navigate = useNavigate(); // Navegación con React Router

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación del correo electrónico con dominio
        const emailDomain = '@miumg.edu.gt';
        if (!formData.email.endsWith(emailDomain)) {
            return setError(`El correo debe pertenecer al dominio ${emailDomain}`);
        }

      // Validación de la contraseña
        const contraseña = formData.contraseña;
        const contraseñaRegex = /^(?=.*[A-Z]).{8,}$/; // Al menos 8 caracteres o más y una letra mayúscula
        if (!contraseñaRegex.test(contraseña)) {
        return setError('La contraseña debe tener 8 caracteres o más y debe incluir al menos una letra mayúscula.');
        }


        // Limpiar errores si la validación es exitosa
        setError('');
        console.log('Datos registrados:', formData);

        // Redirigir al dashboard después del registro exitoso
        navigate('/dashboard');
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
                    {['nombres', 'apellidos', 'email', 'contraseña', 'telefono'].map((field) => (
                        <div key={field} className="grupo-entrada">
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type={field === 'email' ? 'email' : field === 'contraseña' ? 'password' : 'text'}
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

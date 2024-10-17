import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Password.css';

function RecuperarContraseña() {
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [mensajeError, setMensajeError] = useState('');
    const navigate = useNavigate();

    // Maneja el cambio de cualquier campo en el formulario
    const manejarCambio = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = (e) => {
        e.preventDefault();
        const dominioCorreo = '@miumg.edu.gt';

        // Validar que el correo pertenezca al dominio @miumg.edu.gt
        if (!formData.email.endsWith(dominioCorreo)) {
            setMensajeError(`El correo debe pertenecer al dominio ${dominioCorreo}`);
            return;
        }

       // Validar que las contraseñas tengan 8 caracteres o más y al menos una letra mayúscula
       const regexMayuscula = /[A-Z]/;
       if (formData.newPassword.length < 8 || !regexMayuscula.test(formData.newPassword)) {
       setMensajeError('La contraseña debe tener 8 caracteres o más y al menos una letra mayúscula');
       return;
       }


        // Validar que las contraseñas coincidan
        if (formData.newPassword !== formData.confirmPassword) {
            setMensajeError('Las contraseñas no coinciden');
            return;
        }

        // Limpiar errores y enviar el formulario
        setMensajeError('');
        console.log("Contraseña restablecida:", formData);

        // Redirigir al login después de restablecer la contraseña
        navigate('/dashboard');
    };

    return (
        <div className="contenedor-recuperar-contraseña">
            <div className="caja-recuperar-contraseña">
                <h2>Recuperar Contraseña</h2>
                {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
                <form onSubmit={manejarEnvio}>
                    <div className="grupo-input">
                        <label>Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={manejarCambio}
                            placeholder="Ingrese su correo electrónico"
                            required
                        />
                    </div>
                    <div className="grupo-input">
                        <label>Nueva Contraseña</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={manejarCambio}
                            placeholder="Ingrese su nueva contraseña"
                            required
                        />
                    </div>
                    <div className="grupo-input">
                        <label>Confirmar Nueva Contraseña</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={manejarCambio}
                            placeholder="Confirme su nueva contraseña"
                            required
                        />
                    </div>

                    <div className="grupo-botones">
                        <button type="button" className="boton-regresar" onClick={() => navigate(-1)}>
                            Regresar
                        </button>
                        <button type="submit" className="boton-enviar">
                            Restablecer Contraseña
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RecuperarContraseña;

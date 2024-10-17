import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ConfiguracionPerfil.css';

function ConfiguracionPerfil({ setUserName }) { // Recibe setUserName como propiedad
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: '',
        fechaNacimiento: '',
        genero: '',
        password: ''
    });

    const [error, setError] = useState('');

    // Guardar los datos y redirigir al dashboard
    const handleSave = (e) => {
        e.preventDefault();

        const { nombres, apellidos, correo, telefono, password } = formData;
        if (!nombres || !apellidos || !correo || !telefono || !password) {
            setError('Por favor, complete todos los campos antes de guardar.');
            return;
        }

        const nombreCompleto = `${nombres} ${apellidos}`;
        setUserName(nombreCompleto); // Actualiza el nombre de usuario con el nombre completo
        navigate('/dashboard');
    };

    // Función para cancelar y redirigir al dashboard sin guardar datos
    const handleCancel = () => {
        navigate('/dashboard'); // Redirige sin guardar
    };

    return (
        <div className="configuracion-perfil-container">
            <h1>Configuración de Perfil</h1>
            {error && <p className="text-danger">{error}</p>}
            <form className="perfil-form" onSubmit={handleSave}>
                <div className="form-group">
                    <label>Nombres</label>
                    <input
                        type="text"
                        name="nombres"
                        className="form-control"
                        value={formData.nombres}
                        onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Apellidos</label>
                    <input
                        type="text"
                        name="apellidos"
                        className="form-control"
                        value={formData.apellidos}
                        onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input
                        type="email"
                        name="correo"
                        className="form-control"
                        value={formData.correo}
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Teléfono</label>
                    <input
                        type="tel"
                        name="telefono"
                        className="form-control"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        required
                    />
                </div>

                <div className="form-buttons d-flex justify-content-between mt-4">
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                    {/* Botón de Cancelar */}
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ConfiguracionPerfil;

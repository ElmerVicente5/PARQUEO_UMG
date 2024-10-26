import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toPng } from 'html-to-image';
import XS from './XS';
import Menu from './Menu';
import '../styles/Reserva.css';

function Reserva({ userName }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [ticketData, setTicketData] = useState(null);
    const [espaciosDisponibles, setEspaciosDisponibles] = useState([]);

    // Obtener espacios disponibles
    useEffect(() => {
        const obtenerEspaciosDisponibles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/dashboard/espaciosDisponibles');
                setEspaciosDisponibles(response.data.EspaciosDisponible);
            } catch (error) {
                console.error('Error al obtener los espacios disponibles:', error);
            }
        };

        obtenerEspaciosDisponibles();
    }, []);

    // Función para realizar la reserva
    const onFormSubmit = async (data) => {
        const token = sessionStorage.getItem('token'); // Obtener el token de sessionStorage

        // Preparar los datos a enviar al backend
        const reservaData = {
            id_espacio: data.parkingSpace,
            nombreUsuario: '', // Este campo no es necesario ya que el backend obtiene el userId del token
            placa: data.carPlate,
            fechaReserva: data.date + " 10:00:00" // Agregar una hora por defecto
        };

        try {
            const response = await axios.post(
                'http://localhost:8000/api/dashboard/reservarEspacio',
                reservaData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Enviar el token en el header
                    }
                }
            );
            setTicketData(data); // Guardar los datos de la reserva para mostrar el ticket
            console.log('Reserva realizada:', response.data);
        } catch (error) {
            console.error('Error al realizar la reserva:', error);
        }
    };

    // Función para exportar el ticket como imagen
    const exportTicketAsImage = () => {
        const ticketElement = document.getElementById('ticket');
        toPng(ticketElement)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'ticket_reserva.png';
                link.click();
            })
            .catch((error) => {
                console.error('Error al exportar el ticket como imagen:', error);
            });
    };

    // Función para realizar una nueva reserva
    const nuevaReserva = () => {
        setTicketData(null);
        reset();
    };

    return (
        <div className="reserva-container-custom">

            {/* Componente Menu */}
            <Menu userName={userName} showBackgroundImage={false} />
           

            <div className="tabla-container-reserva">
                {!ticketData ? (
                    <form onSubmit={handleSubmit(onFormSubmit)} className="reserva-form-custom">
                        <div className="form-group">
                            <label htmlFor="carPlate">Número de Placa</label>
                            <input
                                id="carPlate"
                                className={`form-control ${errors.carPlate ? 'is-invalid' : ''}`}
                                {...register('carPlate', { required: 'Este campo es obligatorio' })}
                            />
                            {errors.carPlate && <span className="invalid-feedback">{errors.carPlate.message}</span>}
                        </div>

                        {/* Selector de espacios disponibles */}
                        <div className="form-group">
                            <label htmlFor="parkingSpace">Número de Espacio de Parqueo</label>
                            <select
                                id="parkingSpace"
                                className={`form-control ${errors.parkingSpace ? 'is-invalid' : ''}`}
                                {...register('parkingSpace', { required: 'Este campo es obligatorio' })}
                            >
                                <option value="">Selecciona un espacio</option>
                                {espaciosDisponibles.map((espacio) => (
                                    <option key={espacio.id_espacio} value={espacio.id_espacio}>
                                        Espacio {espacio.id_espacio}
                                    </option>
                                ))}
                            </select>
                            {errors.parkingSpace && <span className="invalid-feedback">{errors.parkingSpace.message}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Fecha de Reserva</label>
                            <input
                                id="date"
                                type="date"
                                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                {...register('date', { required: 'Este campo es obligatorio' })}
                            />
                            {errors.date && <span className="invalid-feedback">{errors.date.message}</span>}
                        </div>

                        <button type="submit" className="btn btn-primary">Reservar</button>
                    </form>
                ) : (
                    <div id="ticket" className="ticket-custom">
                        <h2>Reserva Confirmada</h2>
                        <p><strong>Placa del Vehículo:</strong> {ticketData.carPlate}</p>
                        <p><strong>Espacio de Parqueo:</strong> {ticketData.parkingSpace}</p>
                        <p><strong>Fecha de Reserva:</strong> {ticketData.date}</p>

                        <div className="ticket-actions-custom">
                            <button className="btn btn-success" onClick={exportTicketAsImage}>Descargar</button>
                            <button className="btn btn-secondary" onClick={nuevaReserva}>Nueva Reserva</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reserva;

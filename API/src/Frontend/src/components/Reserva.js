import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toPng } from 'html-to-image'; // Para exportar como imagen
import '../styles/Reserva.css';

function Reserva() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [ticketData, setTicketData] = useState(null); // Estado para los datos del ticket

    // Función para manejar el envío del formulario
    const onFormSubmit = (data) => {
        setTicketData(data); // Guardar los datos del ticket
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

    // Función para hacer una nueva reserva (reiniciar formulario)
    const nuevaReserva = () => {
        setTicketData(null); // Limpiar el ticket
        reset(); // Reiniciar el formulario
    };

    return (
        <div className="reserva-container">
            
           

            {/* Formulario de reserva */}
            {!ticketData && (
                <form onSubmit={handleSubmit(onFormSubmit)} className="reserva-form">
                    <div className="form-group">
                        <label htmlFor="name">Nombre Completo</label>
                        <input
                            id="name"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            {...register('name', { required: 'Este campo es obligatorio' })}
                        />
                        {errors.name && <span className="invalid-feedback">{errors.name.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="carPlate">Número de Placa</label>
                        <input
                            id="carPlate"
                            className={`form-control ${errors.carPlate ? 'is-invalid' : ''}`}
                            {...register('carPlate', { required: 'Este campo es obligatorio' })}
                        />
                        {errors.carPlate && <span className="invalid-feedback">{errors.carPlate.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="parkingSpace">Número de Espacio de Parqueo</label>
                        <input
                            id="parkingSpace"
                            type="number"
                            className={`form-control ${errors.parkingSpace ? 'is-invalid' : ''}`}
                            {...register('parkingSpace', { required: 'Este campo es obligatorio' })}
                        />
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
            )}

            {/* Ticket de confirmación */}
            {ticketData && (
                <div>
                    <div id="ticket" className="ticket">
                        <h2>Reserva Confirmada</h2>
                        <p><strong>Nombre:</strong> {ticketData.name}</p>
                        <p><strong>Placa del Vehículo:</strong> {ticketData.carPlate}</p>
                        <p><strong>Espacio de Parqueo:</strong> {ticketData.parkingSpace}</p>
                        <p><strong>Fecha de Reserva:</strong> {ticketData.date}</p>
                    </div>

                    <div className="ticket-actions">
                        <button className="btn btn-success" onClick={exportTicketAsImage}>Descargar</button>
                        <button className="btn btn-secondary" onClick={nuevaReserva}>Nueva Reserva</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reserva;

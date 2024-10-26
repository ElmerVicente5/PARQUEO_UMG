// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';  // Importa el hook para acceder al socket
import Menu from './Menu';
import '../styles/Dashboard.css';

function Dashboard({ userName }) {
  const socket = useSocket();  // Usa el socket desde el contexto
  const [areas, setAreas] = useState([
    { name: 'SUR', disponibles: 0, ocupados: 0, reservados: 0, nodisponible: 0 },
    { name: 'ESTE', disponibles: 0, ocupados: 0, reservados: 0, nodisponible: 0 },
    { name: 'OESTE', disponibles: 0, ocupados: 0, reservados: 0, nodisponible: 0 },
    { name: 'NORTE', disponibles: 0, ocupados: 0, reservados: 0, nodisponible: 0 },
    { name: 'CENTRAL', disponibles: 0, ocupados: 0, reservados: 0, nodisponible: 0 }
  ]);

  const [selectedArea, setSelectedArea] = useState('SUR');
  const [slots, setSlots] = useState([]);
  const [espacios, setEspacios] = useState([]);
 
  useEffect(() => {
    if (!socket) return;
    // Verifica la conexión
    const reconnectSocket = () => {
      if (socket.disconnected) {
        socket.connect();
      }
    };

  reconnectSocket();

    socket.on('estadoParqueo', (espaciosRecibidos) => {
      console.log('Espacios actualizados recibidos desde el WebSocket:', espaciosRecibidos);
      setEspacios(espaciosRecibidos);

      const updatedAreas = areas.map(area => {
        if (area.name === 'SUR') {
          const disponibles = espaciosRecibidos.filter(e => e.estado === 'disponible').length;
          const ocupados = espaciosRecibidos.filter(e => e.estado === 'ocupado').length;
          const reservados = espaciosRecibidos.filter(e => e.estado === 'reservado').length;
          const nodisponible = espaciosRecibidos.filter(e => e.estado === 'noDisponible').length;

          return {
            ...area,
            disponibles,
            ocupados,
            reservados,
            nodisponible
          };
        }
        return area;
      });

      setAreas(updatedAreas);
    });

    return () => {
      socket.off('estadoParqueo');
    };
  }, [socket, areas]);

  const generateSlotsForArea = (area) => {
    let slots = [];
    const areaData = areas.find(a => a.name === area);

    if (areaData) {
      slots = espacios.map(espacio => ({
        id: `S${espacio.id_espacio}`,
        status: espacio.estado === 'disponible' ? 'available' :
                espacio.estado === 'ocupado' ? 'occupied' :
                espacio.estado === 'reservado' ? 'reserved' :
                'unavailable'
      }));
    }

    return slots;
  };

  useEffect(() => {
    setSlots(generateSlotsForArea(selectedArea));
  }, [selectedArea, espacios]);

  const handleAreaClick = (area) => {
    setSelectedArea(area);
  };

  const isAreaEmpty = (area) => {
    const areaData = areas.find(a => a.name === area);
    return (
      areaData.disponibles === 0 &&
      areaData.ocupados === 0 &&
      areaData.reservados === 0 &&
      areaData.nodisponible === 0
    );
  };

  return (
    <div className="container-fluid dashboard-container">
      <Menu userName={userName} showBackgroundImage={false} />
      <div className="content-area">
        <div className="row status-cards mb-4">
          {['DISPONIBLES', 'OCUPADOS', 'RESERVADOS', 'NO DISPONIBLE'].map((label, idx) => {
            const areaData = areas.find(a => a.name === selectedArea);
            const values = [
              areaData.disponibles,
              areaData.ocupados,
              areaData.reservados,
              areaData.nodisponible
            ];

            return (
              <div key={label} className={`col status-card ${label.toLowerCase().replace(/\s+/g, '')}`}>
                <h2>{values[idx]}</h2>
                <p>{label}</p>
              </div>
            );
          })}
        </div>

        <div className="row area-buttons mb-4">
          {areas.map(area => (
            <div key={area.name} className="col-6 col-sm-4 col-md-2">
              <button
                className={`btn w-100 ${selectedArea === area.name ? 'selected' : ''}`}
                onClick={() => handleAreaClick(area.name)}
              >
                {`AREA ${area.name}`}
              </button>
            </div>
          ))}
        </div>

        {isAreaEmpty(selectedArea) ? (
          <div className="text-center text-white">No hay nada en esta área.</div>
        ) : (
          <div className="parking-grid">
            {slots.map(slot => (
              <div key={slot.id} className={`parking-slot ${slot.status}`}>
                {slot.id}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

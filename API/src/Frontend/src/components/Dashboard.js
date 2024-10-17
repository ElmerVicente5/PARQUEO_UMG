import React, { useState } from 'react';
import Menu from './Menu';
import '../styles/Dashboard.css'; // Mantén este archivo si tienes estilos personalizados

function Dashboard({userName}) {
  

  const areas = [
    { name: 'SUR', disponibles: 1, ocupados:5, reservados: 3, nodisponible: 1 },
    { name: 'ESTE', disponibles: 0, ocupados: 0, reservados: 0, nodisponible: 0 },
    { name: 'OESTE', disponibles: 0, ocupados: 0, reservados: 0, nodisponible: 0 },
    { name: 'NORTE', disponibles: 0, ocupados: 0, reservados: 0, nodisponible: 0 },
    { name: 'CENTRAL', disponibles: 0, ocupados: 0, reservados: 0, nodisponible: 0 }
  ];

  const [selectedArea, setSelectedArea] = useState('SUR'); // Área seleccionada por defecto

  // Función para generar slots por área
  const generateSlotsForArea = (area) => {
    let slots = [];
    let idCounter = 1;

    // Función para generar un número de slots con un estado específico
    const createSlots = (count, status) => {
      for (let i = 0; i < count; i++) {
        slots.push({ id: `S${idCounter++}`, status });
      }
    };

    // Buscar el área seleccionada y generar los slots basados en sus cantidades
    const areaData = areas.find(a => a.name === area);
    if (areaData) {
      createSlots(areaData.disponibles, 'available');
      createSlots(areaData.ocupados, 'occupied');
      createSlots(areaData.reservados, 'reserved');
      createSlots(areaData.nodisponible, 'unavailable');
    }

    return slots;
  };

  const [slots, setSlots] = useState(generateSlotsForArea(selectedArea)); // Estado inicial para los slots en el área por defecto

  // Función para manejar el clic en las áreas y actualizar los slots
  const handleAreaClick = (area) => {
    setSelectedArea(area); // Actualiza el área seleccionada
    setSlots(generateSlotsForArea(area)); // Genera los slots correspondientes a la nueva área
  };

  // Función para verificar si el área está vacía
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
      {/* Invocamos el componente Menu sin imagen de fondo */}
      <Menu userName={userName} showBackgroundImage={false} />

      {/* Contenido principal */}
      <div className="content-area">
        
        {/* Tarjetas de estado */}
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

        {/* Botones de áreas de estacionamiento */}
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

        {/* Mapa de slots de estacionamiento o mensaje si el área está vacía */}
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

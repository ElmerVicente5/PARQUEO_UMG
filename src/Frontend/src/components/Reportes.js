import React from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import XR from './XR'; // Usamos el componente de menú
import '../styles/Reportes.css'; 

function Reportes({ userName }) {
    const headers = [
        { label: "ID", key: "id" },
        { label: "Nombre", key: "name" },
        { label: "Fecha", key: "date" },
        { label: "Descripción", key: "description" }
    ];

    // Función para generar 100 registros simulados
    function generateFakeData(num) {
        const data = [];
        for (let i = 1; i <= num; i++) {
            data.push({
                id: i,
                name: `Usuario ${i}`,
                date: `2024-10-${(i % 30) + 1}`, // Fecha con día entre 1 y 30
                description: `Descripción del reporte ${i}`
            });
        }
        return data;
    }

    const data = generateFakeData(100); // Genera 100 registros

    // Definir las columnas para react-data-table-component
    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Nombre',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Fecha',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Descripción',
            selector: row => row.description,
        }
    ];

    return (
        <div className="reportes-container">
            <XR userName={userName} showBackgroundImage={false} />
            <div className="tabla-container">
                
                {/* DataTable */}
                <DataTable
                    columns={columns}
                    data={data}
                    pagination // Activa la paginación
                    highlightOnHover // Resalta la fila al pasar el ratón
                    striped // Alterna el color de las filas
                />


                {/* Botón para exportar a CSV */}
                <div className="csv-download">
                    <CSVLink data={data} headers={headers} filename={"reporte.csv"} className="btn btn-primary">
                        Descargar CSV
                    </CSVLink>
                </div>
            </div>
        </div>
    );
}

export default Reportes;

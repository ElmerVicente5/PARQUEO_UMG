import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import XR from './XR'; 
import Menu from './Menu';
import '../styles/Reportes.css'; 

function Reportes({ userName }) {
    const [filterText, setFilterText] = useState('');
    const [data, setData] = useState([]);

    const headers = [
        { label: "Placa Vehículo", key: "placa" },
        { label: "Fecha Entrada", key: "fechaentrada" },
        { label: "Fecha Salida", key: "fechasalida" },
        { label: "Espacio Ocupado", key: "espacioocupado" },
        { label: "Área", key: "area" }
    ];

    // Función para obtener los datos del endpoint
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/dashboard/obtenerRegistroVehiculos');
                const result = await response.json();
                setData(result.registro);  // Actualiza el estado con los datos obtenidos
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData(); // Llama a la función al montar el componente
    }, []);

    const columns = [
        { name: 'Placa Vehículo', selector: row => row.placa, sortable: true },
        { name: 'Fecha Entrada', selector: row => row.fechaentrada, sortable: true },
        { name: 'Fecha Salida', selector: row => row.fechasalida, sortable: true },
        { name: 'Espacio Ocupado', selector: row => row.espacioocupado, sortable: true },
        { name: 'Área', selector: row => row.area, sortable: true },
    ];

    const filteredData = data.filter(item => {
        return (
            item.placa.toLowerCase().includes(filterText.toLowerCase()) ||
            item.fechaentrada.includes(filterText) ||
            item.fechasalida.includes(filterText) ||
            item.espacioocupado.toString().includes(filterText) ||
            item.area.toLowerCase().includes(filterText.toLowerCase())
        );
    });

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(data, "reporte.xlsx");
    };

    return (
        <div className="reportes-container">
            <Menu userName={userName} showBackgroundImage={false} />
            
            <div className="tabla-container">
                
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="form-control"
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    striped
                />

                <div className="csv-download">
                    <CSVLink data={filteredData} headers={headers} filename={"reporte.csv"} className="btn btn-primary">
                        Descargar CSV
                    </CSVLink>
                    <button onClick={downloadExcel} className="btn btn-success" style={{ marginLeft: '10px' }}>
                        Descargar Excel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Reportes;

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Menu from './Menu';
import '../styles/Reportes.css';

function VerReservas({ userName }) {
    const [filterText, setFilterText] = useState('');
    const [data, setData] = useState([]);

    const headers = [
        { label: "Nombre Usuario", key: "nombreusuario" },
        { label: "Espacio Reservado", key: "espacioreservado" },
        { label: "Fecha Reserva", key: "fechareserva" },
        { label: "Estado", key: "estado" }
    ];

    // Función para obtener los datos del endpoint
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/dashboard/obtenerReservas');
                const result = await response.json();
                setData(result.reservas); // Actualiza el estado con los datos obtenidos
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData(); // Llama a la función al montar el componente
    }, []);

    const columns = [
        { name: 'Nombre Usuario', selector: row => row.nombreusuario, sortable: true },
        { name: 'Espacio Reservado', selector: row => row.espacioreservado, sortable: true },
        { name: 'Fecha Reserva', selector: row => new Date(row.fechareserva).toLocaleString(), sortable: true },
        { name: 'Estado', selector: row => row.estado, sortable: true },
    ];

    const filteredData = data.filter(item => {
        return (
            item.nombreusuario.toLowerCase().includes(filterText.toLowerCase()) ||
            item.espacioreservado.toLowerCase().includes(filterText.toLowerCase()) ||
            new Date(item.fechareserva).toLocaleString().includes(filterText) ||
            item.estado.toLowerCase().includes(filterText.toLowerCase())
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

export default VerReservas;

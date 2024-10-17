import { obtenerDatosDashboard } from '../models/dashboard.model.js';

export const obtenerDatosDashboardHandler = async (req, res) => {
    try {
        const datos = await obtenerDatosDashboard();  // Obtener los datos desde el modelo
        res.status(200).json(datos);  // Responder con los datos en formato JSON
    } catch (error) {
        console.error('Error al obtener los datos del dashboard:', error);
        res.status(500).json({ message: 'Error al obtener los datos del dashboard', error: error.message });
    }
};



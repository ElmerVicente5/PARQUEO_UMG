import { db } from '../database/conexion.database.js';  // Asegúrate de que la conexión esté bien configurada

const obtenerDatosDashboard = async () => {
    try {
        const query = `
        SELECT 
            COUNT(CASE WHEN LOWER(estado) = 'disponible' THEN 1 END) AS disponibles,
            COUNT(CASE WHEN LOWER(estado) = 'ocupado' THEN 1 END) AS ocupados,
            COUNT(CASE WHEN LOWER(estado) = 'reservado' THEN 1 END) AS reservados,
            COUNT(CASE WHEN LOWER(estado) = 'no disponible' THEN 1 END) AS no_disponibles
        FROM parqueos
        WHERE LOWER(area) = 'sur';
    `;
    

        const { rows } = await db.query(query);
        return rows[0];  // Retorna los datos que obtuviste de la consulta
    } catch (error) {
        console.error('Error al obtener los datos del dashboard:', error);
        throw error;
    }
};
export { obtenerDatosDashboard };

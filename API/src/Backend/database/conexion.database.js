import pg from 'pg';
import 'dotenv/config';  
const { Pool } = pg;
// Configuración de la conexión a la base de datos
const connectionString = process.env.DATABASE_URL; 

export const db = new Pool({
    connectionString: connectionString,
    allowExitOnIdle: true,  // Permite que las conexiones se cierren cuando no se utilizan
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,  // SSL SI lo subimos :,)
});

// Función para probar la conexión a la base de datos
const testConnection = async () => {
    try {
        const result = await db.query('SELECT NOW()');  // Prueba de consulta
        console.log('Conexión exitosa a la base de datos:', result.rows[0]);
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
    }
};

// Llama a la función de prueba de conexión
testConnection();

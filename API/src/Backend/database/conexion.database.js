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

// Función para validar y crear tablas si no existen
const checkAndCreateTables = async () => {
    try {
        // Verificar y crear tabla parqueos
        await db.query(`
            CREATE TABLE IF NOT EXISTS parqueos (
                id SERIAL PRIMARY KEY,
                area VARCHAR(50) NOT NULL,
                estado VARCHAR(20) NOT NULL CHECK (estado IN ('disponible', 'ocupado', 'reservado', 'no disponible'))
            );
        `);

        // Verificar y crear tabla usuarios
        await db.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombres VARCHAR(100) NOT NULL,
                apellidos VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                telefono VARCHAR(15)
            );
        `);

        console.log('Tablas verificadas y creadas si no existían');
    } catch (error) {
        console.error('Error al verificar o crear las tablas', error);
    }
};

// Función para probar la conexión a la base de datos
const testConnection = async () => {
    try {
        const result = await db.query('SELECT NOW()');  // Prueba de consulta
        console.log('Conexión exitosa a la base de datos:', result.rows[0]);
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
    }
};

// Llama a las funciones para verificar tablas y probar la conexión
(async () => {
    await testConnection();
    await checkAndCreateTables();
})();

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
// Función para validar y crear tablas si no existen
const checkAndCreateTables = async () => {
    try {
        // Verificar y crear tabla espacios_estacionamiento
        await db.query(`
            CREATE TABLE IF NOT EXISTS ESPACIOS_ESTACIONAMIENTO (
                id SERIAL PRIMARY KEY,
                area VARCHAR(50) NOT NULL,
                estado VARCHAR(20) NOT NULL CHECK (estado IN ('disponible', 'ocupado', 'reservado', 'noDisponible'))
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
                telefono VARCHAR(15),
                role VARCHAR(20) NOT NULL
            );
        `);

        // Verificar y crear tabla reservas
        await db.query(`
            CREATE TABLE IF NOT EXISTS reservas (
                id_reserva SERIAL PRIMARY KEY,
                id_espacio INT NOT NULL,
                nombreUsuario INT NOT NULL,
                placa VARCHAR(20) NOT NULL,
                fechaReserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'procesado')),

                -- Establecer relación con la tabla espacios_estacionamiento
                CONSTRAINT fk_espacio
                    FOREIGN KEY (id_espacio)
                    REFERENCES ESPACIOS_ESTACIONAMIENTO(id)
                    ON DELETE CASCADE,

                -- Establecer relación con la tabla usuarios
                CONSTRAINT fk_usuario
                    FOREIGN KEY (nombreUsuario)
                    REFERENCES usuarios(id)
                    ON DELETE CASCADE
            );
        `);

        // Verificar y crear tabla para el registro general de los autos que entran y salen
        await db.query(`
            CREATE TABLE IF NOT EXISTS registro_vehiculos (
                id SERIAL PRIMARY KEY,
                placa VARCHAR(20) NOT NULL,
                fechaEntrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fechaSalida TIMESTAMP,
                espacioOcupado INT NOT NULL,

                -- Relación con la tabla espacios_estacionamiento
                CONSTRAINT fk_espacio_ocupado
                    FOREIGN KEY (espacioOcupado)
                    REFERENCES ESPACIOS_ESTACIONAMIENTO(id)
                    ON DELETE SET NULL
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

import { db } from '../database/conexion.database.js';  // Asegúrate de que la conexión esté bien configurada

// Modelo para el dashboard

const cambiarEstadoEspacio=async (id_espacio, estado)=>{


    const query = {
        text: `
        UPDATE ESPACIOS_ESTACIONAMIENTO
        SET ESTADO=$2
        WHERE id=$1
        `,
        values: [id_espacio,estado]
    };
    const { rows } = await db.query(query);
    return rows;

}


const desocuparEspacio=async(id_espacio,estado='disponible')=>
{
    const query = {
        text: `
        UPDATE ESPACIOS_ESTACIONAMIENTO
        SET ESTADO=$2
        WHERE id=$1
        `,
        values: [id_espacio,estado]
    };
    const { rows } = await db.query(query);
    return rows;
}
const ObtenerEspacios = async () => {
    const query = {
        text: `
            SELECT 
                e.id AS id_espacio,
                e.estado AS estado,
                r.placa
            FROM 
                ESPACIOS_ESTACIONAMIENTO e
            LEFT JOIN 
                (SELECT id_espacio, placa 
                 FROM reservas 
                 WHERE estado = 'pendiente'
                 ORDER BY fechaReserva ASC
                 LIMIT 1) r 
            ON e.id = r.id_espacio
            WHERE 
                e.estado IN ('disponible', 'ocupado', 'reservado', 'noDisponible')
        `
    };
    const { rows } = await db.query(query);
    return rows;
};


const ObtenerEspaciosDisponibles=async()=>
{
    const query = {
        text: `
        select id AS id_espacio, estado FROM ESPACIOS_ESTACIONAMIENTO
        WHERE estado='disponible'
        `
    };
    const { rows } = await db.query(query);
    return rows;
}
const ReservarEspacio = async (id_espacio, nombreUsuario, placa, fechaReserva, estado = 'pendiente') => {
    try {
        // Iniciar transacción
        await db.query('BEGIN');

        // Insertar la reservación
        const insertarReservaQuery = {
            text: `
                INSERT INTO reservas (id_espacio, nombreUsuario, placa, fechaReserva, estado)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `,
            values: [id_espacio, nombreUsuario, placa, fechaReserva, estado]
        };
        const reservaResult = await db.query(insertarReservaQuery);

        // Actualizar el estado del espacio a 'reservado'
        const actualizarEspacioQuery = {
            text: `
                UPDATE ESPACIOS_ESTACIONAMIENTO
                SET estado = 'reservado'
                WHERE id = $1
            `,
            values: [id_espacio]
        };
        await db.query(actualizarEspacioQuery);

        // Confirmar transacción
        await db.query('COMMIT');

        return reservaResult.rows[0]; // Retorna la reservación creada
    } catch (error) {
        // Revertir transacción en caso de error
        await db.query('ROLLBACK');
        console.error('Error al reservar el espacio:', error);
        throw error; // Lanza el error para manejarlo en la llamada de la función
    }
};

const ResgistrarVehiculo=async(placa,fechaEntrada,fechaSalida,espacioOcupado)=>
{
    const query = {
        text: `
        INSERT INTO registro_vehiculos (placa,fechaEntrada,fechaSalida,espacioOcupado)
        VALUES ($1,$2,$3,$4)
        `,
        values: [placa,fechaEntrada,fechaSalida,espacioOcupado]
    };
    const { rows } = await db.query(query);
    return rows;
};

const ObtenerRegistroVehiculos = async () => {
    const query = {
        text: `
        SELECT 
            rv.id,
            rv.placa,
            TO_CHAR(rv.fechaEntrada, 'YYYY-MM-DD HH24:MI') AS fechaEntrada,
            TO_CHAR(rv.fechaSalida, 'YYYY-MM-DD HH24:MI') AS fechaSalida,
            rv.espacioOcupado,
            ee.area
        FROM registro_vehiculos rv
        JOIN ESPACIOS_ESTACIONAMIENTO ee
        ON rv.espacioOcupado = ee.id
        `
    };
    const { rows } = await db.query(query);
    return rows;
};

const BuscarReservaPorUsuraio = async (nombreUsuario) => {
    const query = {
        text: `
            SELECT
                r.id_reserva,
                r.id_espacio,
                u.nombres,
                r.placa,
                TO_CHAR(r.fechareserva, 'YYYY-MM-DD HH24:MI') AS fechareserva,
                r.estado
            FROM
                reservas r
            JOIN
                usuarios u ON r.nombreusuario = u.id  -- Suponiendo que 'nombreusuario' es el ID del usuario
            WHERE
                r.nombreusuario= $1
        `,
        values: [nombreUsuario]
    };

    const { rows } = await db.query(query);
    return rows;
};

const ObtenerReservas = async () => {
    const query = {
        text: `
            SELECT 
                u.nombres || ' ' || u.apellidos AS nombreUsuario,
                e.area AS espacioReservado,
                r.fechaReserva,
                r.estado
            FROM 
                reservas r
            JOIN 
                usuarios u ON r.nombreUsuario = u.id
            JOIN 
                ESPACIOS_ESTACIONAMIENTO e ON r.id_espacio = e.id
        `
    };
    
    const { rows } = await db.query(query);
    return rows;
};

// Exportar el modelo
export const dashboardModel = {
    cambiarEstadoEspacio,
    ReservarEspacio,
    ObtenerEspacios,
    desocuparEspacio,
    ObtenerEspaciosDisponibles,
    ResgistrarVehiculo,
    ObtenerRegistroVehiculos,
    ObtenerReservas,
    BuscarReservaPorUsuraio
};


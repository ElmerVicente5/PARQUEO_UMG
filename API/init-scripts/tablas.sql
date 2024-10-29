
 CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombres VARCHAR(100) NOT NULL,
                apellidos VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                telefono VARCHAR(15),
                role VARCHAR(20) NOT NULL
            );

 CREATE TABLE IF NOT EXISTS ESPACIOS_ESTACIONAMIENTO (
                id SERIAL PRIMARY KEY,
                area VARCHAR(50) NOT NULL,
                estado VARCHAR(20) NOT NULL CHECK (estado IN ('disponible', 'ocupado', 'reservado', 'noDisponible'))
            );

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


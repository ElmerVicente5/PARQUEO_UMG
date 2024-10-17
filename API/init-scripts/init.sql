CREATE TABLE FORMULARIO (
    id SERIAL PRIMARY KEY,               -- Campo para identificar de forma única cada registro
    nombres VARCHAR(255) NOT NULL,       -- Campo de texto para nombres
    apellidos VARCHAR(255) NOT NULL,     -- Campo de texto para apellidos
    email VARCHAR(255) NOT NULL UNIQUE,  -- Campo de texto para correo electrónico, debe ser único
    password VARCHAR(255) NOT NULL,      -- Campo de texto para contraseña
    pais VARCHAR(255) NOT NULL,          -- Campo de texto para país
    genero VARCHAR(50) NOT NULL,          -- Campo de texto para género
    terminos BOOLEAN NOT NULL            -- Campo booleano para términos aceptados
);
-- tabla parqueos en PostgreSQL tabla parqueos en PostgreSQL que contendrá los estados de los parqueos por área.
CREATE TABLE parqueos (
    id SERIAL PRIMARY KEY,
    area VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('disponible', 'ocupado', 'reservado', 'no disponible'))
);
-- datos ingresados
INSERT INTO parqueos (area, estado) VALUES
('sur', 'disponible'),
('sur', 'ocupado'),
('sur', 'reservado'),
('sur', 'no disponible'),
('sur', 'disponible'),
('sur', 'ocupado');

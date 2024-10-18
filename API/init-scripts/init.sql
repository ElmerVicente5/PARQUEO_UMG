
-- tabla parqueos en PostgreSQL tabla parqueos en PostgreSQL que contendrá los estados de los parqueos por área.
CREATE TABLE IF NOT EXISTS parqueos (
    id SERIAL PRIMARY KEY,
    area VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('disponible', 'ocupado', 'reservado', 'no disponible'))
);
-- datos ingresados
INSERT INTO IF NOT EXISTS  parqueos (area, estado) VALUES
('sur', 'disponible'),
('sur', 'ocupado'),
('sur', 'reservado'),
('sur', 'no disponible'),
('sur', 'disponible'),
('sur', 'ocupado');


CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(15)
);



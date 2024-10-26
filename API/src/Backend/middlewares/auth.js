import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
// Middleware para verificar el token
// Middleware para verificar el token
export const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extraer el token del header

    if (!token) {
        return res.status(403).json({ mensaje: 'Token no proporcionado' });
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'Token inválido' });
        }
        console.log(decoded);
        req.userId = decoded.id; // Almacena el id del usuario en la solicitud
        req.role = decoded.role; // Almacena el rol del usuario en la solicitud
        next();
    });
};
// Middleware para verificar si el usuario es admin
export const verificarAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ mensaje: 'Acceso denegado: se requiere rol de admin' });
    }
    next();
};

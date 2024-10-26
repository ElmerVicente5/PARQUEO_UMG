
import { authService } from '../services/auth.service.js';
import { body, validationResult } from 'express-validator';


// api/producto/login
const loginUsuario = async (req, res) => {
    await body('email').notEmpty().isEmail().run(req);
    await body('password').notEmpty().isString().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const { usuario, token } = await authService.login(email, password);

        return res.status(200).json({
            message: "Usuario encontrado",
            usuario,
            token // Devolver el token al usuario
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message });
    }
};

// api/producto/registrar
const registrarUsuario = async (req, res) => {
    await body('nombres').notEmpty().isString().run(req);
    await body('apellidos').notEmpty().isString().run(req);
    await body('email').notEmpty().isEmail().run(req);
    await body('password').notEmpty().isString().run(req);
    await body('telefono').notEmpty().isString().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nombres,apellidos, email, password,telefono } = req.body;
        const { usuario, token } = await authService.registrarUsuario(nombres,apellidos, email, password,telefono);
        
        // Emitir evento WebSocket a todos los clientes conectados
        //io.emit('nuevoUsuario', usuario);  // Emitir el evento con los datos del nuevo usuario
        return res.status(201).json({
            message: "Usuario registrado con éxito",
            usuario,
            token // Devolver el token al usuario
        });
    } catch (error) {
        if (error.statusCode === 409 || error.message === "El usuario ya existe") {
            return res.status(409).json({ message: "El usuario ya está registrado" });; 
        }

        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// api/producto/dashboard
const verDashboard = (req, res) => {
    res.status(200).json({ message: 'Se puede acceder al dashboard' });
};

// api/producto/perfil
const verPerfil = async (req, res) => {
    const userId = req.userId; 
    console.log(userId);

    try {
        const usuario = await authService.obtenerUsuarioPorId(userId); 
        if (!usuario) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }
        console.log(usuario);
        return res.status(200).json(usuario);
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Error al obtener el perfil", error });
    }
};
export const UsuarioController = {
    loginUsuario,
    registrarUsuario,
    verDashboard,
    verPerfil
};

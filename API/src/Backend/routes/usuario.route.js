import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { verificarToken, verificarAdmin } from '../middlewares/auth.js'; // Asegúrate de crear este middleware
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { config } from '../config/config.js';
const router = Router();

// Ruta para registrar un usuario (sin autenticación)
router.post('/registrar', UsuarioController.registrarUsuario); // Cambiado a registrarUsuario

// Ruta para iniciar sesión
router.post('/login', UsuarioController.loginUsuario);

// Ruta para autenticar con Google
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Ruta de callback de Google
router.get('/auth/google/callback', passport.authenticate('google', { session: true }), (req, res) => { // Cambia session a true
    // Generar JWT con el id y el rol del usuario
    
    const token = jwt.sign(
        { id: req.user.id, role: req.user.role }, 
        config.jwtSecret,
        { expiresIn: '1h' } 
    );

    // Redirigir al frontend con el token
    res.redirect(`http://localhost:3000/?token=${token}`); 
});


// Ruta para listar productos (requiere autenticación)
router.get('/dashboard', verificarToken,verificarAdmin, UsuarioController.verDashboard); // Ruta protegida
router.get('/perfil', verificarToken, UsuarioController.verPerfil); // Ruta protegida

export default router;

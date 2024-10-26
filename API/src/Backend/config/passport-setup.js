import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { UsuarioModel } from '../models/usuario.model.js'; 
import { config } from './config.js';

// Configuración de la estrategia de Google
passport.use(new GoogleStrategy({
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: '/api/usuario/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Lógica para encontrar o crear un usuario
        let existingUserArray = await UsuarioModel.buscarPorEmail(profile.emails[0].value);
        let existingUser = existingUserArray[0];  // Obtener el primer elemento del array
        
        console.log('Usuario encontrado:', existingUser);
        
        if (existingUser) { 
            return done(null, existingUser);
        }

        // Si el usuario no existe, crear uno nuevo
        const nombres = profile.name.givenName || 'Nombre';
        const apellidos = profile.name.familyName || 'Apellido';
        const email = profile.emails[0].value;
        const telefono = '0000000000'; // Valor por defecto si no se obtiene de Google

        const newUserArray = await UsuarioModel.crearUsuario(
            nombres,
            apellidos,
            email,
            'password', // Contraseña temporal
            telefono,
            'usuario'
        );
        const newUser = newUserArray[0]; // Obtener el primer elemento del array
        console.log('Nuevo usuario creado:', newUser);

        done(null, newUser); 
    } catch (error) {
        console.error("Error al autenticar el usuario con Google:", error); 
        done(error, null);
    }
}));

// Serialización de usuario
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialización de usuario
passport.deserializeUser(async (id, done) => {
    try {
        const userArray = await UsuarioModel.buscarPorId(id);
        const user = userArray[0];  // Obtener el primer elemento del array
        done(null, user); 
    } catch (error) {
        console.error("Error al deserializar el usuario:", error); 
        done(error, null);
    }
});
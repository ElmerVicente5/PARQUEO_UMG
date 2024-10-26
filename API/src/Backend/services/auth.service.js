import { UsuarioModel } from '../models/usuario.model.js';
import {dashboardModel} from  '../models/dashboard.model.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { config } from '../config/config.js'; // Importar la configuración


class AuthService {
    // Método para autenticar un usuario
    async login(email, password) {
        const usuario = await UsuarioModel.buscarPorEmail(email); // Cambiado a buscarPorEmail
        
        if (usuario.length === 0) {
            throw new Error("Usuario no encontrado");
        }

        // Comprobar la contraseña usando bcrypt
        const contrasenaValida = await bcrypt.compare(password, usuario[0].password);
        if (!contrasenaValida) {
            throw new Error("Contraseña incorrecta");
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: usuario[0].id, role: usuario[0].role }, // definir el rol del usuario
            config.jwtSecret,
            { expiresIn: '1h' } 
        );

        return { usuario: usuario[0], token };
    }

    // Método para registrar un usuario
    async registrarUsuario(nombres,apellidos,email,password,telefono, role = 'usuario') { // Agregado rol con valor por defecto
        // Verificar si el usuario ya existe
        const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
        if (usuarioExistente.length > 0) {
            const error = new Error("El usuario ya está registrado");
            error.statusCode = 409; // Código HTTP 409: Conflicto
            throw error; // Lanzar un error 
        }

        // Hashear la contraseña
        const contrasenaHasheada = await bcrypt.hash(password, 10); // 10 es el número de rondas de salting

        // Crear el nuevo usuario
        const nuevoUsuario = await UsuarioModel.crearUsuario(nombres,apellidos,email,contrasenaHasheada,telefono, role);
        console.log("Datos Usuario",nuevoUsuario); // Pasar el rol
        console.log("secret: ",config.jwtSecret);
        // Generar el token JWT
        const token = jwt.sign(
            { id: nuevoUsuario[0].id, role: nuevoUsuario[0].role }, // Pasar el rol
            config.jwtSecret,
            { expiresIn: '1h' }
        );

        return { usuario: nuevoUsuario[0], token }; // Retornar el primer usuario del array
    }
    // Método para obtener un usuario por su ID
    async obtenerUsuarioPorId(userId) {
        const usuario = await UsuarioModel.buscarPorId(userId); // modelo
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        return usuario;
    }
}


class DahboardService
{
    async cambiarEstado(id_espacio, estado) {
        const ocupar = await dashboardModel.cambiarEstadoEspacio(id_espacio, estado);
        
        if(!ocupar)
        {
            throw new Error("no se ocupo el espacio debido a problemas del servidor");

        }
        return ocupar;
    }
    async ObtenerEspacios()
    {
        const espacios=await dashboardModel.ObtenerEspacios();
        if(!espacios)
            {
                throw new Error("no se obtuvo los espacios de la BD");
    
            }
            return espacios;

    }
    async ObtenerEspaciosDisponibles()
    {
        const espacios=await dashboardModel.ObtenerEspaciosDisponibles();
        if(!espacios)
            {
                throw new Error("no se obtuvo los espacios de la BD");
    
            }
            return espacios;
    }

    async ReservarEspacio(id_espacio,nombreUsuario,placa,fechaReserva)
    {
        const reservar=await dashboardModel.ReservarEspacio(id_espacio,nombreUsuario,placa,fechaReserva);
        if(!reservar)
            {
                throw new Error("no se reservo el espacio debido a problemas del servidor");
    
            }
            return reservar;
    }

    async RegistrarVehiculo(placa,fechaEntrada,fechaSalida,espacioOcupado)
    {
        const registrar=await dashboardModel.ResgistrarVehiculo(placa,fechaEntrada,fechaSalida,espacioOcupado);
        if(!registrar)
            {
                throw new Error("no se registro el vehiculo debido a problemas del servidor");
    
            }
            return registrar;
    }
    async ObtenerRegistroVehiculos()
    {
        const registro=await dashboardModel.ObtenerRegistroVehiculos();
        if(!registro)
            {
                throw new Error("no se obtuvo el registro de vehiculos debido a problemas del servidor");
    
            }
            return registro;
    }

    async BuscarReservaPorUsuraio(nombreUsuario){
        const reservas=await dashboardModel.BuscarReservaPorUsuraio(nombreUsuario);
        if(!reservas)
            {
                throw new Error("no se obtuvo las reservas de la BD");
    
            }
            return reservas;
    }
    async ObtenerReservas()
    {
        const reservas=await dashboardModel.ObtenerReservas();
        if(!reservas)
            {
                throw new Error("no se obtuvo las reservas de la BD");
    
            }
            return reservas;
    }


}

export const authService = new AuthService();

export const dashService=new DahboardService();

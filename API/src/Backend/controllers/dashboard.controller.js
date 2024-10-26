import { authService, dashService } from '../services/auth.service.js';
import { body, validationResult } from 'express-validator';
import { io } from '../index.js';

// api/dashboard/ocupar
const cambiarEstadoEspacio = async (req, res) => {
    // Validar que id_espacio no esté vacío y sea un número entero
    await body('id_espacio').notEmpty().isInt().run(req);

    // Validar que estado sea uno de los valores permitidos
    await body('estado')
        .notEmpty()
        .isIn(['disponible', 'ocupado', 'reservado', 'noDisponible'])
        .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_espacio, estado } = req.body;

        // Actualiza el espacio con el nuevo estado
        await dashService.cambiarEstado(id_espacio, estado);

        // Obtener los espacios actualizados
        const espacios = await dashService.ObtenerEspacios();  

        // Emitir el nuevo estado a través del WebSocket
        io.emit('estadoParqueo', espacios);

        return res.status(200).json({ message: `Espacio ${id_espacio} cambiado a estado ${estado}` });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: error.message });
    }
};

// api/dashboard/espacios
const ObtenerEspacios = async (req,res) => {  // Cambiado para no usar req y res
    try {
        const espacios = await dashService.ObtenerEspacios(); // Devuelve los espacios
        return res.status(200).json({ espacios}); // Devuelve los espacios
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: error.message }); // Lanza el error para manejarlo
    }
};

const ObtenerEspaciosDisponibles=async(req,res)=>{
    try{
        const EspaciosDisponible=await dashService.ObtenerEspaciosDisponibles();
        return res.status(200).json({ EspaciosDisponible});
    }catch(error){
        console.log(error);
        return res.status(401).json({ error: error.message });
    }
};
const ReservarEspacio=async(req,res)=>
{
    await body('id_espacio').notEmpty().isInt().run(req);
    await body('placa').notEmpty().isString().run(req);
    await body('fechaReserva').notEmpty().isString().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    try{
        const{id_espacio,placa,fechaReserva}=req.body;
        const nombreUsuario = req.userId;
        const ReservarEspacio=await dashService.ReservarEspacio(id_espacio,nombreUsuario,placa,fechaReserva);

        // Obtener los espacios actualizados
            const espacios = await dashService.ObtenerEspacios();

          // Emitir el nuevo estado a través del WebSocket
          io.emit('estadoParqueo', espacios);

            // Emitir el nuevo estado a través del WebSocket
            return res.status(200).json({ message: `Espacio ${id_espacio} cambiado a estado reservado` });
        
    }catch(error){
        console.log(error);
        return res.status(401).json({ error: error.message });
    }
};

const RegistrarVehiculo=async(req,res)=>
{
    await body('placa').notEmpty().isString().run(req);
    await body('fechaEntrada').notEmpty().isString().run(req);
    await body('fechaSalida').notEmpty().isString().run(req);
    await body('espacioOcupado').notEmpty().isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    

    try{
        const{placa,fechaEntrada,fechaSalida,espacioOcupado}=req.body;
        const Registrar=await dashService.RegistrarVehiculo(placa,fechaEntrada,fechaSalida,espacioOcupado);

        return res.status(200).json({ message: `Vehiculo Registrado Correctamente` });
    }catch(error){
        console.log(error);
        return res.status(401).json({ error: error.message });
    }
};

const ObtenerRegistroVehiculos=async(req,res)=>
{
    try{
        const registro=await dashService.ObtenerRegistroVehiculos();
        return res.status(200).json({ registro});
    }catch(error){
        console.log(error);
        return res.status(401).json({ error: error.message });
    }
};

const ObtenerReservasPorUsuario = async (req, res) => {
    // No se necesita validar el nombreUsuario desde el cuerpo, ya que viene del token
    try {
        const nombreUsuario = req.userId; // Asignar el nombreUsuario desde el token verificado

        // Llamada al servicio para buscar reservas por usuario
        const reservas = await dashService.BuscarReservaPorUsuraio(nombreUsuario);

        // Devolver las reservas encontradas
        return res.status(200).json({ reservas });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: error.message });
    }
};

const obtenerReservas=async(req,res)=>
{
    try{
        const reservas=await dashService.ObtenerReservas();
        return res.status(200).json({ reservas});
    }catch(error){
        console.log(error);
        return res.status(401).json({ error: error.message });
    }
}

export const dashboardController = {
    cambiarEstadoEspacio,
    ObtenerEspacios,
    ObtenerEspaciosDisponibles,
    ReservarEspacio,
    RegistrarVehiculo,
    ObtenerRegistroVehiculos,
    ObtenerReservasPorUsuario,
    obtenerReservas
};

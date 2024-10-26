import express from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { verificarToken, verificarAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Definir la ruta para obtener los datos del dashboard
router.post('/estadoEspacio', dashboardController.cambiarEstadoEspacio);
router.get('/espacios',dashboardController.ObtenerEspacios);
router.get('/espaciosDisponibles',dashboardController.ObtenerEspaciosDisponibles);
router.post('/reservarEspacio',verificarToken,dashboardController.ReservarEspacio);
router.post('/registrarVehiculo',dashboardController.RegistrarVehiculo);
router.get('/obtenerReservas',dashboardController.obtenerReservas);
router.post('/obtenerReservasPorUsuario',verificarToken,dashboardController.ObtenerReservasPorUsuario);
router.get('/obtenerRegistroVehiculos',dashboardController.ObtenerRegistroVehiculos);

export default router;

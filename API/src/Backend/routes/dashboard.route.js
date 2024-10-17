import express from 'express';
import { obtenerDatosDashboardHandler } from '../controllers/dashboard.controller.js';

const router = express.Router();

// Definir la ruta para obtener los datos del dashboard
router.get('/dashboard', obtenerDatosDashboardHandler);

export default router;

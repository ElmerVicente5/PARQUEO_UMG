import{Router} from 'express';
import {UsuarioController} from '../controllers/usuario.controller.js';

const router=Router();


router.post('/registrar',UsuarioController.registrar);
router.get('/login',UsuarioController.iniciarSesion);




export default router;
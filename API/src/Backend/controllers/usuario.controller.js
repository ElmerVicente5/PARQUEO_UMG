import {UsuarioModel} from '../models/usuario.model.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

//api/usuario/registrar
const registrar=async(req,res)=>{

    //validar los datos recibidos
    await body('nombres').notEmpty().isString().run(req);
    await body('apellidos').notEmpty().isString().run(req);
    await body('email').notEmpty().isEmail().run(req);
    await body('password').notEmpty().isString().run(req);
    await body('telefono').notEmpty().isString().run(req);

    const errors = validationResult(req);
    console.log("errores",errors);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log(req.body);
        const {nombres,apellidos,email,password,telefono}=req.body;


        //busca el correo en la BD
        const usuario=await UsuarioModel.buscarUsuarioPorEmail(email);
        //si el correo ya está registrado
        if(usuario.length>0){
            //alert("El correo ya está registrado, por favor ingrese otro correo");
            return res.status(400).json({message:"El correo ya está registrado"});
        }
        // Hashear la contraseña
        const saltRounds = 10; // Número de rondas para generar la sal
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const nuevoUsuario=await UsuarioModel.crearUsuario(nombres,apellidos,email,hashedPassword,telefono);
        
        //res.status(201).json(usuario);
        return res.status(201).json({message:"Usuario creado"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message});
    }
}
const iniciarSesion = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validar que se reciban los datos
        await body('email').notEmpty().isEmail().run(req);
        await body('password').notEmpty().isString().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Buscar el usuario por email
        const usuario = await UsuarioModel.buscarUsuarioPorEmail(email);

        if (usuario.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Comparar la contraseña ingresada con la almacenada
        const passwordValida = await bcrypt.compare(password, usuario[0].password);

        if (!passwordValida) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Si todo es correcto
        return res.status(200).json({ message: "Login exitoso", usuario: usuario[0] });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
};


export const UsuarioController={
    registrar,
    iniciarSesion

}
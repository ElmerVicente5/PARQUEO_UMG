import {db} from '../database/conexion.database.js';

const crearUsuario=async(nombres,apellidos,email,password,telefono)=>{
    const query={
        text:`
            INSERT INTO usuarios(nombres,apellidos,email,password,telefono)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *
        `,
        values:[nombres,apellidos,email,password,telefono]
    }
    const {rows}=await db.query(query);
    return rows;

}


const buscarUsuarioPorEmail=async(email)=>{
    const query={
        text:`
            SELECT email,password FROM usuarios WHERE EMAIL=$1
        `,
        values:[email]
    }
    const {rows}=await db.query(query);
    return rows;
}




export const UsuarioModel={
    crearUsuario,
    buscarUsuarioPorEmail
}
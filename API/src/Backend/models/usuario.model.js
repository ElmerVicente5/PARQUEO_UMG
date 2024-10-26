import { db } from '../database/conexion.database.js';


// Método para registrar un nuevo usuario
const crearUsuario = async (nombres,apellidos, email, password,telefono, role = 'usuario') => {
    
    const query = {
        text: `
        INSERT INTO USUARIOS(NOMBRES,APELLIDOS, EMAIL, PASSWORD,TELEFONO, ROLE)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        values: [nombres,apellidos, email, password,telefono, role]
    };
    const { rows } = await db.query(query);
    return rows;
};

// Método para buscar un usuario por email
const buscarPorEmail = async (email) => {
    const query = {
        text: `
        SELECT * FROM USUARIOS WHERE EMAIL=$1
        `,
        values: [email]
    };
    const { rows } = await db.query(query);
    return rows;
};

// Método para iniciar sesión
const login = async (email) => {
    const query = {
        text: `
        SELECT * FROM USUARIOS WHERE EMAIL=$1
        `,
        values: [email]
    };
    const { rows } = await db.query(query);
    return rows;
};

const buscarPorId=async(id)=>{
    const query={
        text:`
        SELECT * FROM USUARIOS WHERE ID=$1
        `,
        values:[id]
    };
    const {rows}=await db.query(query);
    return rows;
}
// Exportar el modelo
export const UsuarioModel = {
    crearUsuario,
    buscarPorEmail,
    login,
    buscarPorId
};

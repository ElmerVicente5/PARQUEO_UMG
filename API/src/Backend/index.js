import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import usuarioRouter from './routes/usuario.route.js';
import dashboardRouter from './routes/dashboard.route.js';
import { dashboardModel } from './models/dashboard.model.js';
import session from 'express-session';
import passport from 'passport'; // Importar passport
import './config/passport-setup.js';
import { config } from './config/config.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    secret: 'f9f8a7f6e5d4c3b2a1s0d9s8h7g6f5e4d3c2b1a', // Cambia esto por una clave secreta
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());



// Rutas para la API REST
app.use('/api/usuario', usuarioRouter);
app.use('/api/dashboard', dashboardRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`El servidor de la API se está ejecutando en el puerto: ${PORT}`);
});

// WebSocket en el puerto 8080
const socketPort = process.env.SOCKET_PORT || 8001;
const socketApp = express();
const socketServer = createServer(socketApp);

const io = new SocketIOServer(socketServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
});

// Aquí almacenaremos los estados de los espacios
let espaciosParqueo = [];

const cargarEspaciosParqueo = async () => {
    const espacios = await dashboardModel.ObtenerEspacios();
    //console.log("obteniendo espacios");
    //console.log(espacios);
    espaciosParqueo = espacios;
};

// Escuchamos eventos de conexión en Socket.IO
io.on('connection', async (socket) => {  // Asegúrate de que la función sea async
    await cargarEspaciosParqueo();  // Espera a que se carguen los espacios
    console.log('Cliente conectado a WebSocket');

    // Emitir el estado inicial de los espacios de parqueo
    socket.emit('estadoParqueo', espaciosParqueo);
    console.log('Estado inicial de parqueo emitido:', espaciosParqueo);

    // Desconexión de un cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado de WebSocket');
    });
});

// Exportar io para usarlo en las rutas
export { io };

// Servidor web ejecutándose desde el puerto
socketServer.listen(socketPort, () => {
    console.log(`Servidor WebSocket ejecutándose en el puerto: ${socketPort}`);
});

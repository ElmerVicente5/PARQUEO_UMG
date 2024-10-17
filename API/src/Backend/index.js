import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usuarioRouter from './routes/usuario.route.js';
import dashboardRouter from './routes/dashboard.route.js';  // Import the dashboard routes

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rutas 
app.use('/api/usuario', usuarioRouter);
app.use('/api', dashboardRouter); 

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`El servidor se está ejecutando en el puerto: ${PORT}`);
});

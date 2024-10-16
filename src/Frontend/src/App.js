import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';

import Dashboard from './components/Dashboard';
import Reportes from './components/Reportes';
import Reserva from './components/Reserva';
import ConfiguracionPerfil from './components/ConfiguracionPerfil'; 
import 'bootstrap/dist/css/bootstrap.min.css'; // Estilos de Bootstrap

function App() {
    const [userName, setUserName] = useState(''); // Estado del nombre de usuario

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                <Route path="/dashboard" element={<Dashboard userName={userName} />} /> {/* Pasamos userName */}
                <Route path="/reportes" element={<Reportes userName={userName} />} />   {/* Pasamos userName */}
                <Route path="/reserva" element={<Reserva userName={userName} />} />     {/* Pasamos userName */}
                <Route path="/configuracion-perfil" element={<ConfiguracionPerfil setUserName={setUserName} />} />
            </Routes>
        </Router>
    );
}

export default App;

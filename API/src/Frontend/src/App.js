import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Reportes from './components/Reportes';
import Reserva from './components/Reserva';
import VerReservas from './components/VerReservas'; 
import VerMisReservas from './components/VerMisReservas';
import ConfiguracionPerfil from './components/ConfiguracionPerfil'; 
import 'bootstrap/dist/css/bootstrap.min.css'; // Estilos de Bootstrap
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/RutasProtegidas'; //rutas protegidas

function App() {
    const [userName, setUserName] = useState(''); // Estado del nombre de usuario

    return (
        // Montar el Socket y el AuthProvider
        <SocketProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        {/* Ruta pública para Dashboard */}
                        <Route path="/dashboard" element={<Dashboard userName={userName} />} /> {/* Sin protección */}
                        
                        {/* Protege la ruta de Reportes para roles admin y usuario */}
                        <Route 
                            path="/reportes" 
                            element={
                                <ProtectedRoute allowedRoles={['Admin', 'usuario']}>
                                    <Reportes userName={userName} />
                                </ProtectedRoute>
                            } 
                        />

                        
                        {/* Protege la ruta de Ver Reservas */}
                        <Route 
                            path="/ver-reservas" 
                            element={
                                <ProtectedRoute allowedRoles={['Admin', 'usuario']}>
                                    <VerReservas userName={userName} /> {/* Asegúrate de usar VerReservas aquí */}
                                </ProtectedRoute>
                            } 
                        />

                        
                        
                        {/* Protege la ruta de Reserva */}
                        <Route 
                            path="/reserva" 
                            element={
                                <ProtectedRoute>
                                    <Reserva userName={userName} />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/MisReservas" 
                            element={
                                <ProtectedRoute>
                                    <VerMisReservas userName={userName} />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Protege la ruta de Configuración de Perfil */}
                        <Route 
                            path="/configuracion-perfil" 
                            element={
                                <ProtectedRoute>
                                    <ConfiguracionPerfil setUserName={setUserName} />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Ruta de acceso denegado */}
                        <Route path="/unauthorized" element={<h1>Acceso Denegado</h1>} />
                    </Routes>
                </Router>
            </AuthProvider>
        </SocketProvider>
    );
}

export default App;

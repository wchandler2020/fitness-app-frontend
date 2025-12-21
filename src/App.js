// src/App.jsx
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FitnessAuth from './components/authentication/FitnessAuth';
import ClientDashboard from './components/home/dashboard/ClientDashboard';
import ProfilePage from './components/profile/ProfilePage'; // ADD THIS

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Home */}
                <Route path="/" element={<ClientDashboard />} />

                {/* Auth (login/register) */}
                <Route path="/auth" element={<FitnessAuth />} />

                {/* Profile - ADD THIS */}
                <Route path="/profile" element={<ProfilePage />} />

                {/* Fallback: anything unknown -> home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
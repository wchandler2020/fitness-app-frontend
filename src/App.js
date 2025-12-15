// src/App.jsx
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FitnessAuth from './components/authentication/FitnessAuth';
import HomePage from './components/home/HomePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Home */}
                <Route path="/" element={<HomePage />} />

                {/* Auth (login/register) */}
                <Route path="/auth" element={<FitnessAuth />} />

                {/* Fallback: anything unknown -> home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

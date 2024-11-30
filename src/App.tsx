import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Gallery from './components/Gallery';
import UploadPage from './components/UploadPage';
import Landing from './components/Landing';
import Login from './components/Login';
const gallery_path: string = '/gallery';
const upload_path: string = '/upload';
const login_path: string = '/login';
const backend_hostname: string = 'http://localhost:9999/api/verify';

const AppContent: React.FC = () => {
    const [user, setUser] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setEmail(parsedUser.email);
            setName(parsedUser.name);
        }
    }, []);

    const handleLogin = async () => {
        console.log('Logged in successfully');
    };

    const handleLogout = () => {
        setUser(null);
        setEmail(null);
        setName(null);
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <>
            <nav style={{
                fontFamily: 'Courier New, monospace',
                backgroundColor: '#ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'fixed',
                padding: '10px 0',
                top: '0',
                left: '0',
                width: '100%',
                zIndex: 9999,
            }}>
                <div style={{
                    display: 'flex',
                }}>
                    <Link to='/' style={{
                        textDecoration: 'none',
                        padding: '10px',
                        color: 'black',
                    }}>Home</Link>
                    <Link to={gallery_path} style={{
                        textDecoration: 'none',
                        padding: '10px',
                        pointerEvents: user ? 'auto' : 'none',
                        color: user ? 'black' : 'gray',
                    }}>Gallery</Link>
                    <Link to={upload_path} style={{
                        textDecoration: 'none',
                        padding: '10px',
                        pointerEvents: user ? 'auto' : 'none',
                        color: user ? 'black' : 'gray',
                    }}>Upload</Link>
                </div>
                <div style={{
                    display: 'flex',
                    marginRight: '10px',
                }}>
                    {user ? (
                        <Link to='/' style={{
                            textDecoration: 'none',
                            color: 'black',
                            padding: '10px',
                            cursor: 'pointer'
                        }} onClick={handleLogout}>Logout</Link>
                    ) : (
                        <Link to={login_path} style={{
                            textDecoration: 'none',
                            color: 'black',
                            padding: '10px',
                            cursor: 'pointer'
                        }} onClick={handleLogin}>Login</Link>
                    )}
                </div>
            </nav>
            <Routes>
                <Route path='/' element={<Landing name={name}/>} />
                <Route path={gallery_path} element={<Gallery />} />
                <Route path={upload_path} element={<UploadPage />} />
                <Route path={login_path} element={<Login />} />
            </Routes>
        </>
    );
}

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;

import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Gallery from './components/Gallery';
import UploadPage from './components/UploadPage';
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

const gallery_path: string = '/gallery';
const upload_path: string = '/upload';
const login_path: string = '/login';
const signup_path: string = '/signup';
const dashboard_path: string = '/dashboard';

const AppContent: React.FC = () => {
    const [user, setUser] = useState<boolean>(false);
    const navigate = useNavigate();

    const validateSessionLocal = (token: string): boolean => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp > currentTime;
        } catch (e) {
            console.error('Error decoding token:', e);
            return false;
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        setUser(false);
        navigate('/');
    };

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            const isValid = validateSessionLocal(token);
            setUser(isValid);
        } else {
            setUser(false);
        }
    }, [navigate]);

    return (
        <>
            <nav
                style={{
                    fontFamily: 'Arial, monospace',
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
                }}
            >
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <Link
                        to="/dashboard"
                        style={{
                            textDecoration: 'none',
                            padding: '10px',
                            color: 'black',
                        }}
                    >
                        Home
                    </Link>
                    <Link
                        to={gallery_path}
                        style={{
                            textDecoration: 'none',
                            padding: '10px',
                            pointerEvents: user ? 'auto' : 'none',
                            color: user ? 'black' : 'gray',
                        }}
                    >
                        Gallery
                    </Link>
                    <Link
                        to={upload_path}
                        style={{
                            textDecoration: 'none',
                            padding: '10px',
                            pointerEvents: user ? 'auto' : 'none',
                            color: user ? 'black' : 'gray',
                        }}
                    >
                        Upload
                    </Link>
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginRight: '10px',
                    }}
                >
                    {user ? (
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                color: 'black',
                                padding: '10px',
                                cursor: 'pointer',
                            }}
                            onClick={handleLogout}
                        >
                            Logout
                        </Link>
                    ) : (
                        <Link
                            to={login_path}
                            style={{
                                textDecoration: 'none',
                                color: 'black',
                                padding: '10px',
                                cursor: 'pointer',
                            }}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path={gallery_path} element={<Gallery />} />
                <Route path={upload_path} element={<UploadPage />} />
                <Route path={login_path} element={<Login />} />
                <Route path={signup_path} element={<Signup />} />
                <Route path={dashboard_path} element={<Dashboard />} />
            </Routes>
        </>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;

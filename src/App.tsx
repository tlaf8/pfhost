import {BrowserRouter as Router, Link, Route, Routes, useNavigate, useLocation} from 'react-router-dom';
import React, {useCallback, useEffect, useState} from 'react';
import Gallery from './components/Gallery';
import UploadPage from './components/UploadPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import axios, {isAxiosError} from "axios";

const gallery_path: string = '/gallery';
const upload_path: string = '/upload';
const login_path: string = '/login';
const signup_path: string = '/signup';
const dashboard_path: string = '/dashboard';

const AppContent: React.FC = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [userDir, setUserDir] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const validateSession = useCallback(async () => {
        try {
            if (location.pathname === '/signup' || location.pathname === '/login') return;
            const token = sessionStorage.getItem('authToken');
            if (!token) handleLogout();

            const response = await axios.get(`https://pfhost.duckdns.org/api/token`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUserId(response.data.id);
            setUsername(response.data.username);
            setUserDir(response.data.path);
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.status === 401) {
                    console.error('Session is invalid or expired. Please log in again.');
                } else {
                    console.error('An unknown error occurred while validating session. Please log in again.');
                }
            } else {
                console.error('An unknown error occurred. Please log in again.');
            }
            handleLogout()
        }
    }, [location.pathname, navigate]);

    useEffect(() => {
        validateSession().catch((error) => {
            console.error(error);
        })
    }, [navigate, validateSession])

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        setUserId(null);
        setUsername(null);
        setUserDir(null);
        navigate('/login');
    };

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
                <div style={{display: 'flex'}}>
                    {(userId !== null) ? (
                        <Link to='/dashboard' className='link'>Home</Link>
                    ) : (
                        <Link to='/login' className='link' style={{color: 'grey'}}>Home</Link>
                    )}

                    {(userId !== null) ? (
                        <Link to={gallery_path} className='link'>Gallery</Link>
                    ) : (
                        <Link to='/login' className='link' style={{color: 'grey'}}>Gallery</Link>
                    )}

                    {(userId !== null) ? (
                        <Link to={upload_path} className='link'>Upload</Link>
                    ) : (
                        <Link to='/login' className='link' style={{color: 'grey'}}>Upload</Link>
                    )}
                </div>
                <div style={{display: 'flex', marginRight: '10px'}}>
                    {userId !== null ? (
                        <Link to='/login' className='link' onClick={handleLogout}>Logout</Link>
                    ) : (
                        <p style={{ color: 'black', marginRight: '10px'}}></p>
                    )}
                </div>
            </nav>
            <Routes>
                <Route path={gallery_path} element={<Gallery userDir={userDir}/>}/>
                <Route path={upload_path} element={<UploadPage userDir={userDir}/>}/>
                <Route path={login_path} element={<Login/>}/>
                <Route path={signup_path} element={<Signup/>}/>
                <Route path={dashboard_path} element={<Dashboard authUsername={username}/>}/>
            </Routes>
        </>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AppContent/>
        </Router>
    );
};

export default App;

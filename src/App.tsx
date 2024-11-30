import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import Gallery from './components/Gallery';
import UploadPage from './components/UploadPage';
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';

const gallery_path: string = '/gallery';
const upload_path: string = '/upload';
const login_path: string = '/login';
const signup_path: string = '/signup';

const AppContent: React.FC = () => {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
        }
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <>
            <nav style={{
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
            }}>
                <div style={{
                    display: 'flex',
                }}>
                    <Link to='/' style={{
                        textDecoration: 'none', padding: '10px', color: 'black',
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
                    display: 'flex', marginRight: '10px',
                }}>
                    {user ? (<Link to='/' style={{
                        textDecoration: 'none', color: 'black', padding: '10px', cursor: 'pointer'
                    }} onClick={handleLogout}>Logout</Link>) : (<Link to={login_path} style={{
                        textDecoration: 'none', color: 'black', padding: '10px', cursor: 'pointer'
                    }}>Login</Link>)}
                </div>
            </nav>
            <Routes>
                <Route path='/' element={<Landing/>}/>
                <Route path={gallery_path} element={<Gallery/>}/>
                <Route path={upload_path} element={<UploadPage/>}/>
                <Route path={login_path} element={<Login/>}/>
                <Route path={signup_path} element={<Signup/>}/>
            </Routes>
        </>
    );
}

const App = () => {
    return (
        <Router>
            <AppContent/>
        </Router>
    );
}

export default App;

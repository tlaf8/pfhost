import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Gallery from './components/Gallery';
import UploadPage from './components/UploadPage';
import Landing from './components/Landing';

const gallery_path: string = '/gallery';
const upload_path: string = '/upload';
const backend_hostname: string = 'http://localhost:9999/api/verify';

// Create a separate component for the main app content
const AppContent: React.FC = () => {
    const [user, setUser] = useState<CredentialResponse | null>(null);
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

    const handleLoginSuccess = async (response: CredentialResponse) => {
        const cred = response.credential;

        if (cred) {
            try {
                const res = await axios.post(backend_hostname, {
                    token: cred,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log(res);
                const { email, name } = res.data;
                setEmail(email);
                setName(name);

                const userData = { ...response, email, name };
                localStorage.setItem('user', JSON.stringify(userData));

                navigate('/');
            } catch (error) {
                alert("Error logging in. Check console for details.");
                console.error('Error occurred when logging in: ', error);
            }
        }
        setUser(response);
    };

    const handleLoginFailure = (error: never) => {
        console.error('Login Failed:', error);
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
                        <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={handleLoginFailure}
                            useOneTap
                        />
                    )}
                </div>
            </nav>
            <Routes>
                <Route path='/' element={<Landing name={name}/>} />
                <Route path={gallery_path} element={<Gallery />} />
                <Route path={upload_path} element={<UploadPage />} />
            </Routes>
        </>
    );
}

const App = () => {
    return (
        <GoogleOAuthProvider clientId="813752976718-2qc5oeg805bp216bc4tddb4b6v2k7jta.apps.googleusercontent.com">
            <Router>
                <AppContent />
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;

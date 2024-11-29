import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';  // Import Google OAuth components
import Gallery from './components/Gallery';
import UploadPage from './components/UploadPage';
import Landing from './components/Landing';

const gallery_path: string = '/gallery';
const upload_path: string = '/upload';
const static_path: string = '/api/static';
const backend_hostname: string = 'http://localhost:9999/api/verify'

const App = () => {
    const [user, setUser] = useState<CredentialResponse | null>(null); // Type the state

    // Handle login success
    const handleLoginSuccess = (response: CredentialResponse) => {
        // Store the response, typically including the access token
        setUser(response);
    };

    // Handle login failure
    const handleLoginFailure = (error: never) => {
        console.error('Login Failed:', error);
    };

    // Handle logout
    const handleLogout = () => {
        setUser(null); // Clear the user data
    };

    return (
        <GoogleOAuthProvider clientId="813752976718-2qc5oeg805bp216bc4tddb4b6v2k7jta.apps.googleusercontent.com">
            <Router>
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
                            color: 'black',
                            padding: '10px'
                        }}>Gallery</Link>
                        <Link to={upload_path} style={{
                            textDecoration: 'none',
                            color: 'black',
                            padding: '10px'
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
                    <Route path='/' element={<Landing />} />
                    <Route path={gallery_path} element={<Gallery />} />
                    <Route path={upload_path} element={<UploadPage />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;

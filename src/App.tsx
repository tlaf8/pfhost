import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import Gallery from './components/Gallery';
import UploadPage from './components/UploadPage';
import axios from 'axios';

const gallery_path = '/gallery';
const login_path = '/login';
const logout_path = '/logout';
const upload_path = '/upload';
const static_path = '/api/static';

const App = () => {
    return (
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
                    display: 'flex'
                }}>
                    <Link to={logout_path} style={{
                        textDecoration: 'none',
                        color: 'black',
                        padding: '10px'
                    }}>Logout</Link>
                </div>
            </nav>
            <Routes>
                <Route path='/' element={<h1>Hello world!</h1>}/>
                <Route path={gallery_path} element={<Gallery/>}/>
                <Route path={upload_path} element={<UploadPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import axios from 'axios';

const gallery_path = '/gallery';
const login_path = '/login';
const upload_path = '/api/upload';
const static_path = '/api/static';

const App = () => {
    return (
        <Router>
            <nav style={{
                padding: '10px',
                backgroundColor: '#ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{
                    display: 'flex',
                }}>
                    <Link to='/gallery' style={{
                        textDecoration: 'none',
                        color: 'black',
                        padding: '5px'
                    }}>Gallery</Link>
                    <Link to='/upload' style={{
                        textDecoration: 'none',
                        color: 'black',
                        padding: '5px'
                    }}>Upload</Link>
                </div>
                <div style={{
                    display: 'flex'
                }}>
                    <Link to='/logout' style={{
                        textDecoration: 'none',
                        color: 'black',
                        padding: '5px'
                    }}>Logout</Link>
                </div>
            </nav>
        </Router>
    );
}

export default App;
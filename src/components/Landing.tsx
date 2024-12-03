import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const Landing: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');

        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div style={{
            marginTop: '70px',
            fontFamily: 'Arial, monospace',
        }}>
            <p style={{
                fontSize: '20px',
            }}>
                Welcome! To get started, please log in.
            </p>
        </div>
    );
}

export default Landing;

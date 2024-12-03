import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');

        if (!token) {
            navigate('/');
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
                Welcome back!
            </p>
        </div>
    );
}

export default Dashboard;

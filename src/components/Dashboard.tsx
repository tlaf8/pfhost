import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [error] = useState<string | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');

        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const validateSession = async (token: string | null) => {
        if (!token) {
            return -1;
        }

        try {
            const response = await axios.get('http://localhost:9999/api/protected', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.userId;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    alert('Session is invalid or expired. Please log in again.');
                } else {
                    alert('An unknown error occurred while validating session. Please log in again.');
                }
            } else {
                alert('An unknown error occurred. Please log in again.');
            }
            sessionStorage.removeItem('authToken');
            navigate('/login');
        }
    };

    const tryValidating = async () => {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            alert('No token found');
        }
        alert(await validateSession(token));
    }

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

            {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

            <button onClick={tryValidating}>Test Token Validation</button>
        </div>
    );
};

export default Dashboard;


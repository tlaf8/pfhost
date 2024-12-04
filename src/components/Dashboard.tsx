import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

interface DashboardProps {
    authUserId: number | null,
    authUsername: string | null
}

const Dashboard: React.FC<DashboardProps> = ({authUserId, authUsername}) => {
    const navigate = useNavigate();
    const [error] = useState<string | null>(null);

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
                Welcome back, {authUsername}.
            </p>

            {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}
        </div>
    );
};

export default Dashboard;


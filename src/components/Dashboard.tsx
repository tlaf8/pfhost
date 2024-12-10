import React, {useState} from 'react';

interface DashboardProps {
    authUsername: string | null
}

const Dashboard: React.FC<DashboardProps> = ({authUsername}) => {
    const [error] = useState<string | null>(null);

    return (
        <div style={{
            marginTop: '70px',
            fontFamily: 'Arial, monospace',
        }}>
            <p style={{
                fontSize: '20px',
            }}>
                Welcome back, <span style={{
                    color: '#007bff',
                }}>{authUsername}</span>.
            </p>
            {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}
        </div>
    );
};

export default Dashboard;


import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";

const UploadPage: React.FC = () => {
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
            <p>Upload page</p>
        </div>
    )
}

export default UploadPage;
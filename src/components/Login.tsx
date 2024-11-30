import React, {useState} from 'react';
import axios, {AxiosError} from 'axios';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Username or password is required.');
            setSuccess('');
            return;
        }

        try {
            const response = await axios.post('http://localhost:9999/api/login', {
                username,
                password
            });

            if (response.status === 200) {
                setSuccess('successful');
                setError('');
                setUsername('');
                setPassword('');
                window.location.href = '/';
            }
        } catch (error: AxiosError) {
            if (error.response.status === 401) {
                setSuccess('');
                setError('Invalid username or password.');
                setPassword('');
            } else {
                setSuccess('');
                setError(error.response.data?.message || 'An unknown error occurred during login.');
                setUsername('');
                setPassword('');
                console.error('Error:', error);
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '70px',
            fontFamily: 'Arial, monospace',
        }}>
            <div style={{
                width: '25em',
            }}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{
                        marginBottom: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <label htmlFor='username'>Username</label>
                        <input
                            type='text'
                            id='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: 'auto',
                                padding: '8px',
                                marginTop: '4px'
                            }}/>
                    </div>

                    <div style={{
                        marginBottom: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: 'auto',
                                padding: '8px',
                                marginTop: '4px'
                            }}/>
                    </div>

                    {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}

                    <button type='submit' style={{
                        width: '25%',
                        padding: '10px',
                        margin: '10px 0',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px'
                    }}>
                        Login
                    </button>
                </form>
                <a style={{
                    fontSize: '12px',
                    textDecoration: 'none',
                    color: 'blue',
                }} href='/signup'>No account?</a>
            </div>
        </div>
    );
};

export default LoginPage;

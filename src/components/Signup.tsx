import React, { useState } from 'react';
import axios from "axios";

const SignUpPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !email || !password || !confirmPassword) {
            setError('All fields are required.');
        } else if (password !== confirmPassword) {
            setError('Passwords do not match.');
        } else {
            try {
                const response = await axios.post('http://localhost:9999/api/register', {
                    username,
                    email,
                    password
                });
                if (response.status === 200) {
                    setError('');
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    alert('Successfully registered!');
                    window.location.href = '/';
                } else {
                    setError('');
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setError('Signup failed. Check console for details.');
                    console.log(response);
                }
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.message || 'An error occurred during login.');
                    console.error('Error:', error);
                }
            }
            setError('');
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
                <h2>Sign Up</h2>
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
                        <label htmlFor='email'>Email</label>
                        <input
                            type='text'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    <div style={{
                        marginBottom: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <label htmlFor='confirmPassword'>Confirm Password</label>
                        <input
                            type='password'
                            id='confirmPassword'
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                            }}
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
                        Sign Up
                    </button>
                </form>
                <a style={{
                    fontSize: '12px',
                    textDecoration: 'none',
                    color: 'blue',
                }} href='/login'>Already a user?</a>
            </div>
        </div>
    );
};

export default SignUpPage;

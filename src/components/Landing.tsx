import React from 'react';

interface LandingProps {
    name: string | null;
}

const Landing: React.FC<LandingProps> = ({name}) => {
    return (
        <div style={{
            marginTop: '70px',
            fontFamily: 'Courier New, monospace',
        }}>
            {name ? (
                <p style={{
                    fontSize: '20px',
                }}>
                    Welcome, {name.split(' ')[0]}!
                </p>
            ) : (
                <p style={{
                    fontSize: '20px',
                }}>
                    Welcome! To get started, please log in.
                </p>
            )}
        </div>
    );
}

export default Landing;

import React, {useEffect, useState} from 'react';
import axios from 'axios';

const VideoPlayer: React.FC = () => {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const filename = urlParams.get('file');
        const userDir = urlParams.get('dir');

        const fetchVideo = async () => {
            try {
                const token = sessionStorage.getItem('authToken');

                // Fetch video file
                const response = await axios.get(`http://localhost:9999/api/${userDir}/file/${filename}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    responseType: 'blob'
                });

                // Create blob URL
                const blobUrl = URL.createObjectURL(response.data);
                setVideoSrc(blobUrl);
            } catch (err) {
                console.error('Error fetching video:', err);
                setError('Could not load video');
            }
        };

        if (filename && userDir) {
            fetchVideo();
        } else {
            setError('No video specified');
        }

        // Cleanup blob URL when component unmounts
        return () => {
            if (videoSrc) {
                URL.revokeObjectURL(videoSrc);
            }
        };
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'black'
        }}>
            {videoSrc && (
                <video
                    src={videoSrc}
                    controls
                    autoPlay
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%'
                    }}
                >
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};

export default VideoPlayer;
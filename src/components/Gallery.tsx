import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import MasonryCSS from 'react-masonry-css';
import axios from 'axios';

interface MediaFile {
    url: string;
    type: 'image' | 'video' | 'audio' | 'unknown';
}

interface GalleryProps {
    userDir: string | null;
}

const Gallery: React.FC<GalleryProps> = ({userDir}) => {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Determine file type based on MIME type
    const getFileType = (mimeType: string): MediaFile['type'] => {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'audio';
        return 'unknown';
    };

    const fetchMedia = useCallback(async () => {
        const token = sessionStorage.getItem('authToken');

        if (!token || !userDir) {
            navigate('/');
            return;
        }

        try {
            const fileListResponse = await axios.get(`http://localhost:9999/api/protected/${userDir}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const fileList = fileListResponse.data.files;
            const mediaPromises = fileList.map(async (filename: string) => {
                const response = await axios.get(`http://localhost:9999/api/protected/${userDir}/${filename}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob',
                });

                const blob = new Blob([response.data]);
                const url = URL.createObjectURL(blob);
                const type = getFileType(response.data.type);

                return { url, type };
            });

            const mediaFiles = await Promise.all(mediaPromises);
            setMedia(mediaFiles);
        } catch (error) {
            console.error('Error fetching media:', error);
        } finally {
            setIsLoading(false);
        }
    }, [userDir, navigate]);

    useEffect(() => {
        if (media.length === 0) {
            fetchMedia().catch((error) => {
                console.error('Error fetching media:', error);
            });

            return () => {
                media.forEach((file) => URL.revokeObjectURL(file.url));
            };
        }
    }, [fetchMedia, media]);

    // Render different media types
    const renderMediaContent = (file: MediaFile) => {
        const mediaStyles = {
            width: "100%",
            display: "block",
            borderRadius: "3px"
        };

        switch (file.type) {
            case 'image':
                return (
                    <img
                        src={file.url}
                        style={mediaStyles}
                        alt="Media item"
                    />
                );

            case 'video':
                return (
                    <video
                        src={file.url}
                        style={mediaStyles}
                        controls
                    />
                );

            case 'audio':
                return (
                    <audio
                        src={file.url}
                        style={{...mediaStyles, height: '50px'}}
                        controls
                    />
                );

            default:
                return (
                    <div
                        style={{
                            width: "100%",
                            padding: "10px",
                            textAlign: "center",
                            backgroundColor: "#f0f0f0"
                        }}
                    >
                        Unsupported file type
                    </div>
                );
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const breakpointColumnsObj = {
        default: 5,
        900: 4,
        700: 3,
        500: 2,
        300: 2
    };

    return (
        <div style={{marginTop: '70px'}}>
            <MasonryCSS
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid-col"
            >
                {media.map((file, index) => (
                    <div
                        key={index}
                        className="media-container"
                        style={{
                            padding: "5px",
                            // border: "1px solid #ddd",
                            // borderRadius: "8px",
                            // backgroundColor: "#f9f9f9",
                        }}
                    >
                        {renderMediaContent(file)}
                    </div>
                ))}
            </MasonryCSS>
        </div>
    );
};

export default Gallery;
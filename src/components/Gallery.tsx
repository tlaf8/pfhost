import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import MasonryCSS from 'react-masonry-css';
import axios from 'axios';

interface MediaFile {
    url: string;
    type: 'image' | 'video' | 'audio' | 'unknown';
    filename: string;
}

interface GalleryProps {
    userDir: string | null;
}

const Gallery: React.FC<GalleryProps> = ({userDir}) => {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const getFileType = (filename: string): MediaFile['type'] => {
        const extension = filename.split('.').pop()?.toLowerCase() || '';

        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
        const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];

        if (imageExtensions.includes(extension)) return 'image';
        if (videoExtensions.includes(extension)) return 'video';
        if (audioExtensions.includes(extension)) return 'audio';

        return 'unknown';
    };

    const fetchMedia = useCallback(async () => {
        const token = sessionStorage.getItem('authToken');

        if (!token || !userDir) {
            navigate('/');
            return;
        }

        try {
            const fileListResponse = await axios.get(`${import.meta.env.VITE_HOST}/api/${userDir}?dir=compressed`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const fileList = fileListResponse.data.files;
            const mediaFiles: MediaFile[] = fileList.map((filename: string) => ({
                url: `${import.meta.env.VITE_HOST}/cdn/${userDir}/compressed/${filename}?token=${token}`,
                type: getFileType(filename),
                filename
            }));

            setMedia(mediaFiles);
        } catch (error) {
            console.error('Error fetching media:', error);
        } finally {
            setIsLoading(false);
        }
    }, [userDir, navigate]);

    useEffect(() => {
        fetchMedia().catch((error) => {
            console.error(error);
        });
    }, [fetchMedia]);

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
                        alt={file.filename}
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
                {media.map((file, index) => {
                    const token = sessionStorage.getItem('authToken');

                    if (!token || !userDir) {
                        navigate('/');
                        return;
                    }

                    return (
                        <div
                            key={index}
                            className="media-container"
                            style={{
                                padding: "5px",
                            }}
                        >
                            {renderMediaContent(file)}
                            <a
                                href={`${import.meta.env.VITE_HOST}/cdn/${userDir}/src/${file.filename.replace('compressed_', '')}?token=${token}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "block",
                                    marginTop: "10px",
                                    textDecoration: "none",
                                    color: "blue",
                                }}
                            >{file.filename.replace('compressed_', '') || 'file'}
                            </a>
                        </div>
                    )
                })}
            </MasonryCSS>
        </div>
    );
};

export default Gallery;
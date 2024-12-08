import React, { useCallback, useEffect, useState } from 'react';
import MasonryCSS from 'react-masonry-css';
import axios from 'axios';

interface MediaFile {
    url: string;
    blobUrl: string;
    thmbUrl: string;
    blobThmb: string;
    filename: string;
    type: 'image' | 'video' | 'audio' | 'unknown';
}

interface GalleryProps {
    userDir: string | null;
}

const Gallery: React.FC<GalleryProps> = ({ userDir }) => {
    const [fetchedFiles, setFetchedFiles] = useState<Set<string>>(new Set());
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const breakpointColumnsObj = { default: 5, 900: 4, 700: 3, 500: 2, 300: 2 };

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

    const fetchFileBlob = useCallback(async (file: MediaFile) => {
        const token = sessionStorage.getItem('authToken');
        if (!token) return null;

        try {
            const srcResponse = await axios.get(file.url, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });

            const thmbResponse = await axios.get(file.thmbUrl, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });

            const blobUrl = URL.createObjectURL(srcResponse.data);
            const blobThmb = URL.createObjectURL(thmbResponse.data);
            return { ...file, blobUrl, blobThmb };
        } catch (error) {
            console.error('Error fetching file:', file.filename, error);
            return null;
        }
    }, []);

    const fetchMedia = useCallback(async () => {
        const token = sessionStorage.getItem('authToken');
        if (!token) return;

        try {
            const fileListResponse = await axios.get(`${import.meta.env.VITE_HOST}/uploads/${userDir}/filelist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const fileList = fileListResponse.data.filelist;
            for (const filename of fileList) {
                if (fetchedFiles.has(filename)) continue;

                const file: MediaFile = {
                    url: `${import.meta.env.VITE_HOST}/uploads/${userDir}/src/${filename}`,
                    blobUrl: '',
                    thmbUrl: `${import.meta.env.VITE_HOST}/uploads/${userDir}/thumbnails/thumbnail_${filename.split('.')[0]}.jpg`,
                    blobThmb: '',
                    filename,
                    type: getFileType(filename),
                };

                const fetchedFile = await fetchFileBlob(file);
                if (fetchedFile) {
                    setMedia((prevMedia) => [...prevMedia, fetchedFile]);
                    setFetchedFiles((prev) => new Set(prev).add(filename));
                }
            }
        } catch (error) {
            console.error('Error fetching media:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedia().catch((error) => {
            console.error('Error fetching media:', error);
        });
    }, []);

    return (
        <div style={{ marginTop: '70px' }}>
            {isLoading && <div>Loading...</div>}
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
                            padding: '5px',
                        }}
                    >
                        <img
                            src={file.blobThmb}
                            style={{
                                width: '100%',
                                display: 'block',
                                borderRadius: '3px',
                            }}
                            alt={file.filename}
                        />
                        <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'block',
                                marginTop: '10px',
                                textDecoration: 'none',
                                color: 'blue',
                            }}
                        >
                            {file.filename}
                        </a>
                    </div>
                ))}
            </MasonryCSS>
        </div>
    );
};

export default Gallery;

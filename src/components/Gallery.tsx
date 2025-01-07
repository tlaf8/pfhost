import React, { useCallback, useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {useMedia} from '../hooks/useMedia';

interface GalleryProps {
    userDir: string | null;
}

const MediaGallery: React.FC<GalleryProps> = ({ userDir }) => {
    const { media, setMedia, blobUrls, setBlobUrls, mediaCount } = useMedia();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadLinkShown, setUploadLinkShown] = useState<boolean>(false);
    const [hover, setHover] = useState<boolean>(false);
    const [fetchingFile, setFetchingFile] = useState<{ [filename: string]: boolean }>({});
    const [downloadProgress, setDownloadProgress] = useState<{ [filename: string]: number }>({});
    const breakpointColumnsObj = { default: 8, 500: 3, 300: 2 };

    const handleFileClick = async (e: React.MouseEvent, filename: string) => {
        e.preventDefault();
        setFetchingFile((prev) => ({ ...prev, [filename]: true }));
        setDownloadProgress((prev) => ({ ...prev, [filename]: 0 }));
        const blobUrl = blobUrls[filename] || (await fetchBlobUrl(filename));
        if (blobUrl) {
            window.open(blobUrl, '_blank');
        }
        setFetchingFile((prev) => ({ ...prev, [filename]: false }));
    };

    const fetchBlobUrl = useCallback(
        async (filename: string) => {
            try {
                const token = sessionStorage.getItem('authToken');
                if (!token || !userDir) return;
                const response = await axios.get(`https://pfhost.duckdns.org/api/media`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        path: userDir,
                        filename: filename,
                    },
                    responseType: 'blob',
                    onDownloadProgress: (progressEvent) => {
                        const percentage = progressEvent.total
                            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            : 0;
                        setDownloadProgress((prev) => ({ ...prev, [filename]: percentage }));
                    },
                });

                const blobUrl = URL.createObjectURL(response.data);
                setBlobUrls((prev) => ({
                    ...prev,
                    [filename]: blobUrl,
                }));

                return blobUrl;
            } catch (error) {
                console.error(`Error fetching blob for ${filename}:`, error);
                return null;
            }
        },
        [userDir, setBlobUrls]
    );

    const fetchMediaThumbnails = useCallback(async () => {
        try {
            const token = sessionStorage.getItem('authToken');
            if (!token || !userDir) return;

            const response = await axios.get(`https://pfhost.duckdns.org/api/thumbnails`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    path: userDir,
                    filename: 'gimmefiles',
                },
            });

            const { files } = response.data;
            if (files.length === 0) {
                setIsLoading(false);
                setUploadLinkShown(true);
                return;
            }

            for (const file of files) {
                try {
                    const fileObject = await axios.get(`https://pfhost.duckdns.org/api/thumbnails`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            path: userDir,
                            filename: file,
                        },
                    });

                    setIsLoading(false);
                    setMedia((prevMedia) => [...prevMedia, fileObject.data]);
                } catch (fileError) {
                    console.error(`Error fetching thumbnail for file ${file}:`, fileError);
                }

            }
        } catch (error) {
            console.error('Error fetching media:', error);
            setIsLoading(false);
        }
    }, [setMedia, userDir, ]);

    useEffect(() => {
        if (media.length === 0) {
            setIsLoading(true);
            fetchMediaThumbnails().catch((error) => {
                console.error('Error fetching media:', error);
            });
        }
    }, [fetchMediaThumbnails, media.length]);

    useEffect(() => {
        return () => {
            Object.values(blobUrls).forEach(URL.revokeObjectURL);
        };
    }, [blobUrls]);

    return (
        <div style={{ marginTop: '65px' }}>
            {isLoading && (
                <div className='spinner-container' style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '75vh'
                }}>
                    <div className='dots'></div>
                </div>
            )}

            {uploadLinkShown && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '20px'
                }}>
                    <Link to='/upload' className='link'>No media found. Click here to start uploading</Link>
                </div>
            )}

            <Masonry
                breakpointCols={breakpointColumnsObj}
                className='masonry-grid'
                columnClassName='masonry-grid-column'
            >
                {media.map((file, index) => (
                    <div
                        key={index}
                        className='media-container'
                        style={{
                            margin: '3px',
                            padding: '5px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    >
                        <img
                            src={file.blobThmb}
                            style={{
                                width: '100%',
                                display: 'block',
                                borderRadius: '3px',
                                cursor: 'pointer',
                            }}
                            alt={file.filename}
                            onClick={(e) => handleFileClick(e, file.filename)}
                        />
                        <a
                            href='#'
                            onClick={(e) => handleFileClick(e, file.filename)}
                            style={{
                                display: 'block',
                                marginTop: '5px',
                                textDecoration: 'none',
                                color: '#007bff',
                            }}
                        >
                            {fetchingFile[file.filename] ? `Fetching... ${
                                downloadProgress[file.filename] !== undefined ? `${downloadProgress[file.filename]}%` : ''
                            }` : file.filename}
                        </a>
                    </div>
                ))}
            </Masonry>
            <div style={{
                position: 'fixed',
                bottom: 5,
                right: 5,
                borderRadius: '5px',
                border: '1px solid #ddd',
                background: 'white',
            }}>
                <div
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onMouseDown={() => setMedia([])}
                    style={{
                        width: '125px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                >
                    {hover ? (
                        <p style={{color: '#007bff'}}>Refresh</p>
                    ) : (
                        <p>{mediaCount} items</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MediaGallery;

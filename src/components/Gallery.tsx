import React, {useCallback, useEffect, useState} from 'react';
import Masonry from 'react-masonry-css';
import axios from 'axios';
import {Link} from "react-router-dom";

interface MediaFile {
    blobThmb: string;
    filename: string;
    url: string;
}

interface GalleryProps {
    userDir: string | null;
}

const MediaGallery: React.FC<GalleryProps> = ({userDir}) => {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [uploadLinkShown, setUploadLinkShown] = useState<boolean>(false);
    const [blobUrls, setBlobUrls] = useState<{ [key: string]: string }>({});
    const [fetchingFile, setFetchingFile] = useState<{ [filename: string]: boolean }>({});
    const [downloadProgress, setDownloadProgress] = useState<{ [filename: string]: number }>({});
    const breakpointColumnsObj = {default: 8, 500: 5, 300: 3};

    const handleFileClick = async (e: React.MouseEvent, filename: string) => {
        e.preventDefault();
        setFetchingFile((prev) => ({...prev, [filename]: true}));
        setDownloadProgress((prev) => ({...prev, [filename]: 0}));
        const blobUrl = blobUrls[filename] || (await fetchBlobUrl(filename));
        if (blobUrl) {
            window.open(blobUrl, '_self');
        }
        setFetchingFile((prev) => ({...prev, [filename]: false}));
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
                        const percentage = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
                        setDownloadProgress((prev) => ({...prev, [filename]: percentage}));
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
        [userDir]
    );

    const fetchMediaThumbnails = useCallback(
        async () => {
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

                const {files} = response.data;
                if (files.length === 0) {
                    setIsLoading(false);
                    setUploadLinkShown(true);
                    return;
                }

                for (const file of files) {
                    const fileObject = await axios.get(`https://pfhost.duckdns.org/api/thumbnails`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            path: userDir,
                            filename: file
                        }
                    });

                    setIsLoading(false);
                    setMedia(prevMedia => [...prevMedia, fileObject.data]);
                }
            } catch (error) {
                console.error('Error fetching media:', error);
                setIsLoading(false);
            }
        },
        [userDir]
    );

    useEffect(() => {
        if (media.length === 0) {
            fetchMediaThumbnails().catch((error) => {
                console.error('Error fetching media:', error);
            });
        }
    })

    useEffect(() => {
        return () => {
            Object.values(blobUrls).forEach(URL.revokeObjectURL);
        };
    }, [blobUrls]);

    return (
        <div style={{marginTop: '65px'}}>
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
                {media.map((file: MediaFile, index) => (
                    <div
                        key={index}
                        className='media-container'
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
                            {file.filename}
                            {fetchingFile[file.filename] && ` | Fetching... ${
                                downloadProgress[file.filename] !== undefined ? `(${downloadProgress[file.filename]}%)` : ''
                            }`}
                        </a>
                    </div>
                ))}
            </Masonry>
        </div>
    );
};

export default MediaGallery;

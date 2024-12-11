import React, {useCallback, useEffect, useState} from 'react';
import Masonry from 'react-masonry-css';
import axios from 'axios';

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
    const [isLoading, setIsLoading] = useState(true);
    const [blobUrls, setBlobUrls] = useState<{ [key: string]: string }>({});
    const [fetchingFile, setFetchingFile] = useState<{ [filename: string]: boolean }>({});

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    const handleFileClick = async (e: React.MouseEvent, filename: string) => {
        e.preventDefault();
        setFetchingFile((prev) => ({...prev, [filename]: true}));
        const blobUrl = blobUrls[filename] || (await fetchBlobUrl(filename));
        if (blobUrl) {
            window.open(blobUrl, '_blank');
        }
        setFetchingFile((prev) => ({...prev, [filename]: false}));
    };

    const fetchBlobUrl = useCallback(
        async (filename: string) => {
            try {
                const token = sessionStorage.getItem('authToken');
                if (!token) return;
                const response = await axios.get(`https://pfhost.duckdns.org/api/media`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        path: userDir,
                        filename: filename,
                    },
                    responseType: 'blob',
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

    useEffect(() => {
        const fetchMediaThumbnails = async () => {
            try {
                const token = sessionStorage.getItem('authToken');
                if (!token) return;
                const response = await axios.get(`https://pfhost.duckdns.org/api/thumbnails`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        path: userDir,
                        filename: '',
                    },
                });

                setMedia(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching media:', error);
                setIsLoading(false);
            }
        };

        fetchMediaThumbnails().catch((error) => {
            console.error('Error fetching media:', error);
        });
    }, [userDir]);

    useEffect(() => {
        return () => {
            Object.values(blobUrls).forEach(URL.revokeObjectURL);
        };
    }, [blobUrls]);

    return (
        <div style={{marginTop: '70px'}}>
            {isLoading && (
                <div className='spinner-container' style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '75vh'
                }}>
                    <div className='loader'></div>
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
                            {fetchingFile[file.filename] ? `${file.filename} | Fetching...` : file.filename}
                        </a>
                    </div>
                ))}
            </Masonry>
        </div>
    );
};

export default MediaGallery;

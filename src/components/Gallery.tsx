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

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    const fetchBlobUrl = useCallback(async (filename: string) => {
        try {
            const token = sessionStorage.getItem('authToken');

            console.log('Sending request for blobUrl')
            const response = await axios.get(`https://3dd3e179.duckdns.org/api/media`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'path': userDir,
                    'filename': filename
                },
                responseType: 'blob'
            });

            console.log(response);
            const blobUrl = URL.createObjectURL(response.data);
            setBlobUrls(prev => ({
                ...prev,
                [filename]: blobUrl
            }));

            return blobUrl;
        } catch (error) {
            console.error(`Error fetching blob for ${filename}:`, error);
            return null;
        }
    }, [userDir]);

    useEffect(() => {
        const fetchMediaThumbnails = async () => {
            try {
                const token = sessionStorage.getItem('authToken');
                console.log('Sending request for thumbnails')
                const response = await axios.get(`https://3dd3e179.duckdns.org/api/thumbnails`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'path': userDir,
                        'filename': ''
                    }
                });
                console.log(response);

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
            {isLoading && <div>Loading...</div>}
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid-column"
            >
                {media.map((file: MediaFile, index) => (
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
                            href="#"
                            onClick={async (e) => {
                                e.preventDefault();
                                const blobUrl = blobUrls[file.filename] || await fetchBlobUrl(file.filename);
                                if (blobUrl) {
                                    window.open(blobUrl, '_blank');
                                }
                            }}
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
            </Masonry>
        </div>
    );
};

export default MediaGallery;
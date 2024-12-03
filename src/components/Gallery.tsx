import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import MasonryCSS from 'react-masonry-css';
import axios from 'axios';

interface GalleryProps {
    userDir: string | null;
}

const Gallery: React.FC<GalleryProps> = ({userDir}) => {
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchImages = useCallback(async () => {
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
                }
            );

            const fileList = fileListResponse.data.files;
            const imagePromises = fileList.map((filename: string) =>
                axios.get(`http://localhost:9999/api/protected/${userDir}/${filename}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: 'blob',
                })
                    .then((response) => URL.createObjectURL(new Blob([response.data])))
            );

            const imageUrls = await Promise.all(imagePromises);
            setImages(imageUrls);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setIsLoading(false);
        }
    }, [userDir, navigate]);

    useEffect(() => {
        fetchImages().catch((error) => {
            console.error('Error fetching images:', error);
        });

        return () => {
            images.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [fetchImages, images]);

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
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        style={{width: "100%", marginBottom: "5px"}}
                        alt={`Image ${index + 1}`}
                    />
                ))}
            </MasonryCSS>
        </div>
    );
};

export default Gallery;

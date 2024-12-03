import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MasonryCSS from 'react-masonry-css';

const Gallery: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');

        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const breakpointColumnsObj = {
        default: 5,
        900: 4,
        700: 3,
        500: 2,
        300: 2
    };

    const items = Array.from({length: 100}).map((_, index) => (
        <img
            key={index}
            src={`https://picsum.photos/200/${Math.floor(
                Math.random() * (300 - 200 + 1) + 200
            )}`}
            style={{width: "100%", marginBottom: "5px"}}
         alt={`pic_${index}`}/>
    ));

    return (
        <div style={{marginTop: '70px'}}>
            <MasonryCSS
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid-col"
            >
                {items}
            </MasonryCSS>
        </div>
    );
}

export default Gallery;
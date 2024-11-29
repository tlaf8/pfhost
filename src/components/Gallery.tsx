import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

class Gallery extends React.Component {
    render() {
        // Temporary, get files from backend server
        const mediaItems = [
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { type: 'image', src: 'https://data.textstudio.com/output/sample/animated/4/6/0/6/sample-1-16064.gif' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/4124024/4124024-uhd_2732_1440_25fps.mp4' },
            { type: 'video', src: 'https://videos.pexels.com/video-files/3195394/3195394-sd_640_360_25fps.mp4' },
            { type: 'image', src: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=400' },
        ];

        return (
            <div style={{
                marginTop: '70px' ,
                fontFamily: 'Courier New, monospace',
            }}>
                <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                    <Masonry gutter='10px'>
                        {mediaItems.map((item, index) => (
                            <div key={index}>
                                {item.type === 'image' ? (
                                    <img src={item.src} alt={`media-${index}`} style={{ width: '100%' }} />
                                ) : (
                                    <video width="100%" controls>
                                        <source src={item.src} type="video/mp4" />
                                    </video>
                                )}
                            </div>
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            </div>
        );
    }
}

export default Gallery;

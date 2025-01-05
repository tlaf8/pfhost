import React, { useMemo, useState } from 'react';
import { MediaContext, MediaContextType } from '../contexts/MediaContext';

interface MediaFile {
    blobThmb: string;
    filename: string;
    url: string;
}

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [blobUrls, setBlobUrls] = useState<{ [key: string]: string }>({});

    const mediaCount = useMemo(() => media.length, [media]);

    const contextValue: MediaContextType = { media, setMedia, blobUrls, setBlobUrls, mediaCount };

    return <MediaContext.Provider value={contextValue}>{children}</MediaContext.Provider>;
};

import React, { createContext } from 'react';

interface MediaFile {
    blobThmb: string;
    filename: string;
    url: string;
}

export interface MediaContextType {
    media: MediaFile[];
    setMedia: React.Dispatch<React.SetStateAction<MediaFile[]>>;
    blobUrls: { [key: string]: string };
    setBlobUrls: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    mediaCount: number;
}

export const MediaContext = createContext<MediaContextType | undefined>(undefined);

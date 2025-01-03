import React, {createContext, useContext, useState} from 'react';

interface MediaFile {
    blobThmb: string;
    filename: string;
    url: string;
}

interface MediaContextType {
    media: MediaFile[];
    setMedia: React.Dispatch<React.SetStateAction<MediaFile[]>>;
    blobUrls: { [key: string]: string };
    setBlobUrls: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [blobUrls, setBlobUrls] = useState<{ [key: string]: string }>({});

    return (
        <MediaContext.Provider value={{media, setMedia, blobUrls, setBlobUrls}}>
            {children}
        </MediaContext.Provider>
    );
};

export const useMedia = () => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error('useMedia must be used within a MediaProvider');
    }
    return context;
};

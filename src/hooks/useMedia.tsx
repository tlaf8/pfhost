import { useContext } from 'react';
import { MediaContext } from '../contexts/MediaContext';

export const useMedia = () => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error('useMedia must be used within a MediaProvider');
    }
    return context;
};

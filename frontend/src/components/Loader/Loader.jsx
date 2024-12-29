import React from 'react';
import { BeatLoader } from 'react-spinners';

const Loader = ({ size }) => {
    return (
        <div>
            <BeatLoader
                size={size || 30}
                color='#fff'
            />
        </div>
    )
}

export default Loader;

import React, { useState } from 'react'
import Lottie from 'react-lottie';
import animationData from './juggling_lottie_animation_v3b.json'

const LottieControl = () => {

    const [isStopped, setIsStopped] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    const buttonStyle = {
        display: 'block',
        margin: '10px auto'
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <Lottie options={defaultOptions}
            height={500}
            width={600}
        />
    )

}

export default LottieControl
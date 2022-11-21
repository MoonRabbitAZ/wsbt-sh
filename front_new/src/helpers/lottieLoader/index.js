import React from 'react';
import Lottie from 'react-lottie';
import animationData from './juggling_lottie_animation_v3b.json';

const LottieControl = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return <Lottie options={defaultOptions} height={500} width={600} />;
};

export default LottieControl;

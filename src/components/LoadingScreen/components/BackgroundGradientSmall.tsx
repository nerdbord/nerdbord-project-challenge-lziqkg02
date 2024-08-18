import React from 'react';

const BackgroundGradientSmall: React.FC = () => {
  return (
    <div
      style={{
        width: '300px',
        height: '300px',
        transform: 'rotate(58.73deg)',
        flexShrink: 0,
        borderRadius: '300px',
        background: 'linear-gradient(143deg, #4338CA 8.37%, rgba(255, 0, 0, 0.00) 91.49%)',
        filter: 'blur(30px)',
      }}
    />
  );
};

export default BackgroundGradientSmall;

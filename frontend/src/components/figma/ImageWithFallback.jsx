import { useState } from 'react';

export const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!error ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={() => setError(true)} 
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
          <span className="text-sm">Imagen no disponible</span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Bitcoin } from 'lucide-react'; // Using Bitcoin icon as placeholder for SafePal logo

const QRCode = ({ address, size = 200 }) => {
  const numBlocks = 25; // For a 25x25 grid, adjust for density

  // Simple hashing function to generate a pattern from the address
  const generatePattern = (addr, gridSize) => {
    let hash = 0;
    for (let i = 0; i < addr.length; i++) {
      hash = (hash << 5) - hash + addr.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    const pattern = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      pattern.push((hash >> (i % 31)) & 1); // Use bits of the hash
    }
    return pattern;
  };

  const pattern = generatePattern(address, numBlocks);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div 
        className="bg-white p-2 rounded-lg shadow-lg relative" // Reduced padding
        style={{ width: size, height: size }}
      >
        {/* Grid for QR code pattern */}
        <div 
          className="grid w-full h-full"
          style={{ gridTemplateColumns: `repeat(${numBlocks}, 1fr)` }}
        >
          {pattern.map((block, i) => (
            <div
              key={i}
              className={`${block ? 'bg-black' : 'bg-white'}`}
            ></div>
          ))}
        </div>
        
        {/* Centered Logo Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[20%] h-[20%] bg-white p-1 rounded-sm flex items-center justify-center shadow-md">
             <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/3e2dde41-40eb-4545-861b-01f9aa439f3c/c43c188b1fbb52d2b4a3ce5ba3e3b572.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Finder patterns (simplified) */}
        {[
          { top: '4px', left: '4px' },
          { top: '4px', right: '4px' },
          { bottom: '4px', left: '4px' },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute bg-white p-0.5 rounded-sm"
            style={{ 
              width: `${size * 0.2}px`, 
              height: `${size * 0.2}px`, 
              ...pos 
            }}
          >
            <div className="w-full h-full bg-black rounded-xs"></div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default QRCode;

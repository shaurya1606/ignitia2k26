"use client"
import { useEffect, useRef, useState } from 'react';
import './preloader.css';

interface PreloaderProps {
  onLoadComplete?: () => void;
  colorScheme?: 'gemBlue' | 'honeyComb' | 'phosGreen' | 'whtSlate';
  showColorButtons?: boolean;
}

const Preloader = ({ 
  onLoadComplete, 
  colorScheme = 'gemBlue',
  showColorButtons = false 
}: PreloaderProps) => {
  const [activeScheme, setActiveScheme] = useState(colorScheme);
  const colorWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading completion after animation cycles
    const timer = setTimeout(() => {
      if (onLoadComplete) {
        onLoadComplete();
      }
    }, 3150); // Match animation duration

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  // Handle ink ripple effect
  const handleButtonClick = (e: React.MouseEvent<HTMLLIElement>, scheme: typeof activeScheme) => {
    const parent = e.currentTarget;
    
    // Remove existing ink element
    const existingInk = parent.querySelector('.ink');
    if (existingInk) {
      existingInk.remove();
    }

    // Create new ink element
    const ink = document.createElement('span');
    ink.className = 'ink';
    parent.insertBefore(ink, parent.firstChild);

    // Get click coordinates
    const rect = parent.getBoundingClientRect();
    const x = e.clientX - rect.left - 96; // 12em = 96px (assuming 1em = 8px)
    const y = e.clientY - rect.top - 96;

    // Set position and animate
    ink.style.top = `${y}px`;
    ink.style.left = `${x}px`;
    
    setTimeout(() => {
      ink.classList.add('animateInk');
    }, 10);

    // Change color scheme
    setActiveScheme(scheme);
  };

  // Generate cube grid (16 cubes in 4x4 grid)
  const renderCubes = () => {
    const cubes = [];
    for (let i = 0; i < 16; i++) {
      cubes.push(
        <div key={i} className="cube">
          <div className="lifter">
            <div className="cube__face"></div>
            <div className="cube__face"></div>
            <div className="cube__face"></div>
          </div>
        </div>
      );
    }
    return cubes;
  };

  return (
    <div className="preloader-container">
      {showColorButtons && (
        <ul className="buttonCont">
          <li 
            className="button inkAnchor whtSlate_B" 
            onClick={(e) => handleButtonClick(e, 'whtSlate')}
          >
            White Slate
          </li>
          <li 
            className="button inkAnchor honeyComb_B"
            onClick={(e) => handleButtonClick(e, 'honeyComb')}
          >
            Honey Comb
          </li>
          <li 
            className="button inkAnchor phosGreen-II_B"
            onClick={(e) => handleButtonClick(e, 'phosGreen')}
          >
            Phos. Green
          </li>
          <li 
            className="button inkAnchor gemBlue_B"
            onClick={(e) => handleButtonClick(e, 'gemBlue')}
          >
            Gem Blue
          </li>
        </ul>
      )}
      
      <div 
        id="colorWrapper" 
        className={activeScheme}
        ref={colorWrapperRef}
      >
        <div className="grid">
          {renderCubes()}
        </div>
      </div>
    </div>
  );
};

export default Preloader;

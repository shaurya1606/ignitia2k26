"use client"
import { useEffect, useState } from 'react';
import Preloader from './Preloader';

/**
 * Example component showing how to use the Preloader
 * 
 * Usage Examples:
 * 
 * 1. Basic usage with default settings:
 *    <PreloaderExample />
 * 
 * 2. With custom color scheme:
 *    <Preloader colorScheme="honeyComb" />
 * 
 * 3. With color selection buttons:
 *    <Preloader showColorButtons={true} />
 * 
 * 4. With callback when loading completes:
 *    <Preloader onLoadComplete={() => console.log('Loading complete!')} />
 * 
 * Available color schemes:
 * - 'gemBlue' (default): Dark blue theme
 * - 'honeyComb': Warm honey/orange theme
 * - 'phosGreen': Phosphorescent green theme
 * - 'whtSlate': Light white/slate theme
 */

const PreloaderExample = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // Show preloader for 3.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Preloader 
        colorScheme="gemBlue"
        showColorButtons={true}
        onLoadComplete={() => {
          console.log('Preloader animation complete');
          setIsLoading(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Content Loaded!</h1>
        <p className="text-muted-foreground">The preloader has finished.</p>
        <button 
          onClick={() => setIsLoading(true)}
          className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Show Preloader Again
        </button>
      </div>
    </div>
  );
};

export default PreloaderExample;

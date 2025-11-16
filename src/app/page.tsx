'use client';

import * as React from 'react';
import MinimalPreloader from '@/components/landing/MinimalPreloader';
import LandingScene from '@/components/landing/LandingScene';

export default function Page() {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    // Simulate loading
    const timer = window.setTimeout(() => setLoaded(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <MinimalPreloader
        loaded={loaded}
        onFinish={() => {}}
      />
      {/* Landing content renders underneath the preloader */}
      <LandingScene />
    </>
  );
}

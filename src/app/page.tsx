'use client';

import React, { useEffect, useState } from 'react';
import LandingScene from '@/components/landing/LandingScene';
import MinimalPreloader from '@/components/landing/MinimalPreloader'

export default function Page() {
  // Simulate a fetching delay for the page so the preloader can be shown
  // during client navigation. This is useful to preview the loading UX.
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    // Simulated fetch delay (700ms)
    const t = setTimeout(() => setIsFetching(false), 700)
    return () => clearTimeout(t)
  }, [])

  // Show the minimal preloader while 'fetching' is in progress.
  if (isFetching) {
    return <MinimalPreloader loaded={false} />
  }

  return <LandingScene />
}

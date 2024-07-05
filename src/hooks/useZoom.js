import { useState, useCallback } from 'react';

const useZoom = () => {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = useCallback(() => {
    setZoom(prevZoom => prevZoom * 1.2);
  }, [setZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom(prevZoom => Math.max(prevZoom * 0.8, 50));
  }, [setZoom]);

  const handleReset = useCallback(() => {
    setZoom(100);
  }, [setZoom]);

  return { zoom, handleZoomIn, handleZoomOut, handleReset };
};

export default useZoom;

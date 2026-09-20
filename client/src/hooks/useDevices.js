import { useState, useEffect, useCallback } from 'react';
import { getDevices } from '../services/api';
import { useSocket } from '../context/SocketContext';

/**
 * Custom hook for fetching and tracking connected LAN devices
 */
export function useDevices(refreshInterval = 5000) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { latestEvent } = useSocket();

  const fetchDevices = useCallback(async () => {
    try {
      const res = await getDevices();
      setDevices(res.data || []);
    } catch (err) {
      console.error('Failed to fetch devices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchDevices, refreshInterval]);

  // Refresh on device events
  useEffect(() => {
    if (latestEvent?.type === 'device:connected' ||
        latestEvent?.type === 'device:disconnected') {
      fetchDevices();
    }
  }, [latestEvent, fetchDevices]);

  return { devices, loading, refetch: fetchDevices };
}

import { createContext, useContext, useEffect, useState } from 'react';
import { getStats } from '../services/api';

const HostContext = createContext({ isHost: false, serverHostname: '', lanIP: '' });

/**
 * Detects whether the current browser device is the server host machine.
 * Strategy: compare window.location.hostname against the server's LAN IP.
 * If the page is opened via localhost or 127.0.0.1, it's the host.
 */
export function HostProvider({ children }) {
  const [isHost, setIsHost] = useState(false);
  const [serverHostname, setServerHostname] = useState('');
  const [lanIP, setLanIP] = useState('');

  useEffect(() => {
    async function detect() {
      try {
        const res = await getStats();
        const data = res.data;
        const myHostname = window.location.hostname;

        setServerHostname(data.hostname || '');
        setLanIP(data.lanIP || '');
        
        // Backend now accurately determines if this request came from the host IP
        setIsHost(data.isHost === true);
      } catch {
        // If stats fail, default to non-host
        setIsHost(false);
      }
    }
    detect();
  }, []);

  return (
    <HostContext.Provider value={{ isHost, serverHostname, lanIP }}>
      {children}
    </HostContext.Provider>
  );
}

export const useHost = () => useContext(HostContext);

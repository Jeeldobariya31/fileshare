import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import FilesPage from './pages/FilesPage';
import UploadPage from './pages/UploadPage';
import DevicesPage from './pages/DevicesPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import { useHost } from './context/HostContext';

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.25, ease: 'easeInOut' },
};

function AnimatedRoute({ children }) {
  return (
    <motion.div {...pageTransition}>
      {children}
    </motion.div>
  );
}

// Guard wrapper for host-only pages
function HostRoute({ children }) {
  const { isHost } = useHost();
  if (!isHost) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color-strong)',
            borderRadius: '12px',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: 'transparent' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: 'transparent' },
          },
        }}
      />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<AnimatedRoute><HomePage /></AnimatedRoute>} />
          <Route path="/files" element={<AnimatedRoute><FilesPage /></AnimatedRoute>} />
          <Route path="/upload" element={<AnimatedRoute><UploadPage /></AnimatedRoute>} />
          <Route path="/devices" element={<AnimatedRoute><DevicesPage /></AnimatedRoute>} />
          <Route path="/settings" element={<HostRoute><AnimatedRoute><SettingsPage /></AnimatedRoute></HostRoute>} />
          <Route path="/about" element={<AnimatedRoute><AboutPage /></AnimatedRoute>} />
        </Route>
      </Routes>
    </>
  );
}

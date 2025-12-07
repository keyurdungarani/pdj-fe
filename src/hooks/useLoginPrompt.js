import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to show login modal after 1 minute for non-logged-in users
 * Only triggers once per session
 */
const useLoginPrompt = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { currentUser } = useAuth();
  const DELAY_TIME = 60000; // 1 minute in milliseconds
  const STORAGE_KEY = 'loginPromptShown';

  useEffect(() => {
    // Don't show if user is already logged in
    if (currentUser) {
      return;
    }

    // Check if prompt was already shown in this session
    const promptShown = sessionStorage.getItem(STORAGE_KEY);
    if (promptShown) {
      return;
    }

    // Set timeout to show modal after 1 minute
    const timer = setTimeout(() => {
      setShowLoginModal(true);
      // Mark as shown in session storage
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }, DELAY_TIME);

    // Cleanup timeout on unmount
    return () => clearTimeout(timer);
  }, [currentUser]);

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  return { showLoginModal, closeLoginModal };
};

export default useLoginPrompt;


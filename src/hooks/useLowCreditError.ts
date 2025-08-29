import { useState } from 'react';

export function useLowCreditError() {
  const [showLowCreditModal, setShowLowCreditModal] = useState(false);

  const handleApiError = (error: unknown) => {
    const errorObj = error as { response?: { status?: number }; status?: number };
    if (errorObj?.response?.status === 402 || errorObj?.status === 402) {
      setShowLowCreditModal(true);
      return true; // Indicates the error was handled
    }
    return false; // Let other error handling continue
  };

  const closeLowCreditModal = () => {
    setShowLowCreditModal(false);
  };

  return {
    showLowCreditModal,
    handleApiError,
    closeLowCreditModal,
  };
}
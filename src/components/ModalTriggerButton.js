"use client";

import { useContext } from 'react';
import { AppContext } from '@/components/GlobalWrapper';

/**
 * Клиентская кнопка, которая открывает LeadModal.
 * Нужна потому что setShowModal живёт в AppContext (клиентский контекст).
 * Использование: тексет и иконки передаются через children.
 */
export default function ModalTriggerButton({ className, children }) {
  const { setShowModal } = useContext(AppContext);
  return (
    <button
      onClick={() => setShowModal(true)}
      className={className}
    >
      {children}
    </button>
  );
}

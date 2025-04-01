'use client';

import { useApp } from '@/contexts/AppContext';

interface AuthErrorHandlerProps {
  error: string | null;
}

// Mapping Firebase error codes to user-friendly messages
const errorCodeMapping: Record<string, string> = {
  // Common error codes
  'auth/invalid-credential': 'errors.auth.invalidCredential',
  'auth/user-not-found': 'errors.auth.userNotFound',
  'auth/wrong-password': 'errors.auth.wrongPassword',
  'auth/email-already-in-use': 'errors.auth.emailInUse',
  'auth/weak-password': 'errors.auth.weakPassword',
  'auth/invalid-email': 'errors.auth.invalidEmail',
  'auth/network-request-failed': 'errors.auth.networkError',
  'auth/too-many-requests': 'errors.auth.tooManyRequests',
  'auth/user-disabled': 'errors.auth.userDisabled',
  'auth/requires-recent-login': 'errors.auth.requiresRecentLogin',
  'auth/popup-closed-by-user': 'errors.auth.popupClosed',
  'auth/cancelled-popup-request': 'errors.auth.popupCancelled',
  'auth/popup-blocked': 'errors.auth.popupBlocked',
  'auth/operation-not-allowed': 'errors.auth.operationNotAllowed',
  'auth/account-exists-with-different-credential': 'errors.auth.accountExistsWithDifferentCredential',
  'auth/unauthorized-domain': 'errors.auth.unauthorizedDomain',
  'auth/timeout': 'errors.auth.timeout',
};

export default function AuthErrorHandler({ error }: AuthErrorHandlerProps) {
  const { t } = useApp();

  if (!error) return null;

  // Extract error code from Firebase error message
  const errorCodeMatch = error.match(/\(([^)]+)\)/);
  const errorCode = errorCodeMatch ? errorCodeMatch[1] : null;
  
  // Get translation key from mapping, fallback to default error message
  const translationKey = errorCode && errorCodeMapping[errorCode] 
    ? errorCodeMapping[errorCode] 
    : 'errors.auth.default';

  return (
    <div className="error-message">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mt-0.5 text-red-600">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">
            {t(translationKey, error)}
          </p>
        </div>
      </div>
    </div>
  );
}

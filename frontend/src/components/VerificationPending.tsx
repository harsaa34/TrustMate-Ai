// src/components/VerificationPending.tsx - FIXED
import { useState, useEffect } from 'react';
import { useResendVerification } from '../hooks/useVerification';
import { useNavigate, useLocation } from 'react-router-dom';

const VerificationPending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: resendEmail, isLoading, isSuccess, error } = useResendVerification();
  const [resentCount, setResentCount] = useState(0);
  const [email, setEmail] = useState('');
  
  // Get email from multiple sources
  useEffect(() => {
    console.log('VerificationPending mounted, location state:', location.state);
    
    // 1. Try to get from location state
    const locationEmail = (location.state as any)?.email;
    console.log('Location email:', locationEmail);
    
    // 2. Try to get from localStorage (set during registration)
    const storedEmail = localStorage.getItem('pending_verification_email');
    console.log('Stored email:', storedEmail);
    
    // 3. Try to get from URL params
    const urlParams = new URLSearchParams(location.search);
    const urlEmail = urlParams.get('email');
    console.log('URL email:', urlEmail);
    
    // Use the first available source
    const finalEmail = locationEmail || storedEmail || urlEmail || '';
    console.log('Final email to use:', finalEmail);
    
    if (!finalEmail) {
      console.warn('No email found! Redirecting to register page.');
      navigate('/register');
      return;
    }
    
    setEmail(finalEmail);
    
    // Store in localStorage for persistence
    if (finalEmail && finalEmail !== storedEmail) {
      localStorage.setItem('pending_verification_email', finalEmail);
    }
    
  }, [location, navigate]);

  const handleResend = () => {
    console.log('Resend button clicked, email:', email);
    
    if (!email) {
      alert('No email found. Please register again.');
      navigate('/register');
      return;
    }
    
    if (resentCount < 3) {
      console.log('Calling resendEmail with email:', email);
      resendEmail(email); // PASS THE EMAIL PARAMETER HERE!
      setResentCount(prev => prev + 1);
    } else {
      alert('You have reached the maximum resend limit. Please wait or contact support.');
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('pending_verification_email');
    navigate('/login');
  };

  const handleLogin = () => {
    console.log('Navigating to login...');
    navigate('/login');
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">
            We've sent a verification link to:
          </p>
          <p className="font-semibold text-gray-800 mt-1 break-all">{email}</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-yellow-800 text-sm">
                Please check your email and click the verification link to activate your account. If you don't see the email, check your spam folder.
              </p>
            </div>
          </div>

          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p className="text-green-800 text-sm">
                  ✅ Verification email resent! Check your inbox.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-red-800 text-sm">
                  {(error as any).message || 'Failed to resend email. Please try again.'}
                </p>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleResend}
              disabled={isLoading || resentCount >= 3}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                `Resend Email ${resentCount > 0 ? `(${resentCount}/3)` : ''}`
              )}
            </button>
            
            <button
              onClick={handleLogin}
              className="flex-1 border border-indigo-200 text-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-300"
            >
              Go to Login
            </button>
          </div>

          {resentCount >= 3 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 text-center">
                You've reached the resend limit. Please wait 24 hours or contact support at <span className="font-medium">support@trustmate.ai</span>
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout and return to login page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
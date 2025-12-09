// src/components/EmailVerificationPage.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVerifyEmail } from '../hooks/useVerification';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { mutate: verifyEmail, isLoading, isSuccess, error } = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      // If no token, redirect to login after a moment
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [token, verifyEmail, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6">
            {isLoading ? (
              <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : isSuccess ? (
              <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            ) : error ? (
              <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            ) : (
              <div className="w-full h-full rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-3xl">📧</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isLoading ? 'Verifying Email...' : 
             isSuccess ? 'Email Verified!' : 
             error ? 'Verification Failed' : 
             'Email Verification'}
          </h2>

          <div className="space-y-4">
            {isLoading && (
              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            )}

            {isSuccess && (
              <>
                <p className="text-green-600 font-medium">
                  Your email has been successfully verified!
                </p>
                <p className="text-gray-600">
                  You can now log in to your account.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
                >
                  Go to Login
                </button>
              </>
            )}

            {error && (
              <>
                <p className="text-red-600 font-medium">
                  Failed to verify your email
                </p>
                <p className="text-gray-600">
                  {(error as any).response?.data?.message || 'The verification link may be invalid or expired.'}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
                  >
                    Go to Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
                  >
                    Register Again
                  </button>
                </div>
              </>
            )}

            {!token && !isLoading && !isSuccess && !error && (
              <>
                <p className="text-gray-600">
                  No verification token found. Please check your email for the verification link.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 mt-4"
                >
                  Go to Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;

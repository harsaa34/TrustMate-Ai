import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLogin, useRegister } from '../hooks/useAuth';
import type { LoginDto, SignUpDto } from '../api/generated';
import { useNavigate } from 'react-router-dom';

type TabType = 'login' | 'register';

interface LoginFormProps {
  defaultTab?: TabType;
}

const LoginForm = ({ defaultTab = 'login' }: LoginFormProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const navigate = useNavigate();
  
  const { mutate: login, isLoading: isLoggingIn, error: loginError } = useLogin();
  const { mutate: register, isLoading: isRegistering, error: registerError } = useRegister();
  
  const error = loginError || registerError;
  const isLoading = isLoggingIn || isRegistering;

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
    watch: watchLogin,
  } = useForm<LoginDto>();

  const {
    register: signupRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: signupErrors },
    reset: resetRegister,
  } = useForm<SignUpDto>();

  const loginEmail = watchLogin('email'); // Watch the email field

  const onLoginSubmit = (data: LoginDto) => {
    login(data, {
      onSuccess: (response) => {
        console.log('Login successful:', response);
      },
      onError: (error) => {
        console.error('Login failed:', error);
      }
    });
  };

  const onRegisterSubmit = (data: SignUpDto) => {
    register(data, {
      onSuccess: (response) => {
        console.log('Registration successful:', response);
      },
      onError: (error) => {
        console.error('Registration failed:', error);
      }
    });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    resetLogin();
    resetRegister();
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page, passing the email if available
    if (loginEmail) {
      navigate(`/forgot-password?email=${encodeURIComponent(loginEmail)}`);
    } else {
      navigate('/forgot-password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 text-lg font-semibold transition-all duration-300 ${
              activeTab === 'login'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-4 text-lg font-semibold transition-all duration-300 ${
              activeTab === 'register'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('register')}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        <div className="p-8">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your account</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${
                    loginErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...loginRegister('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {loginErrors.email && (
                  <p className="mt-2 text-sm text-red-600 animate-pulse">
                    {loginErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${
                    loginErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...loginRegister('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                {loginErrors.password && (
                  <p className="mt-2 text-sm text-red-600 animate-pulse">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {(loginError as any).message || 'An error occurred'}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300"
                    onClick={() => handleTabChange('register')}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-600">Join TrustMate AI</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${
                    signupErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...signupRegister('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />
                {signupErrors.name && (
                  <p className="mt-2 text-sm text-red-600 animate-pulse">
                    {signupErrors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${
                    signupErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...signupRegister('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {signupErrors.email && (
                  <p className="mt-2 text-sm text-red-600 animate-pulse">
                    {signupErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${
                    signupErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...signupRegister('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: 'Must contain uppercase, lowercase, and number',
                    },
                  })}
                />
                {signupErrors.password && (
                  <p className="mt-2 text-sm text-red-600 animate-pulse">
                    {signupErrors.password.message}
                  </p>
                )}
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">Password must contain:</p>
                  <ul className="text-xs text-gray-500 list-disc list-inside">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                  </ul>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${
                    signupErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...signupRegister('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => 
                      value === signupRegister('password').value || 'Passwords do not match',
                  })}
                />
                {signupErrors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 animate-pulse">
                    {signupErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="/terms" className="text-indigo-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-indigo-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRegistering ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              {registerError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="font-medium">Registration Failed</p>
                  <p className="text-sm mt-1">
                    {(registerError as any).message || 'An error occurred. Please try again.'}
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300"
                    onClick={() => handleTabChange('login')}
                  >
                    Sign in
                  </button>
                </p>
                <p className="text-center text-gray-500 text-xs mt-4">
                  By registering, you'll receive a verification email to activate your account.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
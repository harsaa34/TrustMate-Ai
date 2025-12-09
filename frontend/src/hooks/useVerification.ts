// src/hooks/useVerification.ts - COMPLETE VERSION (NOT SIMPLIFIED)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../lib/api-client';
import type { VerifyEmailDto } from '../api/generated';

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (token: string) => {
      try {
        console.log('Verifying email with token:', token.substring(0, 20) + '...');
        const verifyEmailDto: VerifyEmailDto = { token };
        const response = await authApi.authControllerVerifyEmail(verifyEmailDto);
        console.log('Verify email response:', response);
        return response.data;
      } catch (error) {
        console.error('Verify email API error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Email verification successful:', data);
      
      // Clear any pending verification email from localStorage
      localStorage.removeItem('pending_verification_email');
      
      // Show success message
      alert('🎉 Email verified successfully! You can now login.');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    },
    onError: (error: any) => {
      console.error('Verify email hook error:', error);
      
      // Extract error message
      let errorMessage = 'Email verification failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show error to user
      alert(`❌ ${errorMessage}`);
      
      // If token is invalid/expired, redirect to resend page
      if (error.response?.status === 400 || error.response?.status === 401) {
        const email = localStorage.getItem('pending_verification_email');
        if (email) {
          setTimeout(() => {
            window.location.href = `/verify-pending?email=${encodeURIComponent(email)}`;
          }, 3000);
        }
      }
    }
  });
};

export const useResendVerification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (email: string) => {
      try {
        console.log('Resending verification to email:', email);
        
        // Store email in localStorage in case we need to redirect
        localStorage.setItem('pending_verification_email', email);
        
        // Call the API
        const response = await authApi.authControllerResendVerificationEmail({ email });
        console.log('Resend verification response:', response);
        return response.data;
      } catch (error) {
        console.error('Resend verification API error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Resend verification successful:', data);
      
      // Update UI state if needed
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      
      // Show success message
      alert('📧 Verification email sent! Please check your inbox and spam folder.');
    },
    onError: (error: any) => {
      console.error('Resend verification hook error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      // Extract error message
      let errorMessage = 'Failed to resend verification email. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Special handling for specific errors
      if (error.response?.status === 400) {
        errorMessage = 'Invalid email address. Please check and try again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found. Please register first.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Email is already verified. You can login now.';
      }
      
      // Show error to user
      alert(`❌ ${errorMessage}`);
    },
    retry: 1, // Retry once on failure
    retryDelay: 1000 // Wait 1 second before retry
  });
};

// Additional helper hook for email verification status
export const useEmailVerificationStatus = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      try {
        // You might need to create this endpoint in your backend
        // For now, we'll just check localStorage
        const pendingEmail = localStorage.getItem('pending_verification_email');
        return {
          email,
          hasPendingVerification: pendingEmail === email,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Email verification status error:', error);
        throw error;
      }
    }
  });
};

// Hook to check if verification is pending for current user
export const useCheckVerificationPending = () => {
  return {
    isPending: () => {
      const email = localStorage.getItem('pending_verification_email');
      return !!email;
    },
    getPendingEmail: () => {
      return localStorage.getItem('pending_verification_email');
    },
    clearPending: () => {
      localStorage.removeItem('pending_verification_email');
    }
  };
};
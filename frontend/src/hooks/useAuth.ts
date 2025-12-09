// src/hooks/useAuth.ts - COMPLETE REFACTOR
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../lib/api-client';
import type { 
  LoginDto, 
  SignUpDto, 
  UserResponseDto,
  LoginResponseDto,
  AuthResponseDto,
  UpdateProfileDto,
  ChangePasswordDto,
  ForgotPasswordDto,  // Add this import
  ResetPasswordDto 
} from '../api/generated';

// Define user interface locally
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  avatar?: string;
  bio?: string;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginDto) =>
      authApi.authControllerLogin(credentials),
    onSuccess: (response) => {
      const data = response.data as LoginResponseDto;
      
      if (data.token) {
        localStorage.setItem('access_token', data.token);
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        queryClient.setQueryData(['auth'], data.user);
      }
      
      // Redirect based on verification status
      if (!data.user.isVerified) {
        // Store email for verification page
        localStorage.setItem('pending_verification_email', data.user.email);
        window.location.href = '/verify-pending';
      } else {
        window.location.href = '/dashboard';
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: SignUpDto) =>
      authApi.authControllerSignup(userData),
    onSuccess: (response) => {
      const data = response.data as AuthResponseDto;
      
      // Store user data but don't auto-login
      if (data.user) {
        // Store email for verification page
        localStorage.setItem('pending_verification_email', data.user.email);
      }
      
      // Clear any existing auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      queryClient.clear();
      
      // Redirect to verification page
      window.location.href = '/verify-pending';
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authApi.authControllerLogout(),
    onSuccess: () => {
      // Clear all local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('pending_verification_email');
      
      // Clear query cache
      queryClient.clear();
      
      // Redirect to login
      window.location.href = '/login';
    },
    onError: () => {
      // Still clear local storage even if API call fails
      localStorage.clear();
      window.location.href = '/login';
    }
  });
};

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await authApi.authControllerGetProfile();
      return response.data as UserResponseDto;
    },
    enabled: !!localStorage.getItem('access_token'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: () => {
      // Clear invalid token
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateProfileDto) =>
      authApi.authControllerUpdateProfile(data),
    onSuccess: (response) => {
      const user = response.data as UserResponseDto;
      localStorage.setItem('user', JSON.stringify(user));
      queryClient.setQueryData(['auth'], user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update profile.';
      throw new Error(errorMessage);
    }
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) =>
      authApi.authControllerChangePassword(data),
    onSuccess: () => {
      alert('Password changed successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to change password.';
      throw new Error(errorMessage);
    }
  });
};

// Add to src/hooks/useAuth.ts

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      // Create proper DTO object
      const forgotPasswordDto: ForgotPasswordDto = { email };
      const response = await authApi.authControllerForgotPassword(forgotPasswordDto);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Forgot password success:', data);
    },
    onError: (error: any) => {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send reset email.';
      throw new Error(errorMessage);
    }
  });
};
export const useResetPassword = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { token: string; newPassword: string }) => {
      console.log('🔍 DEBUG Reset Password - Frontend data:', data);
      
      // Create proper DTO object
      const resetPasswordDto: ResetPasswordDto = { 
        token: data.token, 
        newPassword: data.newPassword 
      };
      
      console.log('🔍 DEBUG Reset Password - DTO:', resetPasswordDto);
      
      try {
        const response = await authApi.authControllerResetPassword(resetPasswordDto);
        console.log('✅ DEBUG Reset Password - Success:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ DEBUG Reset Password - Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data,
          }
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('🎉 Password reset successful:', data);
      queryClient.clear();
    },
    onError: (error: any) => {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password.';
      throw new Error(errorMessage);
    }
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authApi.authControllerDeleteAccount(),
    onSuccess: () => {
      // Clear all local storage
      localStorage.clear();
      queryClient.clear();
      window.location.href = '/login';
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete account.';
      throw new Error(errorMessage);
    }
  });
};
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const GoogleSignInButton = ({ onSuccess, onError }) => {
  const { googleLogin } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Google Sign-In Success:', credentialResponse);

      // Use the googleLogin function from AuthContext
      const user = await googleLogin(credentialResponse.credential);

      console.log('Google login successful:', user);
      
      toast.success(`Welcome ${user.firstName || user.username}!`);
      
      // Call the success callback
      if (onSuccess) {
        onSuccess({ user });
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      const errorMessage = error.response?.data?.msg || 'Google sign-in failed. Please try again.';
      toast.error(errorMessage);
      
      // Call the error callback
      if (onError) {
        onError(error);
      }
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In Failed');
    toast.error('Google sign-in was cancelled or failed');
    
    if (onError) {
      onError(new Error('Google sign-in failed'));
    }
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
      />
    </div>
  );
};

export default GoogleSignInButton;

